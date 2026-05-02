import { LeaderboardEntry } from "../data/gameData";

// This ID identifies this specific game in your shared database
const GAME_ID = "renal-transport-disorder-game";
const FUNCTION_URL = `/.netlify/functions/scores?game=${GAME_ID}`;

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const response = await fetch(FUNCTION_URL);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    return [];
  }
}

export async function saveToLeaderboard(entry: LeaderboardEntry): Promise<{ rank: number; madeIt: boolean }> {
  try {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      body: JSON.stringify(entry),
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error("Failed to save score");

    // After saving, we fetch the updated list to see where the player ranked
    const updatedLeaderboard = await getLeaderboard();
    
    const rank = updatedLeaderboard.findIndex(
      (e) => e.name === entry.name && e.score === entry.score
    ) + 1;

    return { rank, madeIt: rank > 0 && rank <= 15 };
  } catch (error) {
    console.error("Error saving to leaderboard:", error);
    return { rank: -1, madeIt: false };
  }
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}