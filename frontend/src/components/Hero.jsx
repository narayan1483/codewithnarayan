import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import LiveCounter from "./LiveCounter.jsx";

const WORDS = ["hired.", "placed.", "confident.", "interview-ready."];

export default function Hero({ query, setQuery }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = WORDS[wordIndex];
    const speed = deleting ? 40 : 75;
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (display.length < current.length) {
          setDisplay(current.slice(0, display.length + 1));
        } else {
          setTimeout(() => setDeleting(true), 1300);
        }
      } else {
        if (display.length > 0) {
          setDisplay(current.slice(0, display.length - 1));
        } else {
          setDeleting(false);
          setWordIndex((i) => (i + 1) % WORDS.length);
        }
      }
    }, speed);
    return () => clearTimeout(timeout);
  }, [display, deleting, wordIndex]);

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "44px 20px 26px" }}>
      <div
        style={{
          display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 18,
          background: "var(--bg-secondary)", padding: "5px 12px 5px 9px", borderRadius: 999,
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: 999, background: "#00B37E" }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "var(--text-secondary)", letterSpacing: 0.3 }}>
          DSA · JAVA · WEB DEV · SYSTEM DESIGN
        </span>
      </div>
      <h1
        style={{
          fontFamily: "'Sora', sans-serif", fontWeight: 800, color: "var(--text-primary)",
          fontSize: "clamp(30px, 6vw, 48px)", lineHeight: 1.1, margin: "0 0 16px", maxWidth: 620, letterSpacing: -0.5,
          minHeight: "2.4em",
        }}
      >
        Handwritten notes<br />that get you{" "}
        <span style={{ background: "linear-gradient(transparent 58%, #B4FF39 58%)" }}>{display}</span>
        <span style={{ opacity: 0.5 }}>|</span>
      </h1>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 15.5, color: "var(--text-secondary)", maxWidth: 470, lineHeight: 1.6, margin: "0 0 28px" }}>
        Subject-wise notes, built from what actually gets asked in interviews — pick a topic and start today.
      </p>
      <div style={{ position: "relative", maxWidth: 420 }}>
        <Search size={16} color="#9A9A94" style={{ position: "absolute", left: 14, top: 13 }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes — e.g. Arrays, OOP..."
          aria-label="Search notes"
          className="focus-ring"
          style={{
            width: "100%", background: "var(--bg-secondary)", border: "1.5px solid var(--border)", borderRadius: 9,
            padding: "12px 14px 12px 40px", color: "var(--text-primary)", fontFamily: "Inter, sans-serif", fontSize: 13.5, outline: "none",
          }}
        />
      </div>
      <div style={{ marginTop: 14 }}>
        <LiveCounter />
      </div>
    </div>
  );
}
