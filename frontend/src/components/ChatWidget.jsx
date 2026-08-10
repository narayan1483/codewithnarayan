import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

const FAQ = [
  { keys: ["price", "cost", "free", "paisa", "kitna"], reply: "All notes are free right now as part of our launch offer — no payment needed to download." },
  { keys: ["dsa", "array", "linked list"], reply: "We've got DSA notes covering Arrays, the full DSA Roadmap, and Linked List cycle patterns — check the DSA filter above." },
  { keys: ["java"], reply: "Java notes cover Basics (Ch.1) and OOP concepts (Ch.2), more chapters coming soon." },
  { keys: ["web", "html", "css", "javascript"], reply: "Web Dev notes include HTML basics and a full HTML/CSS/JS bundle — filter by 'Web Dev' to see them." },
  { keys: ["contact", "reach", "email", "message"], reply: "You can use the Contact form near the bottom of the page, or DM @code.withnarayan on Instagram." },
  { keys: ["download", "get notes", "kaise"], reply: "Click any note card, then hit 'Get Notes' in the popup — it downloads instantly, no signup needed." },
  { keys: ["upload", "publish", "add note", "seller"], reply: "Use the 'Add Note' button in the header to publish a new note with title, subject, and description." },
  { keys: ["hi", "hello", "hey", "namaste"], reply: "Hey! 👋 Ask me about notes, subjects, or how downloads work." },
];

const DEFAULT_REPLY = "I'm a simple FAQ bot for now — try asking about notes, subjects, pricing, or how to download. For anything else, use the Contact form below!";

function getReply(text) {
  const lower = text.toLowerCase();
  const match = FAQ.find((f) => f.keys.some((k) => lower.includes(k)));
  return match ? match.reply : DEFAULT_REPLY;
}

export default function ChatWidget({ open: openProp, onOpenChange }) {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = (v) => {
    setOpenState(v);
    onOpenChange && onOpenChange(v);
  };
  const [messages, setMessages] = useState([
    { id: 1, from: "bot", text: "Hi! I'm the code.withnarayan assistant. Ask me about notes, subjects, or downloads." },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg = { id: Date.now(), from: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: Date.now() + 1, from: "bot", text: getReply(text) }]);
    }, 500);
  };

  return (
    <>
      <button
        className="chat-fab"
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed", bottom: 20, right: 20, width: 54, height: 54, borderRadius: 999,
          background: "#14151A", border: "none", cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center", boxShadow: "0 10px 24px -6px rgba(0,0,0,0.35)",
          zIndex: 90,
        }}
        title="Chat with us"
      >
        {open ? <X size={22} color="#FFFFFF" /> : <MessageCircle size={22} color="#B4FF39" />}
      </button>

      {open && (
        <div
          style={{
            position: "fixed", bottom: 84, right: 20, width: 320, maxWidth: "calc(100vw - 40px)",
            height: 420, maxHeight: "70vh", background: "var(--surface)", border: "1.5px solid var(--border)",
            borderRadius: 16, boxShadow: "0 20px 48px -12px rgba(0,0,0,0.25)", display: "flex",
            flexDirection: "column", overflow: "hidden", zIndex: 90, animation: "popIn .18s ease",
          }}
        >
          <div style={{ background: "#14151A", padding: "14px 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles size={16} color="#B4FF39" />
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 13.5, color: "#FFFFFF" }}>
              code.withnarayan assistant
            </span>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "14px 12px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.from === "user" ? "flex-end" : "flex-start",
                  background: m.from === "user" ? "#14151A" : "var(--bg-secondary)",
                  color: m.from === "user" ? "#FFFFFF" : "var(--text-primary)",
                  padding: "9px 12px", borderRadius: 12, maxWidth: "82%",
                  fontFamily: "Inter, sans-serif", fontSize: 13, lineHeight: 1.45,
                }}
              >
                {m.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div style={{ borderTop: "1.5px solid var(--border)", padding: 10, display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask a question..."
              style={{
                flex: 1, background: "var(--bg-secondary)", border: "1.5px solid var(--border)", borderRadius: 8,
                padding: "9px 11px", fontFamily: "Inter, sans-serif", fontSize: 13, outline: "none", color: "var(--text-primary)",
              }}
            />
            <button
              onClick={send}
              style={{ background: "#14151A", border: "none", borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
            >
              <Send size={15} color="#B4FF39" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
