import React, { useState, useEffect } from "react";
import { X, ArrowUpRight, Loader2, FileText, Upload, Trash2 } from "lucide-react";
import { SUBJECTS } from "../data.js";

export default function AddNoteModal({ open, onClose, onPublish, onUpdate, editingNote }) {
  const isEdit = !!editingNote;
  const [form, setForm] = useState({ title: "", subject: "", pages: "", level: "Beginner", desc: "" });
  const [pdfFile, setPdfFile] = useState(null);
  const [driveLink, setDriveLink] = useState("");
  const [removeExistingFile, setRemoveExistingFile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingNote) {
      setForm({
        title: editingNote.title || "",
        subject: editingNote.subject || "",
        pages: editingNote.pages || "",
        level: editingNote.level || "Beginner",
        desc: editingNote.desc || "",
      });
      setDriveLink(editingNote.driveLink || "");
      setPdfFile(null);
      setRemoveExistingFile(false);
    } else {
      setForm({ title: "", subject: "", pages: "", level: "Beginner", desc: "" });
      setDriveLink("");
      setPdfFile(null);
      setRemoveExistingFile(false);
    }
    setError("");
  }, [editingNote, open]);

  if (!open) return null;

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("File is too large — max 20MB.");
      return;
    }
    setError("");
    setPdfFile(file);
    setRemoveExistingFile(false);
  };

  const submit = async () => {
    if (!form.title.trim() || !form.subject.trim() || !form.desc.trim() || !form.pages) {
      setError("Title, subject, pages, and description are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (isEdit) {
        await onUpdate(editingNote.id, { ...form, pages: Number(form.pages), pdfFile, driveLink, removeFile: removeExistingFile });
      } else {
        await onPublish({ ...form, pages: Number(form.pages), pdfFile, driveLink });
      }
      onClose();
    } catch (e) {
      setError(e.message || "Couldn't save right now — try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = { width: "100%", background: "var(--bg-secondary)", border: "1.5px solid var(--border)", borderRadius: 9, padding: "11px 13px", color: "var(--text-primary)", fontFamily: "Inter, sans-serif", fontSize: 14, outline: "none" };
  const labelStyle = { fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "var(--text-muted)", letterSpacing: 0.3, textTransform: "uppercase", display: "block", marginBottom: 6 };

  const hasExistingFile = isEdit && editingNote.file_name && !removeExistingFile && !pdfFile;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(20,21,26,0.5)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderTop: "4px solid #14151A", borderRadius: 18, maxWidth: 480, width: "100%", maxHeight: "90vh", overflowY: "auto", padding: "26px 26px 30px", animation: "popIn .18s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
            {isEdit ? "Edit note" : "Publish a note"}
          </h2>
          <button onClick={onClose} aria-label="Close" className="focus-ring" style={{ background: "var(--bg-secondary)", border: "none", borderRadius: 999, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={16} color="#6B7280" />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>Title</label>
            <input style={inputStyle} value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Recursion — Complete Notes" />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Subject (type any, or pick a suggestion)</label>
              <input
                list="subject-suggestions"
                style={inputStyle}
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
                placeholder="e.g. DSA, Python, Aptitude..."
              />
              <datalist id="subject-suggestions">
                {SUBJECTS.map((s) => (<option key={s.id} value={s.label} />))}
              </datalist>
            </div>
            <div style={{ width: 96 }}>
              <label style={labelStyle}>Pages</label>
              <input style={inputStyle} type="number" min="1" value={form.pages} onChange={(e) => update("pages", e.target.value)} placeholder="20" />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Level</label>
            <select style={inputStyle} value={form.level} onChange={(e) => update("level", e.target.value)}>
              <option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>All Levels</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical", fontFamily: "Inter, sans-serif" }} value={form.desc} onChange={(e) => update("desc", e.target.value)} placeholder="What's inside these notes?" />
          </div>
          <div>
            <label style={labelStyle}>PDF file (optional, up to 20MB)</label>
            {hasExistingFile ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, background: "var(--bg-secondary)", border: "1.5px solid var(--border)", borderRadius: 9, padding: "10px 13px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "Inter, sans-serif", fontSize: 13, color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis" }}>
                  <FileText size={14} color="#00B37E" /> {editingNote.file_name}
                </span>
                <button onClick={() => setRemoveExistingFile(true)} title="Remove file" style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
                  <Trash2 size={14} color="#FF4D6D" />
                </button>
              </div>
            ) : (
              <label
                style={{
                  display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
                  background: "var(--bg-secondary)", border: "1.5px dashed var(--border)", borderRadius: 9, padding: "11px 13px",
                }}
              >
                <Upload size={15} color="var(--text-muted)" />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "var(--text-secondary)" }}>
                  {pdfFile ? pdfFile.name : "Click to choose a PDF"}
                </span>
                <input type="file" accept="application/pdf" onChange={handleFile} style={{ display: "none" }} />
              </label>
            )}
            {pdfFile && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#00B37E" }}>
                <FileText size={12} /> {(pdfFile.size / 1024 / 1024).toFixed(1)} MB ready to upload
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "var(--text-muted)" }}>OR</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <div>
            <label style={labelStyle}>Google Drive link (instead of uploading a file)</label>
            <input
              style={inputStyle}
              value={driveLink}
              onChange={(e) => setDriveLink(e.target.value)}
              placeholder="https://drive.google.com/file/d/.../view"
            />
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "var(--text-muted)", margin: "5px 0 0" }}>
              Set sharing to "Anyone with the link" first, so visitors can open it.
            </p>
          </div>

          {error && <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#FF4D6D" }}>{error}</div>}

          <button onClick={submit} disabled={saving} style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 14.5, background: "#14151A", color: "#FFFFFF", border: "none", borderRadius: 9, padding: "14px", cursor: saving ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: saving ? 0.7 : 1 }}>
            {saving ? (<><Loader2 size={15} className="spin" /> Saving...</>) : isEdit ? (<>Save changes <ArrowUpRight size={15} /></>) : (<>Publish note <ArrowUpRight size={15} /></>)}
          </button>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: "var(--text-muted)", textAlign: "center", margin: 0 }}>
            {isEdit ? "Changes go live immediately." : "This publishes to the live site — visible to everyone."}
          </p>
        </div>
      </div>
    </div>
  );
}
