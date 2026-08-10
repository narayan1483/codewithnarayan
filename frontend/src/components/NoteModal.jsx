import React, { useState } from "react";
import { X, BookOpen, Download, Check, Trash2, Loader2, Pencil } from "lucide-react";
import { colorFor } from "../data.js";
import { downloadNoteUrl } from "../api.js";

export default function NoteModal({ note, onClose, onGet, owned, isAdmin, onDelete, onEdit }) {
  const [deleting, setDeleting] = useState(false);
  if (!note) return null;
  const color = colorFor(note.subject);
  const hasFile = !!note.file_path;
  const hasDriveLink = !!note.driveLink;
  const canOpen = hasFile || hasDriveLink;

  const handleGet = () => {
    if (!canOpen) return;
    onGet(note);
    if (hasFile) window.open(downloadNoteUrl(note.id), "_blank");
    else window.open(note.driveLink, "_blank", "noopener,noreferrer");
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${note.title}"? This can't be undone.`)) return;
    setDeleting(true);
    try {
      await onDelete(note.id);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(20,21,26,0.5)", backdropFilter: "blur(3px)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface)", border: "1.5px solid var(--border)", borderTop: `4px solid ${color}`,
          borderRadius: 18, maxWidth: 520, width: "100%", maxHeight: "88vh", overflowY: "auto",
          padding: "26px 26px 30px", animation: "popIn .18s ease",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {isAdmin ? (
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => onEdit(note)} aria-label="Edit note" title="Edit note" className="focus-ring" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 999, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Pencil size={14} color="var(--text-secondary)" />
              </button>
              <button onClick={handleDelete} disabled={deleting} aria-label="Delete note" title="Delete note" className="focus-ring" style={{ background: "#FFF1F2", border: "1px solid #FFD5DA", borderRadius: 999, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: deleting ? "default" : "pointer" }}>
                {deleting ? <Loader2 size={14} className="spin" color="#FF4D6D" /> : <Trash2 size={14} color="#FF4D6D" />}
              </button>
            </div>
          ) : <span />}
          <button onClick={onClose} aria-label="Close" className="focus-ring" style={{ background: "var(--bg-secondary)", border: "none", borderRadius: 999, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={16} color="#6B7280" />
          </button>
        </div>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 24, fontWeight: 700, color: "var(--text-primary)", margin: "10px 0 12px", lineHeight: 1.25 }}>
          {note.title}
        </h2>
        <div style={{ display: "flex", gap: 9, marginBottom: 18, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color, background: `${color}17`, padding: "5px 11px", borderRadius: 20 }}>{note.pages} pages</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "var(--text-secondary)", background: "var(--bg-secondary)", padding: "5px 11px", borderRadius: 20 }}>{note.level}</span>
        </div>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.65, margin: "0 0 24px" }}>
          {note.desc} Handwritten, diagram-first notes made for quick revision before interviews and exams.
        </p>
        <div style={{ background: "var(--bg-secondary)", border: "1.5px dashed var(--border-soft)", borderRadius: 11, padding: "15px 17px", display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
          <BookOpen size={18} color={color} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "var(--text-secondary)" }}>
            First page preview available on request — DM <b style={{ color: "var(--text-primary)" }}>@code.withnarayan</b>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "var(--text-muted)", textDecoration: "line-through" }}>₹99</div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, color: "#00B37E" }}>Free — Launch Offer</div>
          </div>
          <button
            onClick={handleGet}
            disabled={!canOpen}
            title={!canOpen ? "No file or link added for this note yet" : ""}
            style={{
              fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 15,
              background: !canOpen ? "#E5E5E0" : owned ? "#F0FDF8" : color,
              color: !canOpen ? "#9A9A94" : owned ? "#00B37E" : "#FFFFFF",
              border: owned && canOpen ? "1.5px solid #00B37E33" : "none", borderRadius: 9, padding: "14px 24px",
              cursor: canOpen ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
            }}
          >
            {owned ? (<><Check size={16} /> Downloaded</>) : (<><Download size={16} /> Get Notes</>)}
          </button>
        </div>
      </div>
    </div>
  );
}
