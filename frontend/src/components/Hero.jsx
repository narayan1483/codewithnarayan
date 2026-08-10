import React, { useState, useEffect } from "react";
import { Search, Sparkles, Download, FileText, CheckCircle } from "lucide-react";
import LiveCounter from "./LiveCounter.jsx";

const WORDS = ["hired.", "placed.", "confident.", "interview-ready."];

export default function Hero({ query, setQuery, totalNotes, totalDownloads, onRequestClick }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [deleting, setDeleting] = useState(false);
  // Typing animation for founder name
  const FOUNDER = "Narayan Prasad. Maurya";
  const [nameDisplay, setNameDisplay] = useState("");
  const [nameDeleting, setNameDeleting] = useState(false);

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

  // Name typing effect (single word-like typing + delete loop)
  useEffect(() => {
    const current = FOUNDER;
    const speed = nameDeleting ? 40 : 80;
    const t = setTimeout(() => {
      if (!nameDeleting) {
        if (nameDisplay.length < current.length) {
          setNameDisplay(current.slice(0, nameDisplay.length + 1));
        } else {
          setTimeout(() => setNameDeleting(true), 1400);
        }
      } else {
        if (nameDisplay.length > 0) {
          setNameDisplay(current.slice(0, nameDisplay.length - 1));
        } else {
          setNameDeleting(false);
        }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [nameDisplay, nameDeleting]);

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "var(--bg-secondary)", padding: "5px 12px 5px 9px", borderRadius: 999,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: 999, background: "#00B37E" }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "var(--text-secondary)", letterSpacing: 0.3 }}>
            DSA · JAVA · WEB DEV · SYSTEM DESIGN
          </span>
        </div>

        <button
          onClick={onRequestClick}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "linear-gradient(135deg, rgba(61, 90, 254, 0.12) 0%, rgba(124, 77, 255, 0.12) 100%)",
            border: "1px solid rgba(61, 90, 254, 0.25)",
            padding: "5px 14px",
            borderRadius: 999,
            cursor: "pointer",
            color: "#3D5AFE",
            fontSize: 12,
            fontWeight: 700,
            fontFamily: "'Sora', sans-serif",
            transition: "transform 0.2s ease",
          }}
        >
          <Sparkles size={13} /> Request Note
        </button>
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

      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 15.5, color: "var(--text-secondary)", maxWidth: 490, lineHeight: 1.6, margin: "0 0 24px" }}>
        Subject-wise handwritten notes, built from what actually gets asked in tech interviews — pick a topic and start today.
      </p>

      <div className="founder-tag">
        Founder: <span className="founder-name">{nameDisplay}</span> — Start learning with handwritten notes.
      </div>

      {/* Feature #4: Animated Stats Banner */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: 12,
          maxWidth: 480,
          margin: "0 0 24px",
          background: "var(--bg-secondary)",
          padding: "14px 16px",
          borderRadius: 14,
          border: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(0, 179, 126, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00B37E", flexShrink: 0 }}>
            <Download size={16} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", fontFamily: "'Sora', sans-serif" }}>
              {totalDownloads ? `${(totalDownloads + 3400).toLocaleString()}+` : "3,500+"}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500 }}>Downloads</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(61, 90, 254, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3D5AFE", flexShrink: 0 }}>
            <FileText size={16} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", fontFamily: "'Sora', sans-serif" }}>
              {totalNotes || 17} Sets
            </div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500 }}>Available</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(180, 255, 57, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#14151A", flexShrink: 0 }}>
            <CheckCircle size={16} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", fontFamily: "'Sora', sans-serif" }}>
              100% Free
            </div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500 }}>Access</div>
          </div>
        </div>
      </div>

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
