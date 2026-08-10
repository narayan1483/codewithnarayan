import express from "express";

const router = express.Router();

// POST /api/admin/login — check password, no session/token complexity needed
router.post("/login", (req, res) => {
  const { password } = req.body;
  const correct = process.env.ADMIN_PASSWORD;

  if (!correct) {
    return res.status(500).json({ error: "Server misconfigured: ADMIN_PASSWORD not set" });
  }
  if (password !== correct) {
    return res.status(401).json({ error: "Incorrect password" });
  }
  res.json({ success: true });
});

export default router;
