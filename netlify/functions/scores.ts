import { getStore } from "@netlify/blobs";

interface ScoreEntry {
  name: string;
  value: number;
  date: string;
}

export const handler = async (event: any) => {
  // Identify which game is calling (e.g., ?game=renal-transport)
  const gameId = event.queryStringParameters?.game || "general";
  
  // Connect to a 'store' named after the specific game
  const store = getStore(gameId);
  
  // Get existing scores or start with an empty list
  let scores: ScoreEntry[] = (await store.get("high-scores", { type: "json" })) || [];

  // --- GET: Fetch top 10 scores ---
  if (event.httpMethod === "GET") {
    const topScores = scores
      .sort((a, b) => b.value - a.value) // Highest score first
      .slice(0, 10);
    
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(topScores),
    };
  }

  // --- POST: Save a new score ---
  if (event.httpMethod === "POST") {
    const newEntry: ScoreEntry = JSON.parse(event.body);
    newEntry.date = new Date().toISOString();

    scores.push(newEntry);
    
    // Save the updated list back to Netlify's cloud memory
    await store.setJSON("high-scores", scores);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Score saved!", entry: newEntry }),
    };
  }

  return { statusCode: 405, body: "Method Not Allowed" };
};