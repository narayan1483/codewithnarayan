import React from "react";
import { Home, BookOpen, Heart, MessageCircle } from "lucide-react";

export default function BottomNav({ onChatToggle, wishlistCount }) {
  const items = [
    { icon: Home, label: "Home", href: "#home" },
    { icon: BookOpen, label: "Notes", href: "#notes" },
    { icon: Heart, label: "Saved", href: "#notes" },
    { icon: MessageCircle, label: "Chat", action: onChatToggle },
  ];

  return (
    <div
      className="bottom-nav"
      style={{
        display: "none", position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--surface)",
        borderTop: "1.5px solid var(--border)", zIndex: 80, padding: "8px 6px",
        alignItems: "center", justifyContent: "space-around",
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const content = (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 10px", position: "relative" }}>
            <Icon size={19} color="#454A54" />
            {item.label === "Saved" && wishlistCount > 0 && (
              <span style={{ position: "absolute", top: -2, right: 2, background: "#FF4D6D", width: 7, height: 7, borderRadius: 999 }} />
            )}
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "var(--text-muted)" }}>{item.label}</span>
          </div>
        );
        return item.action ? (
          <button key={item.label} onClick={item.action} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            {content}
          </button>
        ) : (
          <a key={item.label} href={item.href} style={{ textDecoration: "none" }}>
            {content}
          </a>
        );
      })}
    </div>
  );
}
