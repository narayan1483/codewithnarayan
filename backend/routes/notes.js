import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import db from "../db.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
});

const router = express.Router();

// GET /api/notes — list all notes
router.get("/", async (req, res) => {
  await db.read();
  const notes = [...db.data.notes].sort((a, b) => b.id - a.id);
  res.json(notes);
});

// POST /api/notes — publish a new note (admin only). PDF file OR a Drive link — either works.
router.post("/", requireAdmin, upload.single("pdf"), async (req, res) => {
  const { title, subject, pages, level, description, driveLink } = req.body;

  if (!title || !subject || !pages || !level || !description) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: "title, subject, pages, level, and description are required" });
  }

  await db.read();
  const note = {
    id: db.data.nextNoteId++,
    title: title.trim(),
    subject: subject.trim(),
    pages: Number(pages),
    level,
    description: description.trim(),
    file_path: req.file ? req.file.filename : null,
    file_name: req.file ? req.file.originalname : null,
    drive_link: driveLink ? driveLink.trim() : null,
    downloads: 0,
    rating: 5.0,
    created_at: new Date().toISOString(),
  };
  db.data.notes.push(note);
  await db.write();

  res.status(201).json(note);
});

// PUT /api/notes/:id — edit an existing note (admin only). Replaces file only if a new one is sent.
router.put("/:id", requireAdmin, upload.single("pdf"), async (req, res) => {
  await db.read();
  const id = Number(req.params.id);
  const note = db.data.notes.find((n) => n.id === id);
  if (!note) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(404).json({ error: "Note not found" });
  }

  const { title, subject, pages, level, description, driveLink, removeFile } = req.body;

  if (title !== undefined) note.title = title.trim();
  if (subject !== undefined) note.subject = subject.trim();
  if (pages !== undefined) note.pages = Number(pages);
  if (level !== undefined) note.level = level;
  if (description !== undefined) note.description = description.trim();
  if (driveLink !== undefined) note.drive_link = driveLink.trim() || null;

  // If a new file was uploaded, replace the old one
  if (req.file) {
    if (note.file_path) {
      const oldPath = path.join(uploadsDir, note.file_path);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    note.file_path = req.file.filename;
    note.file_name = req.file.originalname;
  } else if (removeFile === "true") {
    if (note.file_path) {
      const oldPath = path.join(uploadsDir, note.file_path);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    note.file_path = null;
    note.file_name = null;
  }

  await db.write();
  res.json(note);
});

// GET /api/notes/:id/download — download the PDF and bump the counter
router.get("/:id/download", async (req, res) => {
  await db.read();
  const note = db.data.notes.find((n) => n.id === Number(req.params.id));
  if (!note) return res.status(404).json({ error: "Note not found" });
  if (!note.file_path) return res.status(404).json({ error: "No file uploaded for this note yet" });

  const filePath = path.join(uploadsDir, note.file_path);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File missing on server" });

  note.downloads = (note.downloads ?? 0) + 1;
  await db.write();

  res.download(filePath, note.file_name || "note.pdf");
});

// DELETE /api/notes/:id — remove a note (admin only)
router.delete("/:id", requireAdmin, async (req, res) => {
  await db.read();
  const id = Number(req.params.id);
  const note = db.data.notes.find((n) => n.id === id);
  if (!note) return res.status(404).json({ error: "Note not found" });

  if (note.file_path) {
    const filePath = path.join(uploadsDir, note.file_path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  db.data.notes = db.data.notes.filter((n) => n.id !== id);
  await db.write();

  res.json({ success: true });
});

export default router;
