import express from "express";
import pool from "../db.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// POST /api/admin/login — check password
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

// GET /api/admin/stats — return real-time website analytics for admin
router.get("/stats", requireAdmin, async (req, res) => {
  try {
    const [[notesCount]] = await pool.query("SELECT COUNT(*) as totalNotes, SUM(downloads) as totalDownloads FROM notes");
    const [[messagesCount]] = await pool.query("SELECT COUNT(*) as totalMessages FROM messages");
    const [[requestsCount]] = await pool.query("SELECT COUNT(*) as totalRequests FROM requests");

    res.json({
      totalNotes: notesCount.totalNotes || 0,
      totalDownloads: Number(notesCount.totalDownloads || 0),
      totalMessages: messagesCount.totalMessages || 0,
      totalRequests: requestsCount.totalRequests || 0,
    });
  } catch (err) {
    console.error("Error fetching admin stats:", err.message);
    res.status(500).json({ error: "Failed to load stats" });
  }
});

export default router;
