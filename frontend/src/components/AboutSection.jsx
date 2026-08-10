import React from "react";
import { GraduationCap } from "lucide-react";

export default function AboutSection() {
  return (
    <div id="about" style={{ background: "var(--bg-secondary)", borderTop: "1.5px solid var(--border)", borderBottom: "1.5px solid var(--border)" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "56px 20px", display: "flex", gap: 40, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ width: 84, height: 84, borderRadius: 14, background: "#14151A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <GraduationCap size={38} color="#B4FF39" />
        </div>
        <div style={{ flex: 1, minWidth: 260 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#3D5AFE", letterSpacing: 0.4, textTransform: "uppercase" }}>Founder</span>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 24, color: "var(--text-primary)", margin: "8px 0 10px" }}>Narayan Prasad Maurya</h2>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14.5, color: "var(--text-secondary)", lineHeight: 1.65, maxWidth: 560, margin: 0 }}>
            Started <b style={{ color: "var(--text-primary)" }}>code.withnarayan</b> to turn messy exam-night notes into clean, diagram-first study material — so the next student doesn't have to make the same notes from scratch.
          </p>
        </div>
      </div>
    </div>
  );
}
