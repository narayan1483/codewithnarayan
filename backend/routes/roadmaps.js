import express from "express";
import pool from "../db.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// ─── GET /api/roadmaps ────────────────────────────────────────────
// Sab roadmap tracks fetch karo (public — koi auth nahi chahiye)
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, title, icon, color, description, steps FROM roadmaps ORDER BY updated_at ASC"
    );

    if (rows.length === 0) {
      // DB empty hai — frontend apna INITIAL_ROADMAP_DATA use karega
      return res.json({ roadmaps: null, seeded: false });
    }

    // DB ke rows ko object mein convert karo: { dsa: {...}, java: {...} }
    const roadmapObj = {};
    for (const row of rows) {
      roadmapObj[row.id] = {
        id: row.id,
        title: row.title,
        icon: row.icon,
        color: row.color,
        description: row.description,
        steps: row.steps || [],
      };
    }

    res.json({ roadmaps: roadmapObj, seeded: true });
  } catch (err) {
    console.error("Roadmaps fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch roadmaps" });
  }
});

// ─── POST /api/roadmaps/seed ──────────────────────────────────────
// Admin: INITIAL_ROADMAP_DATA ko DB mein seed karo (ek baar ka kaam)
// Agar already seeded hai to bhi safely update karo (upsert)
router.post("/seed", requireAdmin, async (req, res) => {
  const { roadmaps } = req.body;

  if (!roadmaps || typeof roadmaps !== "object") {
    return res.status(400).json({ error: "roadmaps object required" });
  }

  try {
    const entries = Object.values(roadmaps);

    for (const track of entries) {
      await pool.query(
        `INSERT INTO roadmaps (id, title, icon, color, description, steps)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           title = VALUES(title),
           icon = VALUES(icon),
           color = VALUES(color),
           description = VALUES(description),
           steps = VALUES(steps)`,
        [
          track.id,
          track.title,
          track.icon || "🎯",
          track.color || "#3D5AFE",
          track.description || "",
          JSON.stringify(track.steps || []),
        ]
      );
    }

    res.json({ success: true, seeded: entries.length });
  } catch (err) {
    console.error("Roadmap seed error:", err.message);
    res.status(500).json({ error: "Failed to seed roadmaps" });
  }
});

// ─── POST /api/roadmaps ───────────────────────────────────────────
// Admin: Naya roadmap track create karo
router.post("/", requireAdmin, async (req, res) => {
  const { id, title, icon, color, description, steps } = req.body;

  if (!id || !title) {
    return res.status(400).json({ error: "id and title are required" });
  }

  try {
    await pool.query(
      `INSERT INTO roadmaps (id, title, icon, color, description, steps)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, title, icon || "🎯", color || "#3D5AFE", description || "", JSON.stringify(steps || [])]
    );

    res.status(201).json({ success: true, id });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: `Roadmap '${id}' already exists` });
    }
    console.error("Roadmap create error:", err.message);
    res.status(500).json({ error: "Failed to create roadmap track" });
  }
});

// ─── PUT /api/roadmaps/:id ────────────────────────────────────────
// Admin: Existing track update karo (steps add/edit/delete, title/desc change)
router.put("/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, icon, color, description, steps } = req.body;

  try {
    // Dynamic update — jo bhi field aaye update karo
    const fields = [];
    const values = [];

    if (title !== undefined)       { fields.push("title = ?");       values.push(title); }
    if (icon !== undefined)        { fields.push("icon = ?");        values.push(icon); }
    if (color !== undefined)       { fields.push("color = ?");       values.push(color); }
    if (description !== undefined) { fields.push("description = ?"); values.push(description); }
    if (steps !== undefined)       { fields.push("steps = ?");       values.push(JSON.stringify(steps)); }

    if (fields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    values.push(id); // WHERE clause ke liye
    const [result] = await pool.query(
      `UPDATE roadmaps SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `Roadmap '${id}' not found` });
    }

    res.json({ success: true, id });
  } catch (err) {
    console.error("Roadmap update error:", err.message);
    res.status(500).json({ error: "Failed to update roadmap" });
  }
});

// ─── DELETE /api/roadmaps/:id ─────────────────────────────────────
// Admin: Track delete karo
router.delete("/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM roadmaps WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `Roadmap '${id}' not found` });
    }

    res.json({ success: true, deleted: id });
  } catch (err) {
    console.error("Roadmap delete error:", err.message);
    res.status(500).json({ error: "Failed to delete roadmap track" });
  }
});

export default router;
