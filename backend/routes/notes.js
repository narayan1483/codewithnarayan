import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import pool from "../db.js";
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
  try {
    const [rows] = await pool.query("SELECT * FROM notes ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching notes:", err.message);
    res.status(500).json({ error: "Failed to load notes" });
  }
});

// POST /api/notes — publish a new note (admin only). PDF file OR a Drive link — either works.
router.post("/", requireAdmin, upload.single("pdf"), async (req, res) => {
  const { title, subject, pages, level, description, driveLink } = req.body;

  if (!title || !subject || !pages || !level || !description) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: "title, subject, pages, level, and description are required" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO notes (title, subject, pages, level, description, file_path, file_name, drive_link, downloads, rating, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 5.0, NOW())`,
      [
        title.trim(),
        subject.trim(),
        Number(pages),
        level,
        description.trim(),
        req.file ? req.file.filename : null,
        req.file ? req.file.originalname : null,
        driveLink ? driveLink.trim() : null,
      ]
    );

    const [rows] = await pool.query("SELECT * FROM notes WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    console.error("Error creating note:", err.message);
    res.status(500).json({ error: "Failed to create note" });
  }
});

// PUT /api/notes/:id — edit an existing note (admin only). Replaces file only if a new one is sent.
router.put("/:id", requireAdmin, upload.single("pdf"), async (req, res) => {
  const id = Number(req.params.id);

  try {
    const [existing] = await pool.query("SELECT * FROM notes WHERE id = ?", [id]);
    if (existing.length === 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: "Note not found" });
    }

    const note = existing[0];
    const { title, subject, pages, level, description, driveLink, removeFile } = req.body;

    const updatedTitle = title !== undefined ? title.trim() : note.title;
    const updatedSubject = subject !== undefined ? subject.trim() : note.subject;
    const updatedPages = pages !== undefined ? Number(pages) : note.pages;
    const updatedLevel = level !== undefined ? level : note.level;
    const updatedDescription = description !== undefined ? description.trim() : note.description;
    const updatedDriveLink = driveLink !== undefined ? (driveLink.trim() || null) : note.drive_link;

    let updatedFilePath = note.file_path;
    let updatedFileName = note.file_name;

    // If a new file was uploaded, replace the old one
    if (req.file) {
      if (note.file_path) {
        const oldPath = path.join(uploadsDir, note.file_path);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updatedFilePath = req.file.filename;
      updatedFileName = req.file.originalname;
    } else if (removeFile === "true") {
      if (note.file_path) {
        const oldPath = path.join(uploadsDir, note.file_path);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updatedFilePath = null;
      updatedFileName = null;
    }

    await pool.query(
      `UPDATE notes SET title=?, subject=?, pages=?, level=?, description=?, file_path=?, file_name=?, drive_link=? WHERE id=?`,
      [updatedTitle, updatedSubject, updatedPages, updatedLevel, updatedDescription, updatedFilePath, updatedFileName, updatedDriveLink, id]
    );

    const [rows] = await pool.query("SELECT * FROM notes WHERE id = ?", [id]);
    res.json(rows[0]);
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    console.error("Error updating note:", err.message);
    res.status(500).json({ error: "Failed to update note" });
  }
});

// GET /api/notes/:id/download — download the PDF and bump the counter
router.get("/:id/download", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM notes WHERE id = ?", [Number(req.params.id)]);
    if (rows.length === 0) return res.status(404).json({ error: "Note not found" });

    const note = rows[0];
    if (!note.file_path) return res.status(404).json({ error: "No file uploaded for this note yet" });

    const filePath = path.join(uploadsDir, note.file_path);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File missing on server" });

    await pool.query("UPDATE notes SET downloads = downloads + 1 WHERE id = ?", [note.id]);

    res.download(filePath, note.file_name || "note.pdf");
  } catch (err) {
    console.error("Error downloading note:", err.message);
    res.status(500).json({ error: "Download failed" });
  }
});

// DELETE /api/notes/:id — remove a note (admin only)
router.delete("/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);

  try {
    const [rows] = await pool.query("SELECT * FROM notes WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Note not found" });

    const note = rows[0];
    if (note.file_path) {
      const filePath = path.join(uploadsDir, note.file_path);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await pool.query("DELETE FROM notes WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting note:", err.message);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

export default router;
