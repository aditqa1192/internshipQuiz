import { readStore, writeStore } from "../_store.js";
import { requireAdminToken } from "./helpers.js";

export default async function handler(req, res) {
  if (!requireAdminToken(req, res)) return;

  const store = await readStore();
  const submissions = store.submissions || [];

  if (req.method === "GET") {
    const { id } = req.query;
    if (id) {
      const submission = submissions.find((item) => item.id === Number(id));
      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }
      return res.status(200).json({ submission });
    }
    return res.status(200).json({ submissions: submissions.slice().sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)) });
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    const submissionId = Number(id);
    if (!submissionId) {
      return res.status(400).json({ message: "Invalid submission id" });
    }

    const remaining = submissions.filter((item) => item.id !== submissionId);
    await writeStore({ ...store, submissions: remaining });
    return res.status(200).json({ message: "Submission deleted" });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
