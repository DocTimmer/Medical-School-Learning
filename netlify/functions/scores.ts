import { getStore } from "@netlify/blobs";

interface Score {
  name: string;
  value: number;
  date: string;
}

export const handler = async (event: any) => {
  const store = getStore("leaderboard");
  let scores: Score[] = (await store.get("high-scores", { type: "json" })) || [];

  if (event.httpMethod === "GET") {
    const topScores = scores.sort((a, b) => b.value - a.value).slice(0, 10);
    return { statusCode: 200, body: JSON.stringify(topScores) };
  }

  if (event.httpMethod === "POST") {
    const newScore: Score = JSON.parse(event.body);
    newScore.date = new Date().toISOString();
    scores.push(newScore);
    await store.setJSON("high-scores", scores);
    return { statusCode: 201, body: JSON.stringify(newScore) };
  }

  return { statusCode: 405, body: "Method Not Allowed" };
};