import { useState } from "react";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { QuizGame } from "./components/QuizGame";
import { MatchingGame } from "./components/MatchingGame";
import { ReferencePage } from "./components/ReferencePage";
import { LeaderboardPage } from "./components/LeaderboardPage";

type View = "home" | "quiz" | "matching" | "reference" | "leaderboard";

export default function App() {
  const [view, setView] = useState<View>("home");

  const navigate = (v: string) => {
    setView(v as View);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header currentView={view} onNavigate={navigate} />
      <main>
        {view === "home" && <HomePage onNavigate={navigate} />}
        {view === "quiz" && <QuizGame onNavigate={navigate} />}
        {view === "matching" && <MatchingGame onNavigate={navigate} />}
        {view === "reference" && <ReferencePage />}
        {view === "leaderboard" && <LeaderboardPage onNavigate={navigate} />}
      </main>
    </div>
  );
}
