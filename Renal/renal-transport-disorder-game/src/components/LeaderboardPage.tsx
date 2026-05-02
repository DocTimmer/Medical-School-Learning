import React, { useState, useEffect } from "react";
import { getLeaderboard, clearLeaderboard, formatTime } from "../utils/leaderboard";
import { LeaderboardEntry } from "../data/gameData";

export const LeaderboardPage: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [filter, setFilter] = useState<"All" | "Quiz" | "Match">("All");
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setEntries(getLeaderboard());
  }, []);

  const filtered = filter === "All" ? entries : entries.filter((e) => e.mode === filter);

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-400";
    if (rank === 2) return "text-slate-300";
    if (rank === 3) return "text-amber-600";
    return "text-slate-500";
  };

  const getModeColor = (mode: string) => {
    return mode === "Quiz" ? "bg-blue-900/50 text-blue-300 border-blue-700" : "bg-emerald-900/50 text-emerald-300 border-emerald-700";
  };

  const handleClear = () => {
    clearLeaderboard();
    setEntries([]);
    setConfirmClear(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-4">
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="text-4xl font-black text-white mb-2">Leaderboard</h1>
          <p className="text-slate-400">Top 15 NephroQuest Champions</p>
        </div>

        {/* Filter + Actions */}
        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
          <div className="flex gap-2">
            {(["All", "Quiz", "Match"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  filter === f
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
                }`}
              >
                {f === "Quiz" ? "🧠 " : f === "Match" ? "🎯 " : "📋 "}{f}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate("quiz")}
              className="px-4 py-2 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-500 text-white transition-all"
            >
              🚀 Play Quiz
            </button>
            <button
              onClick={() => onNavigate("matching")}
              className="px-4 py-2 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition-all"
            >
              🎯 Play Match
            </button>
          </div>
        </div>

        {/* Leaderboard Table */}
        {filtered.length === 0 ? (
          <div className="bg-slate-800/60 border border-slate-700 rounded-3xl p-12 text-center">
            <div className="text-5xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-white mb-2">No scores yet!</h3>
            <p className="text-slate-400 mb-6">Be the first to claim the top spot. Play a game and save your score!</p>
            <button
              onClick={() => onNavigate("quiz")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all"
            >
              🚀 Start Playing
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Top 3 Podium */}
            {filtered.length >= 3 && (
              <div className="flex items-end justify-center gap-4 mb-8 pt-4">
                {/* 2nd */}
                <div className="text-center flex-1 max-w-[140px]">
                  <div className="text-3xl mb-1">🥈</div>
                  <div className="bg-slate-600/80 rounded-t-2xl pt-6 pb-3 px-3 border border-slate-500">
                    <div className="text-white font-bold text-sm truncate">{filtered[1]?.name}</div>
                    <div className="text-yellow-400 font-black">{filtered[1]?.score.toLocaleString()}</div>
                    <div className="text-slate-400 text-xs">{filtered[1]?.mode}</div>
                  </div>
                </div>
                {/* 1st */}
                <div className="text-center flex-1 max-w-[160px]">
                  <div className="text-4xl mb-1 animate-bounce">🥇</div>
                  <div className="bg-gradient-to-b from-yellow-500/20 to-yellow-900/20 rounded-t-2xl pt-8 pb-3 px-3 border-2 border-yellow-500/60">
                    <div className="text-white font-bold text-sm truncate">{filtered[0]?.name}</div>
                    <div className="text-yellow-400 font-black text-lg">{filtered[0]?.score.toLocaleString()}</div>
                    <div className="text-slate-400 text-xs">{filtered[0]?.mode}</div>
                  </div>
                </div>
                {/* 3rd */}
                <div className="text-center flex-1 max-w-[140px]">
                  <div className="text-3xl mb-1">🥉</div>
                  <div className="bg-amber-900/30 rounded-t-2xl pt-4 pb-3 px-3 border border-amber-700/50">
                    <div className="text-white font-bold text-sm truncate">{filtered[2]?.name}</div>
                    <div className="text-yellow-400 font-black">{filtered[2]?.score.toLocaleString()}</div>
                    <div className="text-slate-400 text-xs">{filtered[2]?.mode}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Full Table */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-x-4 px-5 py-3 border-b border-slate-700 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                <span>Rank</span>
                <span>Player</span>
                <span className="text-center">Mode</span>
                <span className="text-right">Score</span>
                <span className="text-right">Accuracy</span>
                <span className="text-right">Time</span>
              </div>
              {filtered.map((entry, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-x-4 px-5 py-4 border-b border-slate-700/50 last:border-0 items-center transition-colors hover:bg-slate-700/30 ${idx < 3 ? "bg-slate-700/20" : ""}`}
                >
                  <div className={`font-black text-lg w-8 text-center ${getRankColor(idx + 1)}`}>
                    {getRankEmoji(idx + 1)}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{entry.name}</div>
                    <div className="text-slate-500 text-xs">{entry.date}</div>
                  </div>
                  <div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg border ${getModeColor(entry.mode)}`}>
                      {entry.mode}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 font-black">{entry.score.toLocaleString()}</div>
                    <div className="text-slate-500 text-xs">pts</div>
                  </div>
                  <div className="text-right">
                    <div className="text-blue-300 font-bold">
                      {Math.round((entry.score / (entry.totalQuestions * 160)) * 100)}%
                    </div>
                    <div className="text-slate-500 text-xs">acc</div>
                  </div>
                  <div className="text-right">
                    <div className="text-purple-300 font-bold">{formatTime(entry.timeTaken)}</div>
                    <div className="text-slate-500 text-xs">time</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Summary */}
        {filtered.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 text-center">
              <div className="text-2xl font-black text-yellow-400">{filtered.length}</div>
              <div className="text-slate-400 text-xs">Total Players</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 text-center">
              <div className="text-2xl font-black text-blue-400">
                {Math.round(filtered.reduce((acc, e) => acc + e.score, 0) / filtered.length).toLocaleString()}
              </div>
              <div className="text-slate-400 text-xs">Avg Score</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 text-center">
              <div className="text-2xl font-black text-emerald-400">
                {Math.max(...filtered.map((e) => e.score)).toLocaleString()}
              </div>
              <div className="text-slate-400 text-xs">High Score</div>
            </div>
          </div>
        )}

        {/* Clear Button */}
        <div className="mt-6 text-center">
          {!confirmClear ? (
            <button
              onClick={() => setConfirmClear(true)}
              className="text-slate-600 hover:text-red-400 text-sm transition-colors"
            >
              Clear Leaderboard
            </button>
          ) : (
            <div className="inline-flex items-center gap-3 bg-red-900/30 border border-red-700 rounded-xl px-4 py-2">
              <span className="text-red-400 text-sm">Are you sure?</span>
              <button onClick={handleClear} className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-lg transition-all">
                Yes, Clear
              </button>
              <button onClick={() => setConfirmClear(false)} className="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded-lg transition-all">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
