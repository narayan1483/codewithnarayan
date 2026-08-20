import React from "react";
import { Home, BookOpen, Target, Code, Trophy, MessageCircle } from "lucide-react";

export default function BottomNav({ onChatToggle, onOpenQuiz, wishlistCount }) {
  const items = [
    { icon: Home, label: "Home", href: "#home" },
    { icon: BookOpen, label: "Notes", href: "#notes" },
    { icon: Code, label: "Cheatsheet", href: "#cheatsheets" },
    { icon: Trophy, label: "Quiz", href: "#quiz", action: onOpenQuiz },
    { icon: Target, label: "Roadmaps", href: "#roadmap" },
    { icon: MessageCircle, label: "Chat", action: onChatToggle },
  ];

  return (
    <div
      className="bottom-nav"
      style={{
        display: "none",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "var(--surface)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderTop: "1.5px solid var(--border)",
        zIndex: 80,
        padding: "6px 4px calc(8px + env(safe-area-inset-bottom, 0px))",
        alignItems: "center",
        justifyContent: "space-around",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const content = (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              padding: "4px 6px",
              position: "relative",
              transition: "transform 0.15s ease",
            }}
          >
            <Icon size={18} color="var(--text-primary)" />
            <span
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 10,
                fontWeight: 600,
                color: "var(--text-secondary)",
              }}
            >
              {item.label}
            </span>
          </div>
        );
        return item.action ? (
          <button
            key={item.label}
            onClick={item.action}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {content}
          </button>
        ) : (
          <a
            key={item.label}
            href={item.href}
            style={{ textDecoration: "none", WebkitTapHighlightColor: "transparent" }}
          >
            {content}
          </a>
        );
      })}
    </div>
  );
}


