import React, { useMemo } from "react";
import { Loader2, ArrowDownUp } from "lucide-react";
import { colorFor } from "../data.js";
import NoteCard from "./NoteCard.jsx";

export default function NotesSection({ active, setActive, filtered, notes, loading, query, onOpen, sortBy, setSortBy, wishlist, onToggleWishlist }) {
  const subjectChips = useMemo(() => {
    const seen = new Map();
    (notes || []).forEach((n) => {
      const key = (n.subject || "").toLowerCase();
      if (key && !seen.has(key)) seen.set(key, n.subject);
    });
    return [...seen.values()].sort((a, b) => a.localeCompare(b));
  }, [notes]);

  return (
    <>
      <div id="notes" style={{ maxWidth: 1080, margin: "0 auto", padding: "0 20px 8px", display: "flex", alignItems: "center", gap: 8, overflowX: "auto", paddingBottom: 20 }}>
        <button
          className="chip"
          onClick={() => setActive("all")}
          style={{
            fontFamily: "'Sora', sans-serif", fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap",
            padding: "9px 15px", borderRadius: 6, cursor: "pointer", flexShrink: 0,
            border: `1.5px solid ${active === "all" ? "var(--text-primary)" : "var(--border)"}`,
            background: active === "all" ? "var(--text-primary)" : "var(--surface)",
            color: active === "all" ? "var(--bg)" : "var(--text-secondary)",
          }}
        >
          All Notes
        </button>
        {subjectChips.map((subject) => {
          const color = colorFor(subject);
          const isActive = active.toLowerCase() === subject.toLowerCase();
          return (
            <button
              key={subject}
              className="chip"
              onClick={() => setActive(subject)}
              style={{
                fontFamily: "'Sora', sans-serif", fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap",
                padding: "9px 15px", borderRadius: 6, cursor: "pointer", flexShrink: 0,
                border: `1.5px solid ${isActive ? color : "var(--border)"}`,
                background: isActive ? color : "var(--surface)",
                color: isActive ? "#FFFFFF" : "var(--text-secondary)",
              }}
            >
              {subject}
            </button>
          );
        })}
        <button
          className="chip"
          onClick={() => setActive("wishlist")}
          style={{
            fontFamily: "'Sora', sans-serif", fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap",
            padding: "9px 15px", borderRadius: 6, cursor: "pointer", flexShrink: 0,
            border: `1.5px solid ${active === "wishlist" ? "#FF4D6D" : "var(--border)"}`,
            background: active === "wishlist" ? "#FF4D6D" : "var(--surface)",
            color: active === "wishlist" ? "#FFFFFF" : "var(--text-secondary)",
          }}
        >
          ♥ Saved {wishlist.size > 0 ? `(${wishlist.size})` : ""}
        </button>
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 20px 8px", display: "flex", justifyContent: "flex-end" }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 6 }}>
          <ArrowDownUp size={13} color="#9A9A94" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "var(--text-secondary)",
              background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 6, padding: "6px 10px", cursor: "pointer", outline: "none",
            }}
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
            <option value="az">A–Z</option>
          </select>
        </div>
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "10px 20px 60px" }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 14 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ border: "1.5px solid var(--border)", borderRadius: 4, padding: "20px 18px 18px" }}>
                <div className="skeleton" style={{ width: "40%", height: 10, borderRadius: 4, marginBottom: 14 }} />
                <div className="skeleton" style={{ width: "85%", height: 16, borderRadius: 4, marginBottom: 10 }} />
                <div className="skeleton" style={{ width: "60%", height: 16, borderRadius: 4, marginBottom: 16 }} />
                <div className="skeleton" style={{ width: "100%", height: 12, borderRadius: 4, marginBottom: 8 }} />
                <div className="skeleton" style={{ width: "70%", height: 12, borderRadius: 4 }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
            {active === "wishlist" ? "No saved notes yet — tap the heart on any note to save it." : `No notes match "${query}" — try another search.`}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 14 }}>
            {filtered.map((note) => (
              <NoteCard key={note.id} note={note} onOpen={onOpen} wishlisted={wishlist.has(note.id)} onToggleWishlist={onToggleWishlist} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
