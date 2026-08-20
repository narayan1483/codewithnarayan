import React, { useState, useEffect } from "react";
import { Search, Sparkles, Download, FileText, CheckCircle, ArrowRight, BookOpen } from "lucide-react";
import LiveCounter from "./LiveCounter.jsx";

const WORDS = [
  "hired in top tech.",
  "crack interviews.",
  "placed in MAANG.",
  "ace DSA rounds.",
  "interview-ready.",
];

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
    const speed = deleting ? 35 : 65;
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (display.length < current.length) {
          setDisplay(current.slice(0, display.length + 1));
        } else {
          setTimeout(() => setDeleting(true), 1600);
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

  // Founder name typing effect
  useEffect(() => {
    const current = FOUNDER;
    const speed = nameDeleting ? 40 : 80;
    const t = setTimeout(() => {
      if (!nameDeleting) {
        if (nameDisplay.length < current.length) {
          setNameDisplay(current.slice(0, nameDisplay.length + 1));
        } else {
          setTimeout(() => setNameDeleting(true), 2000);
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
    <section className="hero-container" style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 20px 24px" }}>
      {/* Ambient background blur glow */}
      <div className="hero-ambient-glow" />

      {/* Top Badges Bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 20, position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "var(--surface)",
            border: "1.5px solid var(--border)",
            padding: "5px 14px 5px 10px",
            borderRadius: 999,
            boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: 999, background: "#10B981", boxShadow: "0 0 8px #10B981" }} />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11.5,
              fontWeight: 700,
              color: "var(--text-secondary)",
              letterSpacing: 0.4,
            }}
          >
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
            border: "1.5px solid rgba(61, 90, 254, 0.3)",
            padding: "5px 14px",
            borderRadius: 999,
            cursor: "pointer",
            color: "#3D5AFE",
            fontSize: 12,
            fontWeight: 700,
            fontFamily: "'Sora', sans-serif",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 6px rgba(61, 90, 254, 0.1)",
          }}
        >
          <Sparkles size={13} color="#3D5AFE" /> Request Note
        </button>
      </div>

      {/* Main Hero Headline */}
      <h1
        style={{
          fontFamily: "'Sora', sans-serif",
          fontWeight: 800,
          color: "var(--text-primary)",
          fontSize: "clamp(26px, 4.8vw, 42px)",
          lineHeight: 1.2,
          margin: "0 0 14px",
          maxWidth: 820,
          letterSpacing: "-0.5px",
          position: "relative",
          zIndex: 1,
        }}
      >
        Handwritten notes<br />
        <span style={{ display: "inline-block", minHeight: "1.2em", whiteSpace: "nowrap" }}>
          that get you{" "}
          <span className="hero-dynamic-word">{display}</span>
          <span className="hero-dynamic-cursor">|</span>
        </span>
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "clamp(14.5px, 2vw, 16.5px)",
          color: "var(--text-secondary)",
          maxWidth: 580,
          lineHeight: 1.65,
          margin: "0 0 20px",
          position: "relative",
          zIndex: 1,
        }}
      >
        Subject-wise handwritten notes, visual diagrams & interview cheatcodes crafted from what gets asked in tech interviews — pick a topic and start today.
      </p>

      {/* Founder Badge */}
      <div className="founder-tag" style={{ position: "relative", zIndex: 1, marginBottom: 22 }}>
        Founder: <span className="founder-name">{nameDisplay}</span>
        <span className="hero-dynamic-cursor" style={{ fontSize: 12 }}>|</span>
      </div>

      {/* Animated Stats Banner */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: 12,
          maxWidth: 520,
          margin: "0 0 24px",
          background: "var(--surface)",
          padding: "14px 16px",
          borderRadius: 16,
          border: "1.5px solid var(--border)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="hero-stat-card" style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 6px", borderRadius: 8 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(16, 185, 129, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#10B981",
              flexShrink: 0,
            }}
          >
            <Download size={17} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", fontFamily: "'Sora', sans-serif" }}>
              {totalDownloads ? `${(totalDownloads + 3400).toLocaleString()}+` : "3,500+"}
            </div>
            <div style={{ fontSize: 11.5, color: "var(--text-secondary)", fontWeight: 500 }}>Downloads</div>
          </div>
        </div>

        <div className="hero-stat-card" style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 6px", borderRadius: 8 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(61, 90, 254, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#3D5AFE",
              flexShrink: 0,
            }}
          >
            <FileText size={17} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", fontFamily: "'Sora', sans-serif" }}>
              {totalNotes || 25} Sets
            </div>
            <div style={{ fontSize: 11.5, color: "var(--text-secondary)", fontWeight: 500 }}>Available</div>
          </div>
        </div>

        <div className="hero-stat-card" style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 6px", borderRadius: 8 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(245, 158, 11, 0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#F59E0B",
              flexShrink: 0,
            }}
          >
            <CheckCircle size={17} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", fontFamily: "'Sora', sans-serif" }}>
              100% Free
            </div>
            <div style={{ fontSize: 11.5, color: "var(--text-secondary)", fontWeight: 500 }}>Full Access</div>
          </div>
        </div>
      </div>

      {/* Quick Search Box */}
      <div
        className="hero-search-box"
        style={{
          position: "relative",
          maxWidth: 440,
          background: "var(--surface)",
          border: "1.5px solid var(--border)",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
          zIndex: 1,
        }}
      >
        <Search size={17} color="var(--text-muted)" style={{ marginLeft: 14, flexShrink: 0 }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes — e.g. Arrays, OOP, System Design..."
          aria-label="Search notes"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            padding: "13px 14px",
            color: "var(--text-primary)",
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            outline: "none",
          }}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 12px",
              color: "var(--text-muted)",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Live Active Students Counter */}
      <div style={{ marginTop: 14, position: "relative", zIndex: 1 }}>
        <LiveCounter />
      </div>
    </section>
  );
}
