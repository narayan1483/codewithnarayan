import React, { useState, useEffect } from "react";
import { Search, BookOpen, Target, Code, ArrowRight, X, Command } from "lucide-react";
import { colorFor, iconFor } from "../data.js";

export default function CommandPalette({ open, onClose, notes, onOpenNote, onSelectSection }) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onClose ? (open ? onClose() : null) : null;
      }
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const filteredNotes = (notes || []).filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      (n.subject || "").toLowerCase().includes(search.toLowerCase()) ||
      (n.desc || "").toLowerCase().includes(search.toLowerCase())
  );

  const quickActions = [
    { label: "View DSA Placement Roadmap", icon: <Target size={15} color="#3D5AFE" />, action: () => { onSelectSection("roadmap"); onClose(); } },
    { label: "Open Code Cheatsheets", icon: <Code size={15} color="#00B37E" />, action: () => { onSelectSection("cheatsheets"); onClose(); } },
    { label: "Take Daily Placement Quiz", icon: <BookOpen size={15} color="#FF8A3D" />, action: () => { onSelectSection("quiz"); onClose(); } },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(16, 18, 24, 0.75)",
        backdropFilter: "blur(6px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "10vh 16px 20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 580,
          background: "var(--surface)",
          border: "1.5px solid var(--border)",
          borderRadius: 16,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
          overflow: "hidden",
          animation: "popIn .15s ease",
        }}
      >
        {/* Search Input Box */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "16px 18px",
            borderBottom: "1.5px solid var(--border)",
          }}
        >
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Type a note title, subject (DSA, Java), or feature..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: 15,
              fontFamily: "'Sora', sans-serif",
              color: "var(--text-primary)",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, background: "var(--bg-secondary)", border: "1px solid var(--border)", padding: "2px 6px", borderRadius: 4, color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
              ESC
            </span>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: 380, overflowY: "auto", padding: "10px" }}>
          {/* Quick Actions */}
          {!search && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-muted)", padding: "6px 10px", textTransform: "uppercase" }}>
                Quick Navigation
              </div>
              {quickActions.map((qa, idx) => (
                <div
                  key={idx}
                  onClick={qa.action}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    borderRadius: 8,
                    cursor: "pointer",
                    transition: "all .12s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-secondary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)", fontFamily: "'Sora', sans-serif" }}>
                    {qa.icon} {qa.label}
                  </div>
                  <ArrowRight size={14} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          )}

          {/* Filtered Notes */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-muted)", padding: "6px 10px", textTransform: "uppercase" }}>
              Notes {search ? `(${filteredNotes.length})` : "Collection"}
            </div>

            {filteredNotes.length === 0 ? (
              <div style={{ padding: "24px 12px", textAlign: "center", color: "var(--text-muted)", fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>
                No notes found matching "{search}"
              </div>
            ) : (
              filteredNotes.slice(0, 8).map((note) => {
                const color = colorFor(note.subject);
                const icon = iconFor(note.subject);
                return (
                  <div
                    key={note.id}
                    onClick={() => {
                      onOpenNote(note);
                      onClose();
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 12px",
                      borderRadius: 8,
                      cursor: "pointer",
                      marginBottom: 4,
                      transition: "all .12s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--bg-secondary)";
                      e.currentTarget.style.transform = "translateX(2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.transform = "none";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, overflow: "hidden" }}>
                      <span style={{ fontSize: 15 }}>{icon}</span>
                      <div style={{ overflow: "hidden" }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)", fontFamily: "'Sora', sans-serif", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                          {note.title}
                        </div>
                        <div style={{ fontSize: 11.5, color: "var(--text-secondary)", fontFamily: "Inter, sans-serif" }}>
                          {note.subject} · {note.pages} pages · ⭐ {note.rating || 4.8}
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: 11, background: `${color}17`, color, fontWeight: 700, padding: "3px 8px", borderRadius: 6, fontFamily: "'JetBrains Mono', monospace" }}>
                      Open
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer info */}
        <div
          style={{
            padding: "10px 18px",
            background: "var(--bg-secondary)",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 11,
            color: "var(--text-muted)",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          <span>Press ESC or click outside to exit</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Command size={11} /> + K
          </span>
        </div>
      </div>
    </div>
  );
}
