import React from "react";

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-b border-blue-800/50 shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl shadow-lg group-hover:scale-105 transition-transform">
            🧬
          </div>
          <div className="text-left">
            <div className="text-white font-bold text-lg leading-tight">NephroQuest</div>
            <div className="text-blue-300 text-xs">Renal Transport Disorders</div>
          </div>
        </button>

        <nav className="flex items-center gap-1">
          {[
            { id: "home", label: "🏠 Home" },
            { id: "quiz", label: "🧠 Quiz" },
            { id: "matching", label: "🎯 Match" },
            { id: "reference", label: "📋 Reference" },
            { id: "leaderboard", label: "🏆 Scores" },
          ].map((nav) => (
            <button
              key={nav.id}
              onClick={() => onNavigate(nav.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentView === nav.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-blue-200 hover:bg-blue-800/50 hover:text-white"
              }`}
            >
              {nav.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
