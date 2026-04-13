import { readStore } from "../../api/_store.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const store = await readStore();
  return res.status(200).json({ settings: store.settings || {} });
}
