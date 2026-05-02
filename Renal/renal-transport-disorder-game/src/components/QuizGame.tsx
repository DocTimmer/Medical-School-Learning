import React, { useState, useEffect, useCallback } from "react";
import { questions, Question, LeaderboardEntry } from "../data/gameData";
import { saveToLeaderboard, formatTime } from "../utils/leaderboard";

type QuizState = "setup" | "playing" | "result" | "review";

const CATEGORIES = ["All Categories", "Clinical Presentation", "Pathophysiology", "Lab Findings", "Management", "Integrative"];
const DIFFICULTIES = ["All Difficulties", "easy", "medium", "hard"];

interface QuizSetup {
  category: string;
  difficulty: string;
  questionCount: number;
}

export const QuizGame: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
  const [state, setState] = useState<QuizState>("setup");
  const [setup, setSetup] = useState<QuizSetup>({ category: "All Categories", difficulty: "All Difficulties", questionCount: 20 });
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [totalTime, setTotalTime] = useState(0);
  const [answers, setAnswers] = useState<{ q: Question; chosen: number | null; correct: boolean }[]>([]);
  const [timedOut, setTimedOut] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [namePrompt, setNamePrompt] = useState(false);
  const [savedRank, setSavedRank] = useState<number | null>(null);
  const [_xpGained, setXpGained] = useState(0);

  // Timer
  useEffect(() => {
    if (state !== "playing" || answered) return;
    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [state, answered, timeLeft]);

  // Total time tracker
  useEffect(() => {
    if (state !== "playing") return;
    const t = setInterval(() => setTotalTime((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [state]);

  const handleTimeout = useCallback(() => {
    if (answered) return;
    setTimedOut(true);
    setAnswered(true);
    setStreak(0);
    const q = quizQuestions[currentIndex];
    setAnswers((prev) => [...prev, { q, chosen: null, correct: false }]);
  }, [answered, quizQuestions, currentIndex]);

  const startQuiz = () => {
    let filtered = questions;
    if (setup.category !== "All Categories") {
      filtered = filtered.filter((q) => q.category === setup.category);
    }
    if (setup.difficulty !== "All Difficulties") {
      filtered = filtered.filter((q) => q.difficulty === setup.difficulty);
    }
    // Shuffle and limit
    const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, setup.questionCount);
    setQuizQuestions(shuffled);
    setCurrentIndex(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTotalTime(0);
    setTimeLeft(30);
    setAnswers([]);
    setTimedOut(false);
    setXpGained(0);
    setState("playing");
  };

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const q = quizQuestions[currentIndex];
    const correct = idx === q.correct;
    let points = 0;
    if (correct) {
      const timeBonus = Math.floor(timeLeft * 2);
      const diffBonus = q.difficulty === "hard" ? 50 : q.difficulty === "medium" ? 30 : 20;
      points = diffBonus + timeBonus;
      setScore((p) => p + points);
      setStreak((p) => {
        const ns = p + 1;
        setBestStreak((b) => Math.max(b, ns));
        return ns;
      });
    } else {
      setStreak(0);
    }
    setXpGained((p) => p + points);
    setAnswers((prev) => [...prev, { q, chosen: idx, correct }]);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= quizQuestions.length) {
      setState("result");
    } else {
      setCurrentIndex((p) => p + 1);
      setSelected(null);
      setAnswered(false);
      setTimedOut(false);
      setTimeLeft(30);
    }
  };

  const handleSaveScore = () => {
    if (!playerName.trim()) return;
    const entry: LeaderboardEntry = {
      name: playerName.trim(),
      score,
      totalQuestions: quizQuestions.length,
      timeTaken: totalTime,
      date: new Date().toLocaleDateString(),
      mode: "Quiz",
    };
    const { rank } = saveToLeaderboard(entry);
    setSavedRank(rank);
    setNamePrompt(false);
  };

  const accuracy = answers.length > 0 ? Math.round((answers.filter((a) => a.correct).length / answers.length) * 100) : 0;

  const timerColor = timeLeft <= 5 ? "text-red-400" : timeLeft <= 10 ? "text-amber-400" : "text-green-400";
  const timerBg = timeLeft <= 5 ? "bg-red-500" : timeLeft <= 10 ? "bg-amber-500" : "bg-green-500";

  // ── SETUP ────────────────────────────────────────────────────────
  if (state === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🧠</div>
            <h1 className="text-3xl font-black text-white mb-2">Quiz Challenge</h1>
            <p className="text-slate-400">Configure your quiz and test your knowledge!</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-slate-300 text-sm font-semibold mb-2 block">📚 Category</label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSetup((p) => ({ ...p, category: c }))}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      setup.category === c
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-slate-300 text-sm font-semibold mb-2 block">⚡ Difficulty</label>
              <div className="flex gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSetup((p) => ({ ...p, difficulty: d }))}
                    className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                      setup.difficulty === d
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {d === "easy" ? "🟢 " : d === "medium" ? "🟡 " : d === "hard" ? "🔴 " : ""}{d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-slate-300 text-sm font-semibold mb-2 block">
                🔢 Questions: <span className="text-blue-400">{setup.questionCount}</span>
              </label>
              <input
                type="range"
                min={5}
                max={36}
                step={5}
                value={setup.questionCount}
                onChange={(e) => setSetup((p) => ({ ...p, questionCount: parseInt(e.target.value) }))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>5</span><span>10</span><span>15</span><span>20</span><span>25</span><span>30</span><span>35+</span>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-xl p-4 text-sm text-slate-300">
              <div className="flex justify-between"><span>⏱ Time per question:</span><span className="text-white font-bold">30 seconds</span></div>
              <div className="flex justify-between mt-1"><span>💎 Points per correct:</span><span className="text-white font-bold">20–50 + time bonus</span></div>
            </div>

            <button
              onClick={startQuiz}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-xl transition-all hover:scale-[1.02] text-lg"
            >
              🚀 Start Quiz!
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── PLAYING ──────────────────────────────────────────────────────
  if (state === "playing") {
    const q = quizQuestions[currentIndex];
    const progress = ((currentIndex) / quizQuestions.length) * 100;
    const diffColor = q.difficulty === "hard" ? "text-red-400 bg-red-900/40" : q.difficulty === "medium" ? "text-amber-400 bg-amber-900/40" : "text-green-400 bg-green-900/40";
    const diffEmoji = q.difficulty === "hard" ? "🔴" : q.difficulty === "medium" ? "🟡" : "🟢";

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
        <div className="max-w-2xl mx-auto">
          {/* HUD */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 bg-slate-700/50 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-slate-400 text-sm whitespace-nowrap">
              {currentIndex + 1}/{quizQuestions.length}
            </span>
          </div>

          <div className="flex justify-between items-center mb-4 gap-3">
            <div className="bg-slate-800/80 rounded-2xl px-4 py-2 border border-slate-700">
              <div className="text-xs text-slate-400">Score</div>
              <div className="text-xl font-black text-yellow-400">{score.toLocaleString()}</div>
            </div>
            <div className={`text-center ${timerColor}`}>
              <div className="text-xs text-slate-400">Time</div>
              <div className="text-4xl font-black tabular-nums">{timeLeft}</div>
              <div className="h-1 w-16 bg-slate-700 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full ${timerBg} transition-all duration-1000 rounded-full`}
                  style={{ width: `${(timeLeft / 30) * 100}%` }}
                />
              </div>
            </div>
            <div className="bg-slate-800/80 rounded-2xl px-4 py-2 border border-slate-700 text-right">
              <div className="text-xs text-slate-400">Streak 🔥</div>
              <div className="text-xl font-black text-orange-400">{streak}x</div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-3xl p-6 mb-4 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${diffColor}`}>
                {diffEmoji} {q.difficulty.toUpperCase()}
              </span>
              <span className="text-xs text-slate-500 bg-slate-700/50 px-3 py-1 rounded-full">{q.category}</span>
              {q.syndrome && (
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  q.syndrome === "Bartter" ? "bg-blue-900/40 text-blue-400" :
                  q.syndrome === "Gitelman" ? "bg-emerald-900/40 text-emerald-400" :
                  "bg-purple-900/40 text-purple-400"
                }`}>
                  {q.syndrome}
                </span>
              )}
            </div>
            <p className="text-white text-lg font-semibold leading-relaxed">{q.question}</p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {q.options.map((opt, i) => {
              let cls = "bg-slate-800/80 border border-slate-700 text-slate-200 hover:border-blue-500 hover:bg-blue-900/30";
              if (answered) {
                if (i === q.correct) cls = "bg-green-900/60 border-2 border-green-500 text-green-200";
                else if (i === selected && !timedOut) cls = "bg-red-900/60 border-2 border-red-500 text-red-200";
                else cls = "bg-slate-800/40 border border-slate-700/50 text-slate-500";
              }
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={answered}
                  className={`w-full text-left px-5 py-4 rounded-2xl font-medium transition-all duration-200 ${cls} ${!answered ? "hover:scale-[1.01] cursor-pointer" : "cursor-default"}`}
                >
                  <span className="text-slate-500 mr-3">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {answered && (
            <div className={`mt-4 p-4 rounded-2xl border ${timedOut ? "bg-slate-800/80 border-slate-600" : selected === q.correct ? "bg-green-900/40 border-green-600" : "bg-red-900/40 border-red-600"}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">
                  {timedOut ? "⏰" : selected === q.correct ? "✅" : "❌"}
                </span>
                <span className={`font-bold ${timedOut ? "text-slate-300" : selected === q.correct ? "text-green-300" : "text-red-300"}`}>
                  {timedOut ? "Time's up! The correct answer is highlighted." : selected === q.correct ? "Correct! Great job! 🎉" : "Incorrect — see the correct answer highlighted in green."}
                </span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{q.explanation}</p>
              <button
                onClick={nextQuestion}
                className="mt-3 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all hover:scale-105"
              >
                {currentIndex + 1 >= quizQuestions.length ? "See Results 🎉" : "Next Question →"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── RESULT ───────────────────────────────────────────────────────
  if (state === "result") {
    const correctCount = answers.filter((a) => a.correct).length;
    const grade = accuracy >= 90 ? { label: "Nephrology Expert! 🏆", color: "text-yellow-400" }
      : accuracy >= 75 ? { label: "Great Work! 🌟", color: "text-green-400" }
      : accuracy >= 60 ? { label: "Good Effort! 💪", color: "text-blue-400" }
      : { label: "Keep Studying! 📚", color: "text-orange-400" };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 shadow-2xl text-center">
            <div className="text-6xl mb-4">{accuracy >= 75 ? "🎉" : accuracy >= 50 ? "💪" : "📚"}</div>
            <h2 className={`text-3xl font-black mb-1 ${grade.color}`}>{grade.label}</h2>
            <p className="text-slate-400 mb-6">Quiz Complete!</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: "Final Score", value: score.toLocaleString(), icon: "💎", color: "text-yellow-400" },
                { label: "Accuracy", value: `${accuracy}%`, icon: "🎯", color: "text-blue-400" },
                { label: "Correct", value: `${correctCount}/${quizQuestions.length}`, icon: "✅", color: "text-green-400" },
                { label: "Best Streak", value: `${bestStreak}x 🔥`, icon: "⚡", color: "text-orange-400" },
                { label: "Time Taken", value: formatTime(totalTime), icon: "⏱", color: "text-purple-400" },
              ].map((stat) => (
                <div key={stat.label} className="bg-slate-700/50 rounded-2xl p-4">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Leaderboard Save */}
            {savedRank ? (
              <div className="bg-yellow-900/40 border border-yellow-600 rounded-2xl p-4 mb-4">
                <div className="text-yellow-400 font-bold text-lg">🏆 Rank #{savedRank} on Leaderboard!</div>
                <p className="text-slate-300 text-sm">Great job, {playerName}!</p>
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
                onClick={() => setState("review")}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all"
              >
                📋 Review Answers
              </button>
              <button
                onClick={() => setState("setup")}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all"
              >
                🔄 Play Again
              </button>
            </div>
            <button
              onClick={() => onNavigate("leaderboard")}
              className="w-full mt-3 py-3 bg-slate-700/50 hover:bg-slate-600 text-slate-300 font-medium rounded-xl transition-all"
            >
              🏆 View Leaderboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── REVIEW ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-white">📋 Answer Review</h2>
          <button
            onClick={() => setState("result")}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all"
          >
            ← Back to Results
          </button>
        </div>
        <div className="space-y-4">
          {answers.map((a, i) => (
            <div
              key={i}
              className={`rounded-2xl p-5 border ${a.correct ? "bg-green-900/20 border-green-700" : "bg-red-900/20 border-red-700"}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{a.correct ? "✅" : "❌"}</span>
                <span className="text-xs text-slate-400">Q{i + 1}</span>
                <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded-full">{a.q.category}</span>
              </div>
              <p className="text-white font-medium mb-3">{a.q.question}</p>
              <div className="space-y-1 mb-3">
                {a.q.options.map((opt, j) => (
                  <div
                    key={j}
                    className={`text-sm px-3 py-2 rounded-lg ${
                      j === a.q.correct ? "bg-green-800/50 text-green-200 font-medium" :
                      j === a.chosen && !a.correct ? "bg-red-800/50 text-red-200" :
                      "text-slate-500"
                    }`}
                  >
                    {String.fromCharCode(65 + j)}. {opt}
                  </div>
                ))}
              </div>
              <div className="bg-slate-700/50 rounded-xl p-3">
                <p className="text-slate-300 text-sm"><span className="text-blue-400 font-bold">💡 Explanation: </span>{a.q.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
