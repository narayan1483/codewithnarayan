import express from "express";
import pool from "../db.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

const DEFAULT_CATEGORIES = [
  {
    id: "all_notes",
    title: "All Notes & Handbooks",
    subtitle: "Handwritten notes, PDF guides & DSA sheets to ace your exams & SDE interviews.",
    badgeText: "All CS Notes",
    badge: "25+ Notes",
    ribbon: "",
    iconName: "FileText",
    gradient: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
    badgeColor: "#10B981",
    glowColor: "rgba(16, 185, 129, 0.25)",
    actionType: "all_notes",
    target: "all",
    customUrl: "",
    sortOrder: 1,
  },
  {
    id: "cheatsheets",
    title: "Cheatsheets & Handbooks",
    subtitle: "Quick syntax sheets, one-liners & interview reference handbooks for fast revision.",
    badgeText: "Contest Solutions",
    badge: "Cheatcodes",
    ribbon: "",
    iconName: "Zap",
    gradient: "linear-gradient(135deg, #E11D48 0%, #F43F5E 100%)",
    badgeColor: "#F43F5E",
    glowColor: "rgba(244, 63, 94, 0.25)",
    actionType: "section",
    target: "cheatsheets",
    customUrl: "",
    sortOrder: 2,
  },
  {
    id: "sysdesign",
    title: "System Design & Core CS",
    subtitle: "Complete LLD & HLD architectures, DBMS, Operating Systems & Networking notes.",
    badgeText: "System Design",
    badge: "Handwritten",
    ribbon: "",
    iconName: "Layers",
    gradient: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)",
    badgeColor: "#F59E0B",
    glowColor: "rgba(245, 158, 11, 0.25)",
    actionType: "subject",
    target: "System Design",
    customUrl: "",
    sortOrder: 3,
  },
  {
    id: "roadmap",
    title: "Developer Roadmaps",
    subtitle: "Step-by-step career tracks for Frontend, Backend, DevOps & DSA mastery.",
    badgeText: "Roadmaps",
    badge: "2026 Updated",
    ribbon: "COMING SOON",
    iconName: "Compass",
    gradient: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)",
    badgeColor: "#8B5CF6",
    glowColor: "rgba(139, 92, 246, 0.25)",
    actionType: "section",
    target: "roadmap",
    customUrl: "",
    sortOrder: 4,
  },
  {
    id: "quiz",
    title: "Daily Interview Placement Quiz",
    subtitle: "Interactive daily quizzes, MCQs & instant score checks with solutions.",
    badgeText: "Daily Quiz",
    badge: "Interactive",
    ribbon: "",
    iconName: "Trophy",
    gradient: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
    badgeColor: "#3B82F6",
    glowColor: "rgba(59, 130, 246, 0.25)",
    actionType: "section",
    target: "quiz",
    customUrl: "",
    sortOrder: 5,
  },
  {
    id: "interview_prep",
    title: "600+ Interview Q&A Sheets",
    subtitle: "600+ Placement & Technical interview questions, answers and practice sheets.",
    badgeText: "Interview Prep",
    badge: "600+ Questions",
    ribbon: "",
    iconName: "HelpCircle",
    gradient: "linear-gradient(135deg, #0D9488 0%, #06B6D4 100%)",
    badgeColor: "#06B6D4",
    glowColor: "rgba(6, 182, 212, 0.25)",
    actionType: "subject",
    target: "Placement Preparation",
    customUrl: "",
    sortOrder: 6,
  },
];

// Helper to normalize DB row to camelCase
function normalizeHub(row) {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    badgeText: row.badge_text,
    badge: row.badge || "",
    ribbon: row.ribbon || "",
    iconName: row.icon_name || "FileText",
    gradient: row.gradient,
    badgeColor: row.badge_color,
    glowColor: row.glow_color,
    actionType: row.action_type || "subject",
    target: row.target || "",
    customUrl: row.custom_url || "",
    sortOrder: row.sort_order || 0,
  };
}

// ─── GET /api/hubs (Public) ───────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    // Auto-migrate old 'bundles' hub to 'quiz'
    await pool.query(
      `UPDATE category_hubs 
       SET id='quiz', title='Daily Placement Quiz', subtitle='Interactive daily placement quizzes, MCQs & instant score checks with solutions.', badge_text='Daily Quiz', badge='Daily Quiz', icon_name='Trophy', action_type='section', target='quiz' 
       WHERE id='bundles'`
    ).catch(() => {});

    const [rows] = await pool.query(
      "SELECT * FROM category_hubs ORDER BY sort_order ASC, updated_at ASC"
    );

    if (rows.length === 0) {
      // Auto seed defaults
      for (const item of DEFAULT_CATEGORIES) {
        await pool.query(
          `INSERT INTO category_hubs 
           (id, title, subtitle, badge_text, badge, ribbon, icon_name, gradient, badge_color, glow_color, action_type, target, custom_url, sort_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE title=VALUES(title)`,
          [
            item.id,
            item.title,
            item.subtitle,
            item.badgeText,
            item.badge,
            item.ribbon,
            item.iconName,
            item.gradient,
            item.badgeColor,
            item.glowColor,
            item.actionType,
            item.target,
            item.customUrl,
            item.sortOrder,
          ]
        );
      }
      return res.json({ hubs: DEFAULT_CATEGORIES, seeded: true });
    }

    res.json({ hubs: rows.map(normalizeHub), seeded: true });
  } catch (err) {
    console.error("Hubs fetch error:", err.message);
    // Return defaults as graceful fallback
    res.json({ hubs: DEFAULT_CATEGORIES, fallback: true });
  }
});

// ─── POST /api/hubs (Admin only) ──────────────────────────────────
router.post("/", requireAdmin, async (req, res) => {
  const {
    id,
    title,
    subtitle,
    badgeText,
    badge,
    ribbon,
    iconName,
    gradient,
    badgeColor,
    glowColor,
    actionType,
    target,
    customUrl,
  } = req.body;

  if (!title || !subtitle || !badgeText) {
    return res.status(400).json({ error: "Title, subtitle, and badgeText are required." });
  }

  const hubId = id || `hub_${Date.now()}`;

  try {
    await pool.query(
      `INSERT INTO category_hubs 
       (id, title, subtitle, badge_text, badge, ribbon, icon_name, gradient, badge_color, glow_color, action_type, target, custom_url, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        hubId,
        title,
        subtitle,
        badgeText,
        badge || "",
        ribbon || "",
        iconName || "FileText",
        gradient || "linear-gradient(135deg, #059669 0%, #10B981 100%)",
        badgeColor || "#10B981",
        glowColor || "rgba(16, 185, 129, 0.25)",
        actionType || "subject",
        target || "",
        customUrl || "",
        Date.now(),
      ]
    );

    res.status(201).json({ success: true, id: hubId });
  } catch (err) {
    console.error("Hub create error:", err.message);
    res.status(500).json({ error: "Failed to create category hub" });
  }
});

// ─── PUT /api/hubs/:id (Admin only) ───────────────────────────────
router.put("/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const {
    title,
    subtitle,
    badgeText,
    badge,
    ribbon,
    iconName,
    gradient,
    badgeColor,
    glowColor,
    actionType,
    target,
    customUrl,
  } = req.body;

  try {
    await pool.query(
      `UPDATE category_hubs SET
        title = ?,
        subtitle = ?,
        badge_text = ?,
        badge = ?,
        ribbon = ?,
        icon_name = ?,
        gradient = ?,
        badge_color = ?,
        glow_color = ?,
        action_type = ?,
        target = ?,
        custom_url = ?
       WHERE id = ?`,
      [
        title,
        subtitle,
        badgeText,
        badge || "",
        ribbon || "",
        iconName || "FileText",
        gradient,
        badgeColor,
        glowColor,
        actionType,
        target || "",
        customUrl || "",
        id,
      ]
    );

    res.json({ success: true, id });
  } catch (err) {
    console.error("Hub update error:", err.message);
    res.status(500).json({ error: "Failed to update category hub" });
  }
});

// ─── DELETE /api/hubs/:id (Admin only) ────────────────────────────
router.delete("/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM category_hubs WHERE id = ?", [id]);
    res.json({ success: true, deleted: id });
  } catch (err) {
    console.error("Hub delete error:", err.message);
    res.status(500).json({ error: "Failed to delete category hub" });
  }
});

// ─── POST /api/hubs/reset (Admin only) ────────────────────────────
router.post("/reset", requireAdmin, async (req, res) => {
  try {
    await pool.query("DELETE FROM category_hubs");

    for (const item of DEFAULT_CATEGORIES) {
      await pool.query(
        `INSERT INTO category_hubs 
         (id, title, subtitle, badge_text, badge, ribbon, icon_name, gradient, badge_color, glow_color, action_type, target, custom_url, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.title,
          item.subtitle,
          item.badgeText,
          item.badge,
          item.ribbon,
          item.iconName,
          item.gradient,
          item.badgeColor,
          item.glowColor,
          item.actionType,
          item.target,
          item.customUrl,
          item.sortOrder,
        ]
      );
    }

    res.json({ success: true, hubs: DEFAULT_CATEGORIES });
  } catch (err) {
    console.error("Hub reset error:", err.message);
    res.status(500).json({ error: "Failed to reset category hubs" });
  }
});

export default router;
