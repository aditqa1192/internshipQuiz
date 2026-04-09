/* eslint-env node */
import { ADMIN_TOKEN } from "./helpers.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { password } = req.body || {};
  const adminPassword = process.env.ADMIN_PORTAL_PASSWORD || "Password123";

  if (password !== adminPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  return res.status(200).json({ token: ADMIN_TOKEN });
}
