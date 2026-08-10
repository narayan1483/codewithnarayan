import React from "react";
import { Package, ArrowUpRight } from "lucide-react";
import { BUNDLES } from "../data.js";

export default function BundlesSection({ allNotes, onOpenBundle }) {
  return (
    <div style={{ background: "var(--bg-secondary)", borderTop: "1.5px solid var(--border)", borderBottom: "1.5px solid var(--border)" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "44px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 16 }}>
          <Package size={16} color="#A855F7" />
          <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>Bundles — save time, get more</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {BUNDLES.map((b) => {
            const items = b.noteIds.map((id) => allNotes.find((n) => n.id === id)).filter(Boolean);
            return (
              <button
                key={b.id}
                onClick={() => onOpenBundle(b, items)}
                style={{
                  background: "var(--surface)", border: `1.5px solid ${b.color}33`, borderTop: `4px solid ${b.color}`,
                  borderRadius: 10, padding: "18px", textAlign: "left", cursor: "pointer",
                }}
              >
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: b.color, letterSpacing: 0.4, textTransform: "uppercase" }}>
                  {items.length} notes bundled
                </span>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700, color: "var(--text-primary)", margin: "8px 0 6px" }}>{b.title}</h3>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "var(--text-secondary)", margin: "0 0 14px", lineHeight: 1.5 }}>{b.tagline}</p>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "'Sora', sans-serif", fontSize: 12.5, fontWeight: 700, color: "var(--text-primary)" }}>
                  View bundle <ArrowUpRight size={13} />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
