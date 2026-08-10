import express from "express";
import db from "../db.js";

const router = express.Router();

// POST /api/contact — save a message
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "name, email, and message are required" });
  }

  await db.read();
  const entry = {
    id: db.data.nextMessageId++,
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    created_at: new Date().toISOString(),
  };
  db.data.messages.push(entry);
  await db.write();

  res.status(201).json({ id: entry.id, success: true });
});

// GET /api/contact — list messages (for you, the site owner, to read later)
router.get("/", async (req, res) => {
  await db.read();
  const messages = [...db.data.messages].sort((a, b) => b.id - a.id);
  res.json(messages);
});

export default router;
