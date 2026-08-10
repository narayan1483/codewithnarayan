import express from "express";
import pool from "../db.js";

const router = express.Router();

// POST /api/contact — save a message
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "name, email, and message are required" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO messages (name, email, message, created_at) VALUES (?, ?, ?, NOW())",
      [name.trim(), email.trim(), message.trim()]
    );
    res.status(201).json({ id: result.insertId, success: true });
  } catch (err) {
    console.error("Error saving message:", err.message);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// GET /api/contact — list messages (for you, the site owner, to read later)
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM messages ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching messages:", err.message);
    res.status(500).json({ error: "Failed to load messages" });
  }
});

export default router;
