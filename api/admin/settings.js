import { readStore, writeStore } from "../_store.js";
import { requireAdminToken } from "./helpers.js";

export default async function handler(req, res) {
  if (!requireAdminToken(req, res)) return;

  const store = await readStore();

  if (req.method === "GET") {
    return res.status(200).json({ settings: store.settings || {} });
  }

  if (req.method === "PATCH") {
    const updates = req.body;
    if (!updates || typeof updates !== "object") {
      return res.status(400).json({ message: "Invalid settings payload" });
    }

    const settings = {
      ...store.settings,
      ...updates,
    };

    await writeStore({ ...store, settings });
    return res.status(200).json({ settings });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
