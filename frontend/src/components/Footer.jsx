import React from "react";
import { PenTool, ArrowUp, Instagram, Youtube, Github, Linkedin, Mail } from "lucide-react";
import { NAV_LINKS, SOCIALS_META } from "../data.js";

const ICONS = { instagram: Instagram, youtube: Youtube, github: Github, linkedin: Linkedin, email: Mail };

export default function Footer() {
  return (
    <div style={{ background: "#0F1015", borderRadius: "28px 28px 0 0", marginTop: 8 }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "56px 24px 30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 40, marginBottom: 40 }}>
          <div style={{ maxWidth: 320 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: "#B4FF39", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PenTool size={17} color="#0F1015" strokeWidth={2.3} />
              </div>
              <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 17, color: "#FFFFFF" }}>code.withnarayan</span>
            </div>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "#9096A5", lineHeight: 1.65, margin: "0 0 18px" }}>
              Handwritten, diagram-first notes for DSA, Java, Web Dev, System Design and more — built to get you interview-ready.
            </p>
            <a
              href="#contact"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "'Sora', sans-serif", fontWeight: 700,
                fontSize: 12.5, color: "#0F1015", background: "#B4FF39", padding: "9px 16px", borderRadius: 8, textDecoration: "none",
              }}
            >
              Have notes to share? →
            </a>
          </div>

          <div style={{ display: "flex", gap: 56, flexWrap: "wrap" }}>
            <div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#5B6072", letterSpacing: 0.5, textTransform: "uppercase" }}>Navigate</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 11, marginTop: 14 }}>
                {NAV_LINKS.map((l) => (
                  <a key={l.label} href={l.href} style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "#C7CBD6", textDecoration: "none" }}>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#5B6072", letterSpacing: 0.5, textTransform: "uppercase" }}>Follow</span>
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                {SOCIALS_META.map((s) => {
                  const Icon = ICONS[s.key];
                  return (
                    <a
                      key={s.key}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      title={s.label}
                      style={{
                        width: 38, height: 38, borderRadius: 10, background: "#1B1D26", display: "flex",
                        alignItems: "center", justifyContent: "center", textDecoration: "none",
                        transition: "background .15s ease, transform .15s ease",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#B4FF39"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#1B1D26"; e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                      <Icon size={16} color="#C7CBD6" className="footer-social-icon" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #23252F", paddingTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#5B6072", margin: 0 }}>
            © 2026 code.withnarayan · Narayan Prasad Maurya
          </p>
          <a
            href="#home"
            style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#C7CBD6", textDecoration: "none",
              display: "flex", alignItems: "center", gap: 6, background: "#1B1D26", padding: "7px 12px", borderRadius: 999,
            }}
          >
            Back to top <ArrowUp size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
