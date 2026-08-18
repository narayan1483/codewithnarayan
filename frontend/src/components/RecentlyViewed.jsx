import React from "react";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
import { colorFor, iconFor } from "../data.js";

export default function RecentlyViewed({ recentNotes, onOpen }) {
  if (!recentNotes || recentNotes.length === 0) return null;

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 20px 20px" }}>
      <div
        style={{
          background: "var(--bg-secondary)",
          border: "1.5px solid var(--border)",
          borderRadius: 14,
          padding: "12px 18px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 13, color: "var(--text-primary)", fontFamily: "'Sora', sans-serif" }}>
          <Clock size={15} color="#3D5AFE" /> Recently Viewed:
        </div>

        <div style={{ display: "flex", gap: 8, overflowX: "auto", flex: 1, scrollbarWidth: "none", alignItems: "center" }}>
          {recentNotes.map((note) => {
            const color = colorFor(note.subject);
            const icon = iconFor(note.subject);
            return (
              <button
                key={note.id}
                onClick={() => onOpen(note)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "var(--surface)",
                  border: `1.5px solid ${color}44`,
                  borderRadius: 8,
                  padding: "6px 12px",
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = color;
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${color}44`;
                  e.currentTarget.style.transform = "none";
                }}
              >
                <span>{icon}</span>
                <span>{note.title.length > 24 ? note.title.slice(0, 24) + "..." : note.title}</span>
                <ArrowRight size={12} color={color} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
