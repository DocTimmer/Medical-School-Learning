import React from "react";

interface HomePageProps {
  onNavigate: (view: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const syndromes = [
    {
      name: "Bartter",
      emoji: "🌊",
      subtitle: "The Loop Diuretic Mimic",
      color: "from-blue-600 to-cyan-600",
      border: "border-blue-500",
      glow: "shadow-blue-500/30",
      facts: ["NKCC2 Defect", "Thick Ascending Limb", "Neonatal Onset", "Hypercalciuria"],
    },
    {
      name: "Gitelman",
      emoji: "🌿",
      subtitle: "The Thiazide Mimic",
      color: "from-emerald-600 to-teal-600",
      border: "border-emerald-500",
      glow: "shadow-emerald-500/30",
      facts: ["NCC Defect", "Distal Convoluted Tubule", "Adolescent Onset", "Salt Craving"],
    },
    {
      name: "Liddle",
      emoji: "⚡",
      subtitle: "Pseudohyperaldosteronism",
      color: "from-purple-600 to-pink-600",
      border: "border-purple-500",
      glow: "shadow-purple-500/30",
      facts: ["ENaC Gain-of-Function", "Collecting Duct", "Hypertension", "Low Renin/Aldosterone"],
    },
  ];

  const gameModes = [
    {
      id: "quiz",
      title: "🧠 Quiz Challenge",
      description: "36 exam-style questions across 5 categories. Test your knowledge under timed pressure!",
      color: "from-blue-600 to-indigo-700",
      badge: "36 Questions",
    },
    {
      id: "matching",
      title: "🎯 Memory Match",
      description: "Match terms to the correct syndrome. Race against the clock to earn bonus points!",
      color: "from-emerald-600 to-teal-700",
      badge: "18 Pairs",
    },
    {
      id: "leaderboard",
      title: "🏆 Leaderboard",
      description: "See the top 15 players. Can you claim the #1 spot?",
      color: "from-amber-500 to-orange-600",
      badge: "Top 15",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-10 animate-pulse"
              style={{
                width: `${20 + Math.random() * 60}px`,
                height: `${20 + Math.random() * 60}px`,
                background: ["#3b82f6", "#10b981", "#a855f7"][i % 3],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto px-4 pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-900/50 border border-blue-700/50 rounded-full px-4 py-1.5 text-blue-300 text-sm mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Educational Game · Nephrology · Hereditary Renal Transport Disorders
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-200 to-purple-300 mb-4 leading-tight">
            NephroQuest
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto mb-3">
            Master <span className="text-white font-bold">Bartter</span>,{" "}
            <span className="text-emerald-300 font-bold">Gitelman</span>, and{" "}
            <span className="text-purple-300 font-bold">Liddle</span> syndromes
            through interactive challenges!
          </p>
          <p className="text-blue-400 text-sm mb-10">
            Clinical presentations · Pathophysiology · Lab findings · Management
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate("quiz")}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-2xl shadow-blue-600/40 hover:shadow-blue-500/60 transition-all duration-200 hover:scale-105 text-lg"
            >
              🚀 Start Playing
            </button>
            <button
              onClick={() => onNavigate("reference")}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-200 hover:scale-105 text-lg backdrop-blur-sm"
            >
              📋 Study Reference
            </button>
          </div>
        </div>
      </div>

      {/* Syndrome Cards */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        <h2 className="text-center text-2xl font-bold text-white mb-6">
          The Three Syndromes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {syndromes.map((s) => (
            <div
              key={s.name}
              className={`bg-slate-800/60 backdrop-blur-sm border ${s.border} rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-xl ${s.glow} shadow-lg`}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-3xl mb-4 shadow-lg`}>
                {s.emoji}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{s.name} Syndrome</h3>
              <p className="text-slate-400 text-sm mb-4 italic">{s.subtitle}</p>
              <div className="space-y-2">
                {s.facts.map((fact) => (
                  <div key={fact} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-green-400">✓</span> {fact}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Game Modes */}
        <h2 className="text-center text-2xl font-bold text-white mb-6">
          Choose Your Challenge
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {gameModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onNavigate(mode.id)}
              className={`bg-gradient-to-br ${mode.color} p-6 rounded-2xl text-left hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl group`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {mode.badge}
                </span>
                <span className="text-white/50 group-hover:text-white transition-colors text-xl">→</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{mode.title}</h3>
              <p className="text-white/80 text-sm">{mode.description}</p>
            </button>
          ))}
        </div>

        {/* Quick Reference Table */}
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">⚡ Quick Reference Cheat Sheet</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left text-slate-400 pb-3 pr-4">Feature</th>
                  <th className="text-center text-blue-400 pb-3 px-4">Bartter 🌊</th>
                  <th className="text-center text-emerald-400 pb-3 px-4">Gitelman 🌿</th>
                  <th className="text-center text-purple-400 pb-3 px-4">Liddle ⚡</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {[
                  ["Transporter", "NKCC2", "NCC", "ENaC↑"],
                  ["Location", "Loop", "DCT", "Collecting Duct"],
                  ["Blood Pressure", "↓ Low", "↓ Low", "↑ HIGH"],
                  ["Renin/Aldo", "↑ High", "↑ High", "↓ Low"],
                  ["Serum Mg²⁺", "Low/Normal", "↓↓ LOW", "Normal"],
                  ["Urine Ca²⁺", "↑ HIGH", "↓ Low", "Normal"],
                  ["Genetics", "AR", "AR", "AD"],
                  ["Treatment", "IV Saline / Indomethacin", "Mg²⁺ Supplements", "Amiloride / Low Na⁺"],
                ].map(([feature, bartter, gitelman, liddle]) => (
                  <tr key={feature} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="py-2.5 pr-4 font-medium text-slate-200">{feature}</td>
                    <td className="py-2.5 px-4 text-center">{bartter}</td>
                    <td className="py-2.5 px-4 text-center">{gitelman}</td>
                    <td className="py-2.5 px-4 text-center">{liddle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
