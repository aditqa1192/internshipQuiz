import { readStore } from "../_store.js";
import { requireAdminToken } from "./helpers.js";

export default async function handler(req, res) {
  if (!requireAdminToken(req, res)) return;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const store = await readStore();
  const submissions = store.submissions || [];
  const questions = store.questions || [];
  const totalSubmissions = submissions.length;
  const avgScore = totalSubmissions
    ? submissions.reduce((sum, item) => sum + (item.score || 0), 0) / totalSubmissions
    : 0;
  const passRate = totalSubmissions
    ? submissions.filter((item) => item.percentage >= 60).length / totalSubmissions
    : 0;
  const latestSubmissions = submissions
    .slice()
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 5);

  return res.status(200).json({
    totalSubmissions,
    averageScore: Number(avgScore.toFixed(1)),
    passRate: Number((passRate * 100).toFixed(1)),
    questionCount: questions.length,
    latestSubmissions,
  });
}
