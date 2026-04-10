import { readStore, writeStore } from "../_store.js";
import { requireAdminToken } from "./helpers.js";

export default async function handler(req, res) {
  const store = await readStore();
  const { assessmentTypes = [] } = store;

  if (req.method === "GET") {
    return res.status(200).json({ assessmentTypes });
  }

  // Require admin token for write operations
  if (!requireAdminToken(req, res)) return;

  if (req.method === "POST") {
    const newType = req.body;
    if (!newType || !newType.id || !newType.name) {
      return res.status(400).json({ message: "Invalid assessment type payload" });
    }

    // Check if id already exists
    if (assessmentTypes.some(type => type.id === newType.id)) {
      return res.status(400).json({ message: "Assessment type ID already exists" });
    }

    const updatedStore = {
      ...store,
      assessmentTypes: [...assessmentTypes, newType],
    };

    await writeStore(updatedStore);
    return res.status(201).json({ assessmentType: newType });
  }

  if (req.method === "PUT") {
    const updatedType = req.body;
    if (!updatedType || !updatedType.id) {
      return res.status(400).json({ message: "Invalid assessment type payload" });
    }

    const typeIndex = assessmentTypes.findIndex((type) => type.id === updatedType.id);
    if (typeIndex === -1) {
      return res.status(404).json({ message: "Assessment type not found" });
    }

    assessmentTypes[typeIndex] = { ...assessmentTypes[typeIndex], ...updatedType };

    await writeStore({ ...store, assessmentTypes });
    return res.status(200).json({ assessmentType: assessmentTypes[typeIndex] });
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: "Invalid assessment type id" });
    }

    const remainingTypes = assessmentTypes.filter((type) => type.id !== id);
    await writeStore({ ...store, assessmentTypes: remainingTypes });
    return res.status(200).json({ message: "Assessment type deleted" });
  }

  return res.status(405).json({ message: "Method not allowed" });
}