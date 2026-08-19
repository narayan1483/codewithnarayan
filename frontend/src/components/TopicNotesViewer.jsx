import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft, BookOpen, Code2, HelpCircle, Zap, Plus, Pencil, Trash2,
  Save, X, ChevronLeft, ChevronRight, FileText, Layers, Loader2, AlertCircle
} from "lucide-react";
import { fetchTopicNotes, createTopicNotePage, updateTopicNotePage, deleteTopicNotePage } from "../api.js";

// ─── Simple Markdown-like Content Renderer ────────────────────────
// Supports: headings, bold, code blocks, inline code, lists, separators
function renderContent(content) {
  if (!content) return null;
  const lines = content.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block: ```lang ... ```
    if (line.trim().startsWith("```")) {
      const lang = line.trim().slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <div key={elements.length} className="tn-code-block">
          {lang && <div className="tn-code-lang">{lang}</div>}
          <pre><code>{codeLines.join("\n")}</code></pre>
        </div>
      );
      continue;
    }

    // Heading: ## or ###
    if (line.startsWith("### ")) {
      elements.push(<h4 key={elements.length} className="tn-h4">{processInline(line.slice(4))}</h4>);
      i++; continue;
    }
    if (line.startsWith("## ")) {
      elements.push(<h3 key={elements.length} className="tn-h3">{processInline(line.slice(3))}</h3>);
      i++; continue;
    }
    if (line.startsWith("# ")) {
      elements.push(<h2 key={elements.length} className="tn-h2">{processInline(line.slice(2))}</h2>);
      i++; continue;
    }

    // Separator: ---
    if (line.trim() === "---") {
      elements.push(<hr key={elements.length} className="tn-hr" />);
      i++; continue;
    }

    // Bullet list: - item or * item
    if (/^[\-\*]\s/.test(line.trim())) {
      const listItems = [];
      while (i < lines.length && /^[\-\*]\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <ul key={elements.length} className="tn-list">
          {listItems.map((item, idx) => <li key={idx}>{processInline(item)}</li>)}
        </ul>
      );
      continue;
    }

    // Numbered list: 1. item
    if (/^\d+\.\s/.test(line.trim())) {
      const listItems = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={elements.length} className="tn-list tn-ol">
          {listItems.map((item, idx) => <li key={idx}>{processInline(item)}</li>)}
        </ol>
      );
      continue;
    }

    // Blockquote: > text
    if (line.trim().startsWith("> ")) {
      elements.push(
        <blockquote key={elements.length} className="tn-blockquote">
          {processInline(line.trim().slice(2))}
        </blockquote>
      );
      i++; continue;
    }

    // Empty line
    if (line.trim() === "") {
      i++; continue;
    }

    // Normal paragraph
    elements.push(<p key={elements.length} className="tn-para">{processInline(line)}</p>);
    i++;
  }

  return elements;
}

// Process inline: **bold**, `code`, *italic*
function processInline(text) {
  if (!text) return text;
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold: **text**
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Inline code: `code`
    const codeMatch = remaining.match(/`([^`]+)`/);
    // Italic: *text*
    const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);

    let firstMatch = null;
    let firstIdx = Infinity;

    if (boldMatch && remaining.indexOf(boldMatch[0]) < firstIdx) {
      firstMatch = { type: "bold", match: boldMatch };
      firstIdx = remaining.indexOf(boldMatch[0]);
    }
    if (codeMatch && remaining.indexOf(codeMatch[0]) < firstIdx) {
      firstMatch = { type: "code", match: codeMatch };
      firstIdx = remaining.indexOf(codeMatch[0]);
    }
    if (italicMatch && remaining.indexOf(italicMatch[0]) < firstIdx) {
      firstMatch = { type: "italic", match: italicMatch };
      firstIdx = remaining.indexOf(italicMatch[0]);
    }

    if (!firstMatch) {
      parts.push(remaining);
      break;
    }

    // Text before match
    if (firstIdx > 0) {
      parts.push(remaining.slice(0, firstIdx));
    }

    if (firstMatch.type === "bold") {
      parts.push(<strong key={key++}>{firstMatch.match[1]}</strong>);
      remaining = remaining.slice(firstIdx + firstMatch.match[0].length);
    } else if (firstMatch.type === "code") {
      parts.push(<code key={key++} className="tn-inline-code">{firstMatch.match[1]}</code>);
      remaining = remaining.slice(firstIdx + firstMatch.match[0].length);
    } else if (firstMatch.type === "italic") {
      parts.push(<em key={key++}>{firstMatch.match[1]}</em>);
      remaining = remaining.slice(firstIdx + firstMatch.match[0].length);
    }
  }

  return parts;
}


// ─── EDITOR MODAL ─────────────────────────────────────────────────
function TopicNoteEditor({ page, topicId, roadmapId, onSave, onCancel, existingPageCount }) {
  const [title, setTitle] = useState(page ? page.page_title : "");
  const [content, setContent] = useState(page ? page.content : "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef(null);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title aur content dono required hain");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (page && page.id) {
        // Edit existing
        await onSave({ id: page.id, pageTitle: title, content });
      } else {
        // Create new
        await onSave({ topicId, roadmapId, pageTitle: title, content, pageNumber: existingPageCount + 1 });
      }
    } catch (err) {
      setError(err.message || "Failed to save");
      setSaving(false);
    }
  };

  // Tab key support in textarea
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const val = content;
      setContent(val.substring(0, start) + "  " + val.substring(end));
      setTimeout(() => {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
      }, 0);
    }
  };

  const sampleTemplate = `# Page Title

## 📘 What is it & Why?
Explain the concept here in simple English. Use real-world analogies.

## 💻 Basic Syntax with Code
\`\`\`javascript
// Simple example code
function example() {
  console.log("Hello World");
}
\`\`\`

## 🔥 Key Concepts
- Point 1
- Point 2
- Point 3

## ❓ Interview Questions & Answers

### Q1: What is this concept?
**Answer:** Simple explanation here.

\`\`\`javascript
// Code example for answer
\`\`\`

### Q2: Why is it important?
**Answer:** Because it helps in...

---
> 💡 **Pro Tip:** Always remember this key insight!`;

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed", inset: 0, background: "rgba(16,18,24,0.7)",
        backdropFilter: "blur(6px)", zIndex: 1001,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface)", border: "1.5px solid var(--border)",
          borderRadius: 18, maxWidth: 900, width: "100%", maxHeight: "92vh",
          display: "flex", flexDirection: "column", animation: "popIn .18s ease",
          boxShadow: "0 25px 60px -12px rgba(0,0,0,0.35)",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "18px 24px", borderBottom: "1px solid var(--border)",
        }}>
          <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <Pencil size={18} color="#3D5AFE" />
            {page ? "Edit Page" : "Add New Page"}
          </h3>
          <button onClick={onCancel} style={{ background: "var(--bg-secondary)", border: "none", borderRadius: 999, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={16} color="var(--text-muted)" />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#EF4444", display: "flex", alignItems: "center", gap: 6 }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {/* Page Title */}
          <div>
            <label style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-muted)", display: "block", marginBottom: 4, fontWeight: 600 }}>
              PAGE TITLE
            </label>
            <input
              type="text"
              placeholder="e.g. Introduction & Basics"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 10,
                border: "1.5px solid var(--border)", background: "var(--bg-secondary)",
                color: "var(--text-primary)", fontSize: 14, fontFamily: "Inter, sans-serif",
                fontWeight: 600,
              }}
            />
          </div>

          {/* Content */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <label style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-muted)", fontWeight: 600 }}>
                CONTENT (MARKDOWN)
              </label>
              {!page && !content && (
                <button
                  onClick={() => setContent(sampleTemplate)}
                  style={{
                    fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#3D5AFE",
                    background: "rgba(61,90,254,0.1)", border: "1px solid rgba(61,90,254,0.2)",
                    borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontWeight: 600,
                  }}
                >
                  📝 Use Template
                </button>
              )}
            </div>
            <textarea
              ref={textareaRef}
              placeholder="Write your content here using Markdown format..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                width: "100%", minHeight: 380, padding: "14px", borderRadius: 10,
                border: "1.5px solid var(--border)", background: "var(--input-bg)",
                color: "var(--text-primary)", fontSize: 13,
                fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.7,
                resize: "vertical",
              }}
            />
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>
              Supports: # Heading, **bold**, `code`, ```code blocks```, - lists, {'>'} quotes, --- separator
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", gap: 10, padding: "16px 24px",
          borderTop: "1px solid var(--border)", justifyContent: "flex-end",
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: "10px 20px", borderRadius: 10, border: "1.5px solid var(--border)",
              background: "var(--surface)", color: "var(--text-primary)",
              fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "10px 24px", borderRadius: 10, border: "none",
              background: saving ? "var(--text-muted)" : "#3D5AFE", color: "#FFFFFF",
              fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            {saving ? <><Loader2 size={14} className="spin" /> Saving...</> : <><Save size={14} /> Save Page</>}
          </button>
        </div>
      </div>
    </div>
  );
}


// ─── MAIN VIEWER COMPONENT ───────────────────────────────────────
export default function TopicNotesViewer({ topic, track, isAdmin, onBack }) {
  const [pages, setPages] = useState([]);
  const [activePage, setActivePage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const contentRef = useRef(null);

  // Load pages from backend
  useEffect(() => {
    if (!topic) return;
    setLoading(true);
    setError("");
    fetchTopicNotes(topic.id)
      .then((data) => {
        setPages(data);
        setActivePage(0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [topic]);

  // Scroll to top when page changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activePage]);

  const handleSave = async (data) => {
    if (data.id) {
      // Update existing
      const result = await updateTopicNotePage(data.id, { pageTitle: data.pageTitle, content: data.content });
      setPages((prev) => prev.map((p) => (p.id === data.id ? result.page : p)));
    } else {
      // Create new
      const result = await createTopicNotePage(data);
      setPages((prev) => [...prev, result.page]);
      setActivePage(pages.length); // go to new page
    }
    setEditorOpen(false);
    setEditingPage(null);
  };

  const handleDelete = async (pageId) => {
    if (!window.confirm("Are you sure you want to delete this page? This cannot be undone.")) return;
    try {
      await deleteTopicNotePage(pageId);
      setPages((prev) => prev.filter((p) => p.id !== pageId));
      if (activePage >= pages.length - 1) setActivePage(Math.max(0, pages.length - 2));
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  const currentPage = pages[activePage] || null;

  return (
    <div className="tn-viewer" style={{ maxWidth: 1080, margin: "0 auto", padding: "16px 16px 80px" }}>
      {/* Top Bar — Back Button + Topic Info */}
      <div className="tn-top-bar" style={{
        display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16,
        flexWrap: "wrap",
      }}>
        <button
          onClick={onBack}
          className="tn-back-btn"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "8px 14px", borderRadius: 10,
            border: "1.5px solid var(--border)", background: "var(--surface)",
            color: "var(--text-primary)", fontFamily: "'Sora', sans-serif",
            fontSize: 12.5, fontWeight: 600, cursor: "pointer",
            transition: "all .15s ease", flexShrink: 0,
          }}
        >
          <ArrowLeft size={15} /> Back to Roadmap
        </button>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: `${track.color}15`, color: track.color,
            padding: "2px 8px", borderRadius: 20, fontSize: 10.5,
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            marginBottom: 4,
          }}>
            <Layers size={11} /> {track.title}
          </div>
          <h2 className="tn-main-title" style={{
            fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 800,
            color: "var(--text-primary)", margin: "2px 0 0", lineHeight: 1.3,
            wordBreak: "break-word",
          }}>
            📒 {topic.name}
          </h2>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "60px 20px", flexDirection: "column", gap: 12,
        }}>
          <Loader2 size={28} className="spin" color={track.color} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "var(--text-secondary)" }}>
            Loading notes...
          </span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div style={{
          background: "rgba(239,68,68,0.08)", border: "1.5px solid rgba(239,68,68,0.2)",
          borderRadius: 12, padding: "20px", textAlign: "center",
        }}>
          <AlertCircle size={22} color="#EF4444" style={{ marginBottom: 8 }} />
          <p style={{ color: "#EF4444", fontSize: 13.5, margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Empty State — No pages yet */}
      {!loading && !error && pages.length === 0 && (
        <div style={{
          background: "var(--surface)", border: "1.5px dashed var(--border)",
          borderRadius: 16, padding: "50px 20px", textAlign: "center",
        }}>
          <FileText size={42} color="var(--text-muted)" style={{ marginBottom: 12, opacity: 0.5 }} />
          <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 17, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px" }}>
            No Notes Yet
          </h3>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "var(--text-secondary)", maxWidth: 400, margin: "0 auto 20px" }}>
            {isAdmin
              ? "Start by creating the first page for this topic. Use the template to get started quickly!"
              : "Notes for this topic are coming soon. Check back later!"}
          </p>
          {isAdmin && (
            <button
              onClick={() => { setEditingPage(null); setEditorOpen(true); }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "10px 20px", borderRadius: 10, border: "none",
                background: "#3D5AFE", color: "#FFFFFF",
                fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <Plus size={15} /> Create First Page
            </button>
          )}
        </div>
      )}

      {/* Content Area — Has pages */}
      {!loading && !error && pages.length > 0 && (
        <>
          {/* Mobile Horizontal Page Pills Selector (visible on mobile only) */}
          <div className="tn-mobile-page-tabs" style={{
            display: "none",
            overflowX: "auto",
            scrollbarWidth: "none",
            gap: 8,
            paddingBottom: 10,
            marginBottom: 12,
            WebkitOverflowScrolling: "touch",
          }}>
            {pages.map((page, idx) => (
              <button
                key={page.id}
                onClick={() => setActivePage(idx)}
                style={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "7px 12px",
                  borderRadius: 20,
                  border: `1.5px solid ${activePage === idx ? track.color : "var(--border)"}`,
                  background: activePage === idx ? track.color : "var(--surface)",
                  color: activePage === idx ? "#FFFFFF" : "var(--text-secondary)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                <span>P{idx + 1}:</span>
                <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis" }}>
                  {page.page_title}
                </span>
              </button>
            ))}
            {isAdmin && (
              <button
                onClick={() => { setEditingPage(null); setEditorOpen(true); }}
                style={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "7px 12px",
                  borderRadius: 20,
                  border: "1.5px dashed var(--border)",
                  background: "var(--surface)",
                  color: "var(--text-muted)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                <Plus size={13} /> Add
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
            {/* Desktop Left Sidebar — Page Tabs */}
            <div className="tn-sidebar" style={{
              width: 220, flexShrink: 0,
              background: "var(--surface)", border: "1.5px solid var(--border)",
              borderRadius: 14, padding: 12, position: "sticky", top: 90,
            }}>
              <div style={{
                fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                color: "var(--text-muted)", fontWeight: 700, marginBottom: 8,
                textTransform: "uppercase", letterSpacing: 1,
              }}>
                Pages ({pages.length})
              </div>
              {pages.map((page, idx) => (
                <button
                  key={page.id}
                  onClick={() => setActivePage(idx)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, width: "100%",
                    padding: "9px 11px", borderRadius: 8, border: "none",
                    background: activePage === idx ? `${track.color}15` : "transparent",
                    color: activePage === idx ? track.color : "var(--text-secondary)",
                    fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 600,
                    cursor: "pointer", textAlign: "left",
                    borderLeft: activePage === idx ? `3px solid ${track.color}` : "3px solid transparent",
                    transition: "all .15s ease", marginBottom: 4,
                  }}
                >
                  <FileText size={13} />
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {page.page_title}
                  </span>
                </button>
              ))}

              {/* Admin: Add New Page */}
              {isAdmin && (
                <button
                  onClick={() => { setEditingPage(null); setEditorOpen(true); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 6, width: "100%",
                    padding: "9px 11px", borderRadius: 8,
                    border: "1.5px dashed var(--border)", background: "transparent",
                    color: "var(--text-muted)", fontFamily: "Inter, sans-serif",
                    fontSize: 12, fontWeight: 600, cursor: "pointer",
                    marginTop: 8, justifyContent: "center",
                  }}
                >
                  <Plus size={13} /> Add Page
                </button>
              )}
            </div>

            {/* Right Content Area */}
            <div ref={contentRef} style={{ flex: 1, minWidth: 0, width: "100%" }}>
              {currentPage && (
                <div
                  className="tn-content-card"
                  style={{
                    background: "var(--surface)", border: "1.5px solid var(--border)",
                    borderTop: `4px solid ${track.color}`,
                    borderRadius: 16, padding: "24px 28px 28px",
                    boxShadow: "0 10px 30px -10px rgba(0,0,0,0.06)",
                    boxSizing: "border-box",
                  }}
                >
                  {/* Page Header */}
                  <div className="tn-page-header" style={{
                    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                    marginBottom: 20, flexWrap: "wrap", gap: 10,
                  }}>
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <div style={{
                        fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                        color: "var(--text-muted)", marginBottom: 4, fontWeight: 600,
                      }}>
                        PAGE {activePage + 1} OF {pages.length}
                      </div>
                      <h2 className="tn-card-title" style={{
                        fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 800,
                        color: "var(--text-primary)", margin: 0, lineHeight: 1.3,
                        wordBreak: "break-word",
                      }}>
                        {currentPage.page_title}
                      </h2>
                    </div>

                    {/* Admin Actions */}
                    {isAdmin && (
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <button
                          onClick={() => { setEditingPage(currentPage); setEditorOpen(true); }}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 4,
                            padding: "6px 12px", borderRadius: 8,
                            border: "1.5px solid #C7D2FE", background: "#EEF2FF",
                            color: "#4F46E5", fontFamily: "'Sora', sans-serif",
                            fontSize: 11.5, fontWeight: 600, cursor: "pointer",
                          }}
                        >
                          <Pencil size={11} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(currentPage.id)}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 4,
                            padding: "6px 12px", borderRadius: 8,
                            border: "1.5px solid #FFD5DA", background: "#FFF1F2",
                            color: "#FF4D6D", fontFamily: "'Sora', sans-serif",
                            fontSize: 11.5, fontWeight: 600, cursor: "pointer",
                          }}
                        >
                          <Trash2 size={11} /> Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Rendered Content */}
                  <div className="tn-rendered-content">
                    {renderContent(currentPage.content)}
                  </div>

                  {/* Page Navigation Footer */}
                  <div className="tn-pagination-footer" style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    marginTop: 28, paddingTop: 18, borderTop: "1px solid var(--border)",
                    gap: 8, flexWrap: "wrap",
                  }}>
                    <button
                      onClick={() => setActivePage(Math.max(0, activePage - 1))}
                      disabled={activePage === 0}
                      className="tn-nav-btn"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        padding: "8px 14px", borderRadius: 10,
                        border: "1.5px solid var(--border)", background: "var(--surface)",
                        color: activePage === 0 ? "var(--text-muted)" : "var(--text-primary)",
                        fontFamily: "'Sora', sans-serif", fontSize: 12.5, fontWeight: 600,
                        cursor: activePage === 0 ? "not-allowed" : "pointer",
                        opacity: activePage === 0 ? 0.4 : 1,
                      }}
                    >
                      <ChevronLeft size={15} /> Previous
                    </button>

                    {/* Page dots */}
                    <div className="tn-dots-container" style={{ display: "flex", gap: 5, alignItems: "center" }}>
                      {pages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActivePage(idx)}
                          aria-label={`Go to page ${idx + 1}`}
                          style={{
                            width: idx === activePage ? 20 : 7, height: 7,
                            borderRadius: 999, border: "none",
                            background: idx === activePage ? track.color : "var(--border)",
                            cursor: "pointer", transition: "all .2s ease",
                            padding: 0,
                          }}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => setActivePage(Math.min(pages.length - 1, activePage + 1))}
                      disabled={activePage === pages.length - 1}
                      className="tn-nav-btn"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        padding: "8px 14px", borderRadius: 10,
                        border: "1.5px solid var(--border)", background: "var(--surface)",
                        color: activePage === pages.length - 1 ? "var(--text-muted)" : "var(--text-primary)",
                        fontFamily: "'Sora', sans-serif", fontSize: 12.5, fontWeight: 600,
                        cursor: activePage === pages.length - 1 ? "not-allowed" : "pointer",
                        opacity: activePage === pages.length - 1 ? 0.4 : 1,
                      }}
                    >
                      Next <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Editor Modal */}
      {editorOpen && (
        <TopicNoteEditor
          page={editingPage}
          topicId={topic.id}
          roadmapId={track.id}
          existingPageCount={pages.length}
          onSave={handleSave}
          onCancel={() => { setEditorOpen(false); setEditingPage(null); }}
        />
      )}
    </div>
  );
}

