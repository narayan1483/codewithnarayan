import React from "react";
import { TrendingUp } from "lucide-react";
import NoteCard from "./NoteCard.jsx";

export default function TrendingSection({ notes, onOpen, wishlist, onToggleWishlist }) {
  const top = [...notes].sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0)).slice(0, 3);
  if (top.length === 0) return null;

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "8px 20px 30px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
        <TrendingUp size={16} color="#FF4D6D" />
        <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>Trending this week</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 14 }}>
        {top.map((note) => (
          <NoteCard key={note.id} note={note} onOpen={onOpen} wishlisted={wishlist.has(note.id)} onToggleWishlist={onToggleWishlist} />
        ))}
      </div>
    </div>
  );
}
