export function requireAdmin(req, res, next) {
  const provided = req.headers["x-admin-password"];
  const correct = process.env.ADMIN_PASSWORD;

  if (!correct) {
    return res.status(500).json({ error: "Server misconfigured: ADMIN_PASSWORD not set" });
  }
  if (!provided || provided !== correct) {
    return res.status(401).json({ error: "Admin authentication required" });
  }
  next();
}
