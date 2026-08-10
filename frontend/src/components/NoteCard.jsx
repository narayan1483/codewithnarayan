import React, { useRef } from "react";
import { ArrowUpRight, Star, Heart, Share2 } from "lucide-react";
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
    const rotateX = ((y - rect.height / 2) / rect.height) * -5;
    const rotateY = ((x - rect.width / 2) / rect.width) * 5;
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

  const handleShareWhatsApp = (e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}?note=${note.id}`;
    const text = `Check out "${note.title}" handwritten notes on code.withnarayan: ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
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
        background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 14,
        overflow: "hidden", display: "flex", flexDirection: "column", position: "relative",
        transition: "transform .12s ease, box-shadow .15s ease, border-color .15s ease",
      }}
    >
      {/* Subject Accent Corner Badge */}
      <div
        style={{
          position: "absolute", top: 0, right: 0, width: 0, height: 0,
          borderStyle: "solid", borderWidth: "0 28px 28px 0",
          borderColor: `transparent ${color} transparent transparent`,
        }}
      />

      {/* Top Action Buttons (Wishlist & WhatsApp Share) */}
      <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 6, zIndex: 2 }}>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(note.id); }}
          title={wishlisted ? "Remove from wishlist" : "Save for later"}
          aria-label="Save note"
          style={{
            width: 30, height: 30, borderRadius: 999,
            background: "var(--surface)", border: "1px solid var(--border)", display: "flex",
            alignItems: "center", justifyContent: "center", cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          <Heart size={14} color={wishlisted ? "#FF4D6D" : "var(--text-secondary)"} fill={wishlisted ? "#FF4D6D" : "none"} />
        </button>

        <button
          onClick={handleShareWhatsApp}
          title="Share via WhatsApp"
          aria-label="Share via WhatsApp"
          style={{
            width: 30, height: 30, borderRadius: 999,
            background: "#25D366", border: "none", display: "flex",
            alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff",
            boxShadow: "0 2px 6px rgba(37,211,102,0.3)",
          }}
        >
          <Share2 size={13} />
        </button>
      </div>

      <button onClick={() => onOpen(note)} style={{ background: "none", border: "none", padding: 0, textAlign: "left", cursor: "pointer", width: "100%" }}>
        <div style={{ padding: "24px 20px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color, letterSpacing: 0.4, textTransform: "uppercase", fontWeight: 700 }}>
              {tag}
            </span>
            {note.file_path && (
              <span style={{ fontSize: 9.5, background: "rgba(0,179,126,0.12)", color: "#00B37E", fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>
                PDF
              </span>
            )}
            {note.driveLink && (
              <span style={{ fontSize: 9.5, background: "rgba(61,90,254,0.12)", color: "#3D5AFE", fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>
                DRIVE
              </span>
            )}
          </div>

          <h3
            style={{
              fontFamily: "'Sora', sans-serif", fontSize: 17.5, fontWeight: 700, color: "var(--text-primary)",
              margin: "0 0 10px", lineHeight: 1.32,
              background: `linear-gradient(transparent 62%, ${color}33 62%)`, display: "inline",
            }}
          >
            {note.title}
          </h3>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "var(--text-secondary)", margin: "11px 0 14px", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {note.desc}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 14 }}>
            <Star size={13} color="#FFB238" fill="#FFB238" />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>{note.rating ?? "4.7"}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#B3B3AB" }}>· {note.downloads ?? 0} downloads</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "var(--text-muted)" }}>
            <span>{note.pages} pg</span>
            <span style={{ display: "flex", alignItems: "center", gap: 3, color: "var(--text-primary)", fontWeight: 600 }}>
              View <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}
