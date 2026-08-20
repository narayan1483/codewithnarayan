import React, { useState, useEffect } from "react";
import { Package, ArrowUpRight, ArrowLeft, ChevronUp, Sparkles, Layers, BookOpen } from "lucide-react";
import { BUNDLES } from "../data.js";

const BUNDLE_HIGHLIGHTS = [
  "📦 Placement Bundles • All-in-One Revision Packs",
  "🌲 DSA + System Design Mastery Pack",
  "⚡ Core CS + Placement Prep Combo",
  "🍃 Full Stack Web Dev & Backend Kit",
];

export default function BundlesSection({ allNotes = [], onOpenBundle, onCollapse }) {
  const [typeIdx, setTypeIdx] = useState(0);
  const [typeSubIdx, setTypeSubIdx] = useState(0);
  const [typeDeleting, setTypeDeleting] = useState(false);

  useEffect(() => {
    if (BUNDLE_HIGHLIGHTS.length === 0) return;
    if (!typeDeleting && typeSubIdx === BUNDLE_HIGHLIGHTS[typeIdx].length) {
      const timeout = setTimeout(() => setTypeDeleting(true), 2200);
      return () => clearTimeout(timeout);
    }
    if (typeDeleting && typeSubIdx === 0) {
      setTypeDeleting(false);
      setTypeIdx((prev) => (prev + 1) % BUNDLE_HIGHLIGHTS.length);
      return;
    }
    const timeout = setTimeout(() => {
      setTypeSubIdx((prev) => prev + (typeDeleting ? -1 : 1));
    }, typeDeleting ? 20 : 40);
    return () => clearTimeout(timeout);
  }, [typeSubIdx, typeDeleting, typeIdx]);

  const typedHighlight = BUNDLE_HIGHLIGHTS[typeIdx]?.substring(0, typeSubIdx) || "";

  return (
    <div
      id="bundles"
      className="notes-explorer-container"
      style={{
        maxWidth: 1080,
        margin: "0 auto",
        padding: "20px 20px 60px",
        animation: "slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
      }}
    >
      {/* Top Banner Toolbar with Back / Collapse button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {onCollapse && (
            <button
              onClick={onCollapse}
              className="hub-back-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 8,
                border: "1.5px solid var(--border)",
                background: "var(--surface)",
                color: "var(--text-primary)",
                fontFamily: "'Sora', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to Categories</span>
            </button>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 18 }}>📦</span>
            <span
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 800,
                fontSize: 16,
                color: "var(--text-primary)",
              }}
            >
              Placement Bundles Explorer
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                padding: "2px 7px",
                borderRadius: 999,
                background: "rgba(59, 130, 246, 0.12)",
                color: "#3B82F6",
                fontWeight: 700,
              }}
            >
              {BUNDLES.length} Bundles
            </span>
          </div>
        </div>

        {onCollapse && (
          <button
            onClick={onCollapse}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              background: "transparent",
              border: "none",
              color: "var(--text-secondary)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Sora', sans-serif",
            }}
          >
            <span>Collapse View</span>
            <ChevronUp size={14} />
          </button>
        )}
      </div>

      {/* Header with Typewriter Badge */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            background: "rgba(59, 130, 246, 0.08)",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            borderRadius: 999,
            padding: "5px 14px",
            fontSize: 12,
            fontWeight: 700,
            color: "#3B82F6",
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: 8,
            maxWidth: "96%",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(59, 130, 246, 0.08)",
          }}
        >
          <span style={{ whiteSpace: "nowrap" }}>{typedHighlight}</span>
          <span className="hub-typewriter-cursor" style={{ color: "#3B82F6" }}>|</span>
        </div>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 8px" }}>
          Curated Placement Bundles
        </h2>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "var(--text-secondary)", maxWidth: 540, margin: "0 auto" }}>
          All-in-one curated packs to save time & fast-track your SDE interview preparation.
        </p>
      </div>

      {/* Bundles Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {BUNDLES.map((b) => {
          const items = b.noteIds.map((id) => allNotes.find((n) => n.id === id)).filter(Boolean);
          return (
            <div
              key={b.id}
              onClick={() => onOpenBundle && onOpenBundle(b, items)}
              className="category-hub-card"
              style={{
                background: "var(--surface)",
                border: `1.5px solid ${b.color}33`,
                borderTop: `4px solid ${b.color}`,
                borderRadius: 14,
                padding: "20px",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      fontWeight: 700,
                      color: b.color,
                      letterSpacing: 0.4,
                      background: `${b.color}14`,
                      padding: "3px 8px",
                      borderRadius: 6,
                    }}
                  >
                    {items.length} Notes Included
                  </span>
                  <Package size={17} color={b.color} />
                </div>

                <h3
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 17,
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    margin: "6px 0 8px",
                    lineHeight: 1.3,
                  }}
                >
                  {b.title}
                </h3>

                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    margin: "0 0 16px",
                    lineHeight: 1.5,
                  }}
                >
                  {b.tagline}
                </p>
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: b.color,
                }}
              >
                <span>View Bundle Notes</span>
                <ArrowUpRight size={14} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
