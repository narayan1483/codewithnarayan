import express from "express";
import pool from "../db.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// ─── GET /api/topic-notes/:topicId ────────────────────────────────
// Public: Ek topic ke sare pages fetch karo (sorted by page_number)
router.get("/:topicId", async (req, res) => {
  const { topicId } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT id, topic_id, roadmap_id, page_number, page_title, content, updated_at FROM topic_notes WHERE topic_id = ? ORDER BY page_number ASC",
      [topicId]
    );
    res.json({ pages: rows });
  } catch (err) {
    console.error("Topic notes fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch topic notes" });
  }
});

// ─── POST /api/topic-notes ────────────────────────────────────────
// Admin: Naya page create karo
router.post("/", requireAdmin, async (req, res) => {
  const { topicId, roadmapId, pageNumber, pageTitle, content } = req.body;

  if (!topicId || !pageTitle || !content) {
    return res.status(400).json({ error: "topicId, pageTitle, and content are required" });
  }

  try {
    // Auto page number if not provided
    let pNum = pageNumber;
    if (!pNum) {
      const [[maxRow]] = await pool.query(
        "SELECT MAX(page_number) as maxPage FROM topic_notes WHERE topic_id = ?",
        [topicId]
      );
      pNum = (maxRow.maxPage || 0) + 1;
    }

    const [result] = await pool.query(
      `INSERT INTO topic_notes (topic_id, roadmap_id, page_number, page_title, content)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         page_title = VALUES(page_title),
         content = VALUES(content),
         roadmap_id = VALUES(roadmap_id)`,
      [topicId, roadmapId || "", pNum, pageTitle, content]
    );

    // Newly inserted ya updated page fetch karo
    const insertId = result.insertId || null;
    let page;
    if (insertId) {
      const [[row]] = await pool.query("SELECT * FROM topic_notes WHERE id = ?", [insertId]);
      page = row;
    } else {
      const [[row]] = await pool.query(
        "SELECT * FROM topic_notes WHERE topic_id = ? AND page_number = ?",
        [topicId, pNum]
      );
      page = row;
    }

    res.status(201).json({ success: true, page });
  } catch (err) {
    console.error("Topic note create error:", err.message);
    res.status(500).json({ error: "Failed to create topic note page" });
  }
});

// ─── PUT /api/topic-notes/:id ─────────────────────────────────────
// Admin: Existing page edit karo
router.put("/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { pageTitle, content, pageNumber } = req.body;

  try {
    const fields = [];
    const values = [];

    if (pageTitle !== undefined) { fields.push("page_title = ?"); values.push(pageTitle); }
    if (content !== undefined)   { fields.push("content = ?");    values.push(content); }
    if (pageNumber !== undefined){ fields.push("page_number = ?"); values.push(pageNumber); }

    if (fields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    values.push(id);
    const [result] = await pool.query(
      `UPDATE topic_notes SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Topic note page not found" });
    }

    // Updated page fetch karo
    const [[page]] = await pool.query("SELECT * FROM topic_notes WHERE id = ?", [id]);
    res.json({ success: true, page });
  } catch (err) {
    console.error("Topic note update error:", err.message);
    res.status(500).json({ error: "Failed to update topic note page" });
  }
});

// ─── DELETE /api/topic-notes/:id ──────────────────────────────────
// Admin: Page delete karo
router.delete("/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM topic_notes WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Topic note page not found" });
    }

    res.json({ success: true, deleted: id });
  } catch (err) {
    console.error("Topic note delete error:", err.message);
    res.status(500).json({ error: "Failed to delete topic note page" });
  }
});

export default router;
