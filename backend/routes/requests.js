import express from "express";
import pool from "../db.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// POST /api/requests — student submits a note request
router.post("/", async (req, res) => {
  const { name, email, topic, subject } = req.body;
  if (!name || !email || !topic || !subject) {
    return res.status(400).json({ error: "name, email, topic, and subject are required" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO requests (name, email, topic, subject, created_at) VALUES (?, ?, ?, ?, NOW())",
      [name.trim(), email.trim(), topic.trim(), subject.trim()]
    );
    res.status(201).json({ id: result.insertId, success: true, message: "Note request received!" });
  } catch (err) {
    console.error("Error saving note request:", err.message);
    res.status(500).json({ error: "Failed to submit request" });
  }
});

// GET /api/requests — admin lists note requests
router.get("/", requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM requests ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching note requests:", err.message);
    res.status(500).json({ error: "Failed to load requests" });
  }
});

export default router;
