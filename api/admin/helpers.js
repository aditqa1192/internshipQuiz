/* eslint-env node */
const ADMIN_TOKEN = process.env.ADMIN_PORTAL_TOKEN || "admin-portal-token";

function requireAdminToken(req, res) {
  const tokenHeader = req.headers["x-admin-token"] || req.headers["X-Admin-Token"];
  const token = typeof tokenHeader === "string" ? tokenHeader : undefined;
  if (!token || token !== ADMIN_TOKEN) {
    res.status(401).json({ message: "Unauthorized" });
    return false;
  }
  return true;
}

export { requireAdminToken, ADMIN_TOKEN };
