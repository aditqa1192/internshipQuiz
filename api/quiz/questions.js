import { readStore } from "../../api/_store.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { assessmentType } = req.query;
  const store = await readStore();
  const questions = (store.questions || []).filter(
    (question) => question.enabled !== false && question.assessmentType === assessmentType
  );

  return res.status(200).json({ questions });
}
