import React, { useState } from "react";
import { X, BookOpen, Download, Check, Trash2, Loader2, Pencil, Share2, Copy, ExternalLink, Eye } from "lucide-react";
import { colorFor } from "../data.js";
import { downloadNoteUrl } from "../api.js";

export default function NoteModal({ note, onClose, onGet, owned, isAdmin, onDelete, onEdit }) {
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

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

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?note=${note.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?note=${note.id}`;
    const text = `Download "${note.title}" handwritten notes for free on code.withnarayan: ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  // Convert Google Drive view link to embeddable preview link if possible
  const getDrivePreviewUrl = (link) => {
    if (!link) return null;
    if (link.includes("/file/d/")) {
      return link.replace("/view?usp=sharing", "/preview").replace("/view", "/preview");
    }
    return link;
  };

  const driveEmbedUrl = getDrivePreviewUrl(note.driveLink);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(20,21,26,0.65)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface)", border: "1.5px solid var(--border)", borderTop: `4px solid ${color}`,
          borderRadius: 20, maxWidth: 640, width: "100%", maxHeight: "90vh", overflowY: "auto",
          padding: "24px 24px 28px", animation: "popIn .18s ease", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color, background: `${color}17`, padding: "4px 10px", borderRadius: 20, fontWeight: 700 }}>
              {note.subject.toUpperCase()}
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "var(--text-secondary)", background: "var(--bg-secondary)", padding: "4px 10px", borderRadius: 20 }}>
              {note.pages} pages
            </span>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {isAdmin && (
              <>
                <button onClick={() => onEdit(note)} aria-label="Edit note" title="Edit note" className="focus-ring" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 999, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <Pencil size={14} color="var(--text-secondary)" />
                </button>
                <button onClick={handleDelete} disabled={deleting} aria-label="Delete note" title="Delete note" className="focus-ring" style={{ background: "#FFF1F2", border: "1px solid #FFD5DA", borderRadius: 999, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: deleting ? "default" : "pointer" }}>
                  {deleting ? <Loader2 size={14} className="spin" color="#FF4D6D" /> : <Trash2 size={14} color="#FF4D6D" />}
                </button>
              </>
            )}
            <button onClick={onClose} aria-label="Close" className="focus-ring" style={{ background: "var(--bg-secondary)", border: "none", borderRadius: 999, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <X size={16} color="#6B7280" />
            </button>
          </div>
        </div>

        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 23, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 10px", lineHeight: 1.25 }}>
          {note.title}
        </h2>

        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14.5, color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 18px" }}>
          {note.desc} Handwritten, diagram-first notes made for quick revision before interviews and exams.
        </p>

        {/* Feature #2: Live Preview Viewer */}
        {driveEmbedUrl && (
          <div style={{ marginBottom: 18 }}>
            <button
              onClick={() => setShowPreview((v) => !v)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 10,
                border: "1.5px solid var(--border)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontFamily: "'Sora', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Eye size={16} color="#3D5AFE" /> {showPreview ? "Hide Document Preview" : "Live PDF Preview"}
              </span>
              <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>
                {showPreview ? "Click to close" : "Click to view page"}
              </span>
            </button>

            {showPreview && (
              <div style={{ marginTop: 10, borderRadius: 12, overflow: "hidden", border: "1.5px solid var(--border)", background: "#000", height: 360 }}>
                <iframe
                  src={driveEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                  title="PDF Preview"
                  allow="autoplay"
                />
              </div>
            )}
          </div>
        )}

        {/* Feature #3: WhatsApp & Share Buttons */}
        <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
          <button
            onClick={handleShareWhatsApp}
            style={{
              flex: 1,
              padding: "9px 12px",
              borderRadius: 8,
              border: "none",
              background: "#25D366",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              boxShadow: "0 2px 8px rgba(37, 211, 102, 0.25)",
            }}
          >
            <Share2 size={14} /> WhatsApp
          </button>
          <button
            onClick={handleCopyLink}
            style={{
              flex: 1,
              padding: "9px 12px",
              borderRadius: 8,
              border: "1.5px solid var(--border)",
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            {copied ? <Check size={14} color="#00B37E" /> : <Copy size={14} />}
            {copied ? "Link Copied!" : "Copy Direct Link"}
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "var(--text-muted)", textDecoration: "line-through" }}>₹99</div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 800, color: "#00B37E" }}>Free — Download</div>
          </div>
          <button
            onClick={handleGet}
            disabled={!canOpen}
            title={!canOpen ? "No file or link added for this note yet" : ""}
            style={{
              fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 14.5,
              background: !canOpen ? "#E5E5E0" : owned ? "#F0FDF8" : color,
              color: !canOpen ? "#9A9A94" : owned ? "#00B37E" : "#FFFFFF",
              border: owned && canOpen ? "1.5px solid #00B37E33" : "none", borderRadius: 10, padding: "12px 22px",
              cursor: canOpen ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
              boxShadow: canOpen && !owned ? `0 4px 14px ${color}44` : "none",
            }}
          >
            {owned ? (<><Check size={16} /> Downloaded</>) : (<><Download size={16} /> {hasDriveLink ? "Open Drive Note" : "Download PDF"}</>)}
          </button>
        </div>
      </div>
    </div>
  );
}
