import React, { useState, useEffect } from "react";
import { Sparkles, Flame, X, ArrowRight, Pencil, Check } from "lucide-react";

const ANNOUNCEMENT_STORAGE_KEY = "codewithnarayan_custom_announcement";

export default function AnnouncementBanner({ isAdmin }) {
  const [visible, setVisible] = useState(true);
  const [streak, setStreak] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [announcementText, setAnnouncementText] = useState(() => {
    return localStorage.getItem(ANNOUNCEMENT_STORAGE_KEY) || "🚀 New: Interactive Roadmaps, Code Cheatsheets & Placement Quiz are live!";
  });
  const [editText, setEditText] = useState(announcementText);

  useEffect(() => {
    try {
      const today = new Date().toDateString();
      const lastVisit = localStorage.getItem("codewithnarayan_last_visit");
      const currentStreak = Number(localStorage.getItem("codewithnarayan_streak") || 1);

      if (lastVisit) {
        const lastDate = new Date(lastVisit);
        const diffDays = Math.round((new Date(today) - lastDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          const newStreak = currentStreak + 1;
          setStreak(newStreak);
          localStorage.setItem("codewithnarayan_streak", newStreak);
        } else if (diffDays > 1) {
          setStreak(1);
          localStorage.setItem("codewithnarayan_streak", 1);
        } else {
          setStreak(currentStreak);
        }
      }
      localStorage.setItem("codewithnarayan_last_visit", today);
    } catch (e) {}
  }, []);

  const saveEdit = () => {
    setAnnouncementText(editText);
    localStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, editText);
    setIsEditing(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        background: "linear-gradient(90deg, #14151A 0%, #202430 50%, #14151A 100%)",
        color: "#fff",
        padding: "7px 16px",
        fontSize: 12.5,
        fontFamily: "'Sora', sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        <span
          style={{
            background: "rgba(255, 77, 109, 0.2)",
            color: "#FF4D6D",
            border: "1px solid rgba(255, 77, 109, 0.4)",
            fontSize: 11,
            fontWeight: 700,
            padding: "1px 6px",
            borderRadius: 4,
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Flame size={12} color="#FF4D6D" /> {streak}-Day Streak
        </span>

        {isEditing ? (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid #B4FF39",
                borderRadius: 4,
                color: "#fff",
                fontSize: 12,
                padding: "2px 8px",
                outline: "none",
                minWidth: 260,
              }}
            />
            <button
              onClick={saveEdit}
              style={{ background: "#B4FF39", border: "none", borderRadius: 4, padding: "2px 6px", cursor: "pointer", color: "#14151A", display: "flex", alignItems: "center" }}
            >
              <Check size={13} /> Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 4, padding: "2px 6px", cursor: "pointer", color: "#fff", fontSize: 11 }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <span style={{ color: "#E0E0D8" }}>{announcementText}</span>
        )}

        {isAdmin && !isEditing && (
          <button
            onClick={() => { setEditText(announcementText); setIsEditing(true); }}
            title="Edit Announcement (Admin)"
            style={{
              background: "rgba(180, 255, 57, 0.15)",
              border: "1px solid rgba(180, 255, 57, 0.3)",
              borderRadius: 4,
              color: "#B4FF39",
              padding: "2px 6px",
              fontSize: 11,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Pencil size={11} /> Edit
          </button>
        )}
      </div>

      <a
        href="#roadmap"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          color: "#B4FF39",
          fontWeight: 700,
          textDecoration: "none",
          fontSize: 12,
        }}
      >
        Explore Roadmaps <ArrowRight size={12} />
      </a>

      <button
        onClick={() => setVisible(false)}
        style={{
          position: "absolute",
          right: 12,
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.5)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

