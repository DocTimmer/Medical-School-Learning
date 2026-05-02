import React, { useState, useEffect, useCallback } from "react";
import { matchingPairs, LeaderboardEntry } from "../data/gameData";
import { saveToLeaderboard, formatTime } from "../utils/leaderboard";

type GameState = "setup" | "playing" | "complete";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

interface CardItem {
  id: string;
  pairId: number;
  content: string;
  type: "term" | "match";
  category: string;
}

export const MatchingGame: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
  const [gameState, setGameState] = useState<GameState>("setup");
  const [selectedCount, setSelectedCount] = useState(8);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [namePrompt, setNamePrompt] = useState(false);
  const [savedRank, setSavedRank] = useState<number | null>(null);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [lastPoints, setLastPoints] = useState<{ id: string; pts: number } | null>(null);

  useEffect(() => {
    if (gameState !== "playing") return;
    const t = setInterval(() => setTimer((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [gameState]);

  const startGame = () => {
    const chosen = shuffle(matchingPairs).slice(0, selectedCount);
    const deck: CardItem[] = shuffle([
      ...chosen.map((p) => ({
        id: `t-${p.id}`,
        pairId: p.id,
        content: p.term,
        type: "term" as const,
        category: p.category,
      })),
      ...chosen.map((p) => ({
        id: `m-${p.id}`,
        pairId: p.id,
        content: p.match,
        type: "match" as const,
        category: p.category,
      })),
    ]);
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setWrong([]);
    setAttempts(0);
    setScore(0);
    setTimer(0);
    setCombo(0);
    setBestCombo(0);
    setLastPoints(null);
    setSavedRank(null);
    setNamePrompt(false);
    setGameState("playing");
  };

  const handleCardClick = useCallback(
    (cardId: string) => {
      if (flipped.length === 2) return;
      if (flipped.includes(cardId)) return;
      if (matched.includes(cardId)) return;
      if (wrong.includes(cardId)) return;

      const newFlipped = [...flipped, cardId];
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        setAttempts((p) => p + 1);
        const [a, b] = newFlipped.map((id) => cards.find((c) => c.id === id)!);
        if (a.pairId === b.pairId && a.type !== b.type) {
          // Match!
          const newCombo = combo + 1;
          setCombo(newCombo);
          setBestCombo((bc) => Math.max(bc, newCombo));
          const timeBonus = Math.max(0, 100 - timer);
          const comboBonus = newCombo > 1 ? newCombo * 20 : 0;
          const pts = 100 + timeBonus + comboBonus;
          setScore((s) => s + pts);
          setLastPoints({ id: cardId, pts });
          setTimeout(() => setLastPoints(null), 1500);
          setTimeout(() => {
            setMatched((prev) => {
              const nm = [...prev, a.id, b.id];
              if (nm.length === cards.length) {
                setGameState("complete");
              }
              return nm;
            });
            setFlipped([]);
          }, 600);
        } else {
          // Wrong
          setCombo(0);
          setWrong(newFlipped);
          setTimeout(() => {
            setWrong([]);
            setFlipped([]);
          }, 1000);
        }
      }
    },
    [flipped, matched, wrong, cards, combo, timer]
  );

  const handleSaveScore = () => {
    if (!playerName.trim()) return;
    const entry: LeaderboardEntry = {
      name: playerName.trim(),
      score,
      totalQuestions: selectedCount,
      timeTaken: timer,
      date: new Date().toLocaleDateString(),
      mode: "Match",
    };
    const { rank } = saveToLeaderboard(entry);
    setSavedRank(rank);
    setNamePrompt(false);
  };

  const accuracy = attempts > 0 ? Math.round((matched.length / 2 / attempts) * 100) : 0;

  // ── SETUP ─────────────────────────────────────────────────────────
  if (gameState === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 shadow-2xl text-center">
          <div className="text-5xl mb-4">🎯</div>
          <h1 className="text-3xl font-black text-white mb-2">Memory Match</h1>
          <p className="text-slate-400 mb-8">Match terms to their correct syndrome. Chain combos for bonus points!</p>

          <div className="mb-6">
            <label className="text-slate-300 text-sm font-semibold mb-3 block">🃏 Number of Pairs</label>
            <div className="grid grid-cols-4 gap-2">
              {[6, 8, 10, 18].map((n) => (
                <button
                  key={n}
                  onClick={() => setSelectedCount(n)}
                  className={`py-3 rounded-xl font-bold transition-all ${
                    selectedCount === n
                      ? "bg-emerald-600 text-white shadow-lg scale-105"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {n}
                  {n === 18 && <div className="text-xs opacity-70">All</div>}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-xl p-4 text-sm text-slate-300 mb-6 space-y-1 text-left">
            <div className="flex justify-between"><span>🃏 Total cards:</span><span className="text-white font-bold">{selectedCount * 2}</span></div>
            <div className="flex justify-between"><span>💎 Base points/match:</span><span className="text-white font-bold">100 + time bonus</span></div>
            <div className="flex justify-between"><span>🔥 Combo bonus:</span><span className="text-white font-bold">+20 per streak</span></div>
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl shadow-xl transition-all hover:scale-[1.02] text-lg"
          >
            🚀 Start Matching!
          </button>
        </div>
      </div>
    );
  }

  // ── PLAYING ───────────────────────────────────────────────────────
  if (gameState === "playing") {
    const cols = selectedCount <= 6 ? 3 : selectedCount <= 8 ? 4 : 4;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
        <div className="max-w-3xl mx-auto">
          {/* HUD */}
          <div className="flex justify-between items-center mb-4 gap-3">
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-2 text-center">
              <div className="text-xs text-slate-400">Score</div>
              <div className="text-2xl font-black text-yellow-400">{score.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-2 text-center">
              <div className="text-xs text-slate-400">Time</div>
              <div className="text-2xl font-black text-blue-400">{formatTime(timer)}</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-2 text-center">
              <div className="text-xs text-slate-400">Matches</div>
              <div className="text-2xl font-black text-green-400">{matched.length / 2}/{selectedCount}</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-2 text-center">
              <div className="text-xs text-slate-400">Combo 🔥</div>
              <div className="text-2xl font-black text-orange-400">{combo}x</div>
            </div>
          </div>

          {/* Progress */}
          <div className="w-full bg-slate-700/50 rounded-full h-2 mb-5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 rounded-full"
              style={{ width: `${(matched.length / cards.length) * 100}%` }}
            />
          </div>

          {/* Hint */}
          <p className="text-center text-slate-500 text-xs mb-4">
            Match each <span className="text-blue-400 font-semibold">term/feature</span> with the correct <span className="text-purple-400 font-semibold">syndrome name</span>
          </p>

          {/* Cards Grid */}
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {cards.map((card) => {
              const isFlipped = flipped.includes(card.id);
              const isMatched = matched.includes(card.id);
              const isWrong = wrong.includes(card.id);
              const isSelected = isFlipped && !isMatched;



              let cardClass = "bg-slate-700/80 border-2 border-slate-600 text-slate-300 hover:border-blue-500 hover:bg-slate-600 cursor-pointer";
              if (isMatched) {
                cardClass = card.content === "Bartter Syndrome"
                  ? "border-2 border-blue-500 bg-blue-900/50 text-blue-200 cursor-default"
                  : card.content === "Gitelman Syndrome"
                  ? "border-2 border-emerald-500 bg-emerald-900/50 text-emerald-200 cursor-default"
                  : card.content === "Liddle Syndrome"
                  ? "border-2 border-purple-500 bg-purple-900/50 text-purple-200 cursor-default"
                  : "border-2 border-green-500 bg-green-900/30 text-green-200 cursor-default";
              } else if (isWrong) {
                cardClass = "border-2 border-red-500 bg-red-900/50 text-red-200 cursor-default animate-pulse";
              } else if (isSelected) {
                cardClass = "border-2 border-yellow-400 bg-yellow-900/40 text-yellow-200 cursor-pointer shadow-lg shadow-yellow-500/20 scale-105";
              }

              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={isMatched || (flipped.length === 2 && !isFlipped)}
                  className={`relative min-h-[80px] px-3 py-3 rounded-2xl text-sm font-medium transition-all duration-200 text-center leading-tight ${cardClass}`}
                >
                  {isMatched && (
                    <span className="absolute top-1 right-1 text-xs">✓</span>
                  )}
                  <div className="text-xs font-bold opacity-60 mb-1 uppercase tracking-wide">{card.category}</div>
                  <div>{card.content}</div>
                  {lastPoints && lastPoints.id === card.id && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-400 font-black text-sm animate-bounce whitespace-nowrap">
                      +{lastPoints.pts} pts!
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── COMPLETE ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 shadow-2xl text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-black text-emerald-400 mb-1">All Matched!</h2>
        <p className="text-slate-400 mb-6">You found all {selectedCount} pairs!</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { label: "Final Score", value: score.toLocaleString(), icon: "💎", color: "text-yellow-400" },
            { label: "Accuracy", value: `${accuracy}%`, icon: "🎯", color: "text-blue-400" },
            { label: "Time", value: formatTime(timer), icon: "⏱", color: "text-purple-400" },
            { label: "Best Combo", value: `${bestCombo}x`, icon: "🔥", color: "text-orange-400" },
            { label: "Attempts", value: attempts.toString(), icon: "🃏", color: "text-slate-300" },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-700/50 rounded-2xl p-4">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {savedRank ? (
          <div className="bg-yellow-900/40 border border-yellow-600 rounded-2xl p-4 mb-4">
            <div className="text-yellow-400 font-bold text-lg">🏆 Rank #{savedRank} on Leaderboard!</div>
            <p className="text-slate-300 text-sm">Well done, {playerName}!</p>
          </div>
        ) : !namePrompt ? (
          <button
            onClick={() => setNamePrompt(true)}
            className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold rounded-2xl shadow-xl transition-all hover:scale-[1.02] mb-4"
          >
            🏆 Save to Leaderboard
          </button>
        ) : (
          <div className="mb-4 space-y-3">
            <input
              type="text"
              placeholder="Enter your name..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveScore()}
              maxLength={20}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500"
            />
            <button
              onClick={handleSaveScore}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl transition-all hover:scale-[1.02]"
            >
              Save Score ✓
            </button>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={startGame}
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all"
          >
            🔄 Play Again
          </button>
          <button
            onClick={() => onNavigate("leaderboard")}
            className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-xl transition-all"
          >
            🏆 Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};
