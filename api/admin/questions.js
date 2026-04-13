import { readStore, writeStore } from "../_store.js";
import { requireAdminToken } from "./helpers.js";

export default async function handler(req, res) {
  if (!requireAdminToken(req, res)) return;

  const store = await readStore();
  const { questions = [] } = store;

  if (req.method === "GET") {
    return res.status(200).json({ questions });
  }

  if (req.method === "POST") {
    const newQuestion = req.body;
    if (!newQuestion || !newQuestion.question || !Array.isArray(newQuestion.options)) {
      return res.status(400).json({ message: "Invalid question payload" });
    }

    const nextId = questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1;
    const questionToSave = {
      id: nextId,
      question: newQuestion.question,
      options: newQuestion.options,
      correctAnswers: Array.isArray(newQuestion.correctAnswers)
        ? newQuestion.correctAnswers
        : [],
      type: newQuestion.type || "single",
      assessmentType: newQuestion.assessmentType || "cybersecurity",
      enabled: newQuestion.enabled !== false,
    };

    const updatedStore = {
      ...store,
      questions: [...questions, questionToSave],
    };

    await writeStore(updatedStore);
    return res.status(201).json({ question: questionToSave });
  }

  if (req.method === "PUT") {
    const updatedQuestion = req.body;
    if (!updatedQuestion || typeof updatedQuestion.id !== "number") {
      return res.status(400).json({ message: "Invalid question payload" });
    }

    const questionIndex = questions.findIndex((q) => q.id === updatedQuestion.id);
    if (questionIndex === -1) {
      return res.status(404).json({ message: "Question not found" });
    }

    questions[questionIndex] = {
      ...questions[questionIndex],
      ...updatedQuestion,
      correctAnswers: Array.isArray(updatedQuestion.correctAnswers)
        ? updatedQuestion.correctAnswers
        : questions[questionIndex].correctAnswers,
    };

    await writeStore({ ...store, questions });
    return res.status(200).json({ question: questions[questionIndex] });
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    const questionId = Number(id);
    if (!questionId) {
      return res.status(400).json({ message: "Invalid question id" });
    }

    const remainingQuestions = questions.filter((q) => q.id !== questionId);
    await writeStore({ ...store, questions: remainingQuestions });
    return res.status(200).json({ message: "Question deleted" });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
