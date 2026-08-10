import React, { useRef } from "react";
import { ArrowUpRight, Star, Heart } from "lucide-react";
import { colorFor, tagFor } from "../data.js";

export default function NoteCard({ note, onOpen, wishlisted, onToggleWishlist }) {
  const color = colorFor(note.subject);
  const tag = tagFor(note.subject);
  const cardRef = useRef(null);
  const touchStartX = useRef(null);

  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / rect.height) * -6;
    const rotateY = ((x - rect.width / 2) / rect.width) * 6;
    el.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const resetTilt = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0)";
    el.style.boxShadow = "none";
    el.style.borderColor = "var(--border)";
  };

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 60) onToggleWishlist(note.id); // swipe right → save
    touchStartX.current = null;
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 10px 24px -8px ${color}55`; e.currentTarget.style.borderColor = color; }}
      onMouseLeave={resetTilt}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 4,
        overflow: "hidden", display: "flex", flexDirection: "column", position: "relative",
        transition: "transform .1s ease, box-shadow .15s ease, border-color .15s ease",
      }}
    >
      <div
        style={{
          position: "absolute", top: 0, right: 0, width: 0, height: 0,
          borderStyle: "solid", borderWidth: "0 26px 26px 0",
          borderColor: `transparent ${color} transparent transparent`,
        }}
      />
      <button
        onClick={(e) => { e.stopPropagation(); onToggleWishlist(note.id); }}
        title={wishlisted ? "Remove from wishlist" : "Save for later"}
        style={{
          position: "absolute", top: 12, left: 12, width: 30, height: 30, borderRadius: 999,
          background: "rgba(255,255,255,0.92)", border: "1px solid var(--border)", display: "flex",
          alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 2,
        }}
      >
        <Heart size={14} color={wishlisted ? "#FF4D6D" : "#9A9A94"} fill={wishlisted ? "#FF4D6D" : "none"} />
      </button>
      <button onClick={() => onOpen(note)} style={{ background: "none", border: "none", padding: 0, textAlign: "left", cursor: "pointer", width: "100%" }}>
        <div style={{ padding: "24px 20px 22px" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color, letterSpacing: 0.4, textTransform: "uppercase", fontWeight: 500 }}>
            {tag}
          </span>
          <h3
            style={{
              fontFamily: "'Sora', sans-serif", fontSize: 17.5, fontWeight: 700, color: "var(--text-primary)",
              margin: "10px 0 10px", lineHeight: 1.32,
              background: `linear-gradient(transparent 62%, ${color}33 62%)`, display: "inline",
            }}
          >
            {note.title}
          </h3>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "var(--text-secondary)", margin: "11px 0 14px", lineHeight: 1.55 }}>
            {note.desc}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 14 }}>
            <Star size={13} color="#FFB238" fill="#FFB238" />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>{note.rating ?? "4.7"}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#B3B3AB" }}>· {note.downloads ?? 0} downloads</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "var(--text-muted)" }}>
            <span>{note.pages} pg</span>
            <span style={{ display: "flex", alignItems: "center", gap: 3, color: "var(--text-primary)", fontWeight: 500 }}>
              View <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}
