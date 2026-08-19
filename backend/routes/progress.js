import express from "express";
import pool from "../db.js";

const router = express.Router();

const GLOBAL_KEY = "global"; // Ek hi global record — sab users ke liye same

// ─── GET /api/progress ────────────────────────────────────────────
// Global completed IDs fetch karo
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT completed_ids FROM user_progress WHERE email = ?",
      [GLOBAL_KEY]
    );

    if (rows.length === 0) {
      return res.json({ completedIds: [] });
    }

    const completedIds = rows[0].completed_ids || [];
    res.json({ completedIds });
  } catch (err) {
    console.error("Progress fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

// ─── POST /api/progress ───────────────────────────────────────────
// Global completed IDs save/update karo
router.post("/", async (req, res) => {
  const { completedIds } = req.body;

  if (!Array.isArray(completedIds)) {
    return res.status(400).json({ error: "completedIds must be an array" });
  }

  try {
    await pool.query(
      `INSERT INTO user_progress (email, completed_ids)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE completed_ids = VALUES(completed_ids)`,
      [GLOBAL_KEY, JSON.stringify(completedIds)]
    );

    res.json({ success: true, savedCount: completedIds.length });
  } catch (err) {
    console.error("Progress save error:", err.message);
    res.status(500).json({ error: "Failed to save progress" });
  }
});

export default router;
