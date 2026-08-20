import React, { useMemo } from "react";
import {
  ArrowDownUp,
  Sparkles,
  Heart,
  Flame,
  Star,
  BookOpen,
  Layers,
  ArrowLeft,
  ChevronUp,
} from "lucide-react";
import { colorFor, iconFor } from "../data.js";
import NoteCard from "./NoteCard.jsx";

export default function NotesSection({
  active,
  setActive,
  filtered,
  notes,
  loading,
  query,
  onOpen,
  sortBy,
  setSortBy,
  wishlist,
  onToggleWishlist,
  onRequestClick,
  filterTag,
  setFilterTag,
  onCollapse,
}) {
  const subjectChips = useMemo(() => {
    const counts = new Map();
    (notes || []).forEach((n) => {
      const subject = n.subject || "Other";
      const key = subject.toLowerCase();
      counts.set(key, { name: subject, count: (counts.get(key)?.count || 0) + 1 });
    });
    return [...counts.values()].sort((a, b) => b.count - a.count);
  }, [notes]);

  const totalCount = notes ? notes.length : 0;

  const quickTags = [
    { id: "all", label: "All Notes", icon: <Layers size={13} /> },
    { id: "popular", label: "🔥 Most Downloaded", icon: <Flame size={13} color="#FF5F6D" /> },
    { id: "top_rated", label: "⭐ Top Rated (4.8+)", icon: <Star size={13} color="#FFB238" /> },
    { id: "big_packs", label: "📚 Full Guides (20+ pgs)", icon: <BookOpen size={13} color="#00B37E" /> },
  ];

  return (
    <div
      id="notes"
      className="notes-explorer-container"
      style={{
        animation: "slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
      }}
    >
      {/* Top Banner Toolbar with Back / Collapse button */}
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0 20px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
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
            <span style={{ fontSize: 18 }}>📚</span>
            <span
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 800,
                fontSize: 16,
                color: "var(--text-primary)",
              }}
            >
              Notes Explorer
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                padding: "2px 7px",
                borderRadius: 999,
                background: "rgba(61, 90, 254, 0.1)",
                color: "#3D5AFE",
                fontWeight: 700,
              }}
            >
              {totalCount} Total
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

      {/* Dynamic Subject Badges with Counts & Mobile Touch Scroll */}
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0 20px 8px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          paddingBottom: 8,
        }}
      >
        <button
          className="chip"
          onClick={() => setActive("all")}
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 12.5,
            fontWeight: 700,
            whiteSpace: "nowrap",
            padding: "9px 15px",
            borderRadius: 8,
            cursor: "pointer",
            flexShrink: 0,
            border: `1.5px solid ${active === "all" ? "var(--text-primary)" : "var(--border)"}`,
            background: active === "all" ? "var(--text-primary)" : "var(--surface)",
            color: active === "all" ? "var(--bg)" : "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>📑</span> All Notes <span style={{ opacity: 0.7, fontSize: 11 }}>({totalCount})</span>
        </button>

        {subjectChips.map(({ name, count }) => {
          const color = colorFor(name);
          const icon = iconFor(name);
          const isActive = active.toLowerCase() === name.toLowerCase();
          return (
            <button
              key={name}
              className="chip"
              onClick={() => setActive(name)}
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 12.5,
                fontWeight: 700,
                whiteSpace: "nowrap",
                padding: "9px 15px",
                borderRadius: 8,
                cursor: "pointer",
                flexShrink: 0,
                border: `1.5px solid ${isActive ? color : "var(--border)"}`,
                background: isActive ? color : "var(--surface)",
                color: isActive ? "#FFFFFF" : "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s ease",
              }}
            >
              <span>{icon}</span>
              <span>{name}</span>
              <span
                style={{
                  fontSize: 11,
                  padding: "1px 6px",
                  borderRadius: 999,
                  background: isActive ? "rgba(255,255,255,0.25)" : "var(--bg-secondary)",
                  color: isActive ? "#fff" : "var(--text-muted)",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}

        <button
          className="chip"
          onClick={() => setActive("wishlist")}
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 12.5,
            fontWeight: 700,
            whiteSpace: "nowrap",
            padding: "9px 15px",
            borderRadius: 8,
            cursor: "pointer",
            flexShrink: 0,
            border: `1.5px solid ${active === "wishlist" ? "#FF4D6D" : "var(--border)"}`,
            background: active === "wishlist" ? "#FF4D6D" : "var(--surface)",
            color: active === "wishlist" ? "#FFFFFF" : "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Heart size={13} fill={active === "wishlist" ? "#fff" : "none"} color={active === "wishlist" ? "#fff" : "#FF4D6D"} />
          Saved {wishlist.size > 0 ? `(${wishlist.size})` : ""}
        </button>
      </div>

      {/* Quick Tag Pills */}
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0 20px 14px",
          display: "flex",
          gap: 6,
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {quickTags.map((tag) => {
          const isSelected = (filterTag || "all") === tag.id;
          return (
            <button
              key={tag.id}
              onClick={() => setFilterTag(tag.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 11px",
                borderRadius: 20,
                border: `1px solid ${isSelected ? "#3D5AFE" : "var(--border)"}`,
                background: isSelected ? "rgba(61, 90, 254, 0.1)" : "var(--bg-secondary)",
                color: isSelected ? "#3D5AFE" : "var(--text-secondary)",
                fontFamily: "'Sora', sans-serif",
                fontSize: 11.5,
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              {tag.icon} {tag.label}
            </button>
          );
        })}
      </div>

      {/* Showing count and Sort selector */}
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0 20px 8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 600, fontFamily: "'Sora', sans-serif" }}>
          Showing <strong style={{ color: "var(--text-primary)" }}>{filtered.length}</strong> {filtered.length === 1 ? "note" : "notes"}
          {query && <span> for &ldquo;{query}&rdquo;</span>}
        </div>
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 6 }}>
          <ArrowDownUp size={13} color="#9A9A94" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: "var(--text-secondary)",
              background: "var(--surface)",
              border: "1.5px solid var(--border)",
              borderRadius: 6,
              padding: "6px 10px",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
            <option value="pages">Most Pages</option>
            <option value="az">A–Z Title</option>
          </select>
        </div>
      </div>

      {/* Notes Grid */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "10px 20px 60px" }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 14 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ border: "1.5px solid var(--border)", borderRadius: 14, padding: "20px 18px 18px", background: "var(--surface)" }}>
                <div className="skeleton" style={{ width: "35%", height: 12, borderRadius: 4, marginBottom: 14 }} />
                <div className="skeleton" style={{ width: "85%", height: 18, borderRadius: 4, marginBottom: 10 }} />
                <div className="skeleton" style={{ width: "60%", height: 18, borderRadius: 4, marginBottom: 16 }} />
                <div className="skeleton" style={{ width: "100%", height: 12, borderRadius: 4, marginBottom: 8 }} />
                <div className="skeleton" style={{ width: "75%", height: 12, borderRadius: 4, marginBottom: 18 }} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div className="skeleton" style={{ width: "30%", height: 14, borderRadius: 4 }} />
                  <div className="skeleton" style={{ width: "25%", height: 14, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "var(--text-muted)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              background: "var(--bg-secondary)",
              borderRadius: 16,
              border: "1.5px dashed var(--border)",
            }}
          >
            <p style={{ margin: "0 0 12px" }}>
              {active === "wishlist"
                ? "No saved notes yet — tap the heart on any note card to save it."
                : `No notes found matching your criteria.`}
            </p>
            {onRequestClick && (
              <button
                onClick={onRequestClick}
                style={{
                  background: "#14151A",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Sparkles size={14} color="#B4FF39" /> Request this Note Topic
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 14 }}>
            {filtered.map((note) => (
              <NoteCard key={note.id} note={note} onOpen={onOpen} wishlisted={wishlist.has(note.id)} onToggleWishlist={onToggleWishlist} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
