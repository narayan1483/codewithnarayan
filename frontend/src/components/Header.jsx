import React, { useState } from "react";
import { PenTool, ShoppingBag, Menu, Plus, Sun, Moon, Lock, LogOut, BarChart2, Download, BookOpen, MessageSquare, Inbox } from "lucide-react";
import { NAV_LINKS } from "../data.js";

export default function Header({ ownedCount, onAddNote, theme, onToggleTheme, isAdmin, onAdminLoginClick, onAdminLogout, stats }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div
      id="home"
      style={{
        position: "sticky",
        top: 0,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(8px)",
        borderBottom: "1.5px solid var(--border)",
        zIndex: 40,
      }}
    >
      {/* Admin Analytics Bar */}
      {isAdmin && stats && (
        <div
          style={{
            background: "linear-gradient(90deg, #14151A 0%, #1E2029 100%)",
            color: "#fff",
            padding: "6px 16px",
            fontSize: 12,
            fontFamily: "'JetBrains Mono', monospace",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, color: "#B4FF39" }}>
            <BarChart2 size={14} /> Admin Live Analytics
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <BookOpen size={12} color="#60A5FA" /> Notes: <strong style={{ color: "#fff" }}>{stats.totalNotes}</strong>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Download size={12} color="#34D399" /> Downloads: <strong style={{ color: "#fff" }}>{stats.totalDownloads}</strong>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <MessageSquare size={12} color="#FBBF24" /> Messages: <strong style={{ color: "#fff" }}>{stats.totalMessages}</strong>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Inbox size={12} color="#F472B6" /> Requests: <strong style={{ color: "#fff" }}>{stats.totalRequests}</strong>
            </span>
          </div>
        </div>
      )}

      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 30, height: 30, borderRadius: 7, background: "#14151A",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            <PenTool size={15} color="#B4FF39" strokeWidth={2.2} />
          </div>
          <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 15.5, color: "var(--text-primary)" }}>
            code.withnarayan
          </span>
        </div>

        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="nav-link"
              style={{ fontFamily: "'Sora', sans-serif", fontSize: 13.5, fontWeight: 600, color: "var(--text-secondary)", textDecoration: "none" }}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {isAdmin ? (
            <>
              <button
                onClick={onAddNote}
                style={{
                  display: "flex", alignItems: "center", gap: 6, background: "#14151A", color: "#FFFFFF",
                  border: "none", borderRadius: 7, padding: "8px 12px", cursor: "pointer",
                  fontFamily: "'Sora', sans-serif", fontSize: 12.5, fontWeight: 700,
                }}
              >
                <Plus size={14} /> <span>Add Note</span>
              </button>
              <button
                onClick={onAdminLogout}
                aria-label="Log out of admin"
                title="Log out of admin"
                className="focus-ring"
                style={{ background: "var(--bg-secondary)", border: "1.5px solid var(--border)", borderRadius: 7, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <LogOut size={14} color="var(--text-secondary)" />
              </button>
            </>
          ) : (
            <button
              onClick={onAdminLoginClick}
              aria-label="Admin login"
              title="Admin login"
              className="focus-ring"
              style={{ background: "var(--bg-secondary)", border: "1.5px solid var(--border)", borderRadius: 7, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <Lock size={13} color="var(--text-muted)" />
            </button>
          )}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle dark mode"
            className="focus-ring"
            style={{ background: "var(--bg-secondary)", border: "1.5px solid var(--border)", borderRadius: 7, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            {theme === "dark" ? <Sun size={15} color="#FFB238" /> : <Moon size={15} color="var(--text-secondary)" />}
          </button>
          <div style={{ position: "relative", display: "flex" }}>
            <ShoppingBag size={19} color="#454A54" />
            {ownedCount > 0 && (
              <span
                style={{
                  position: "absolute", top: -6, right: -6, background: "#00B37E", color: "#FFFFFF",
                  fontSize: 10, fontWeight: 700, borderRadius: 999, width: 16, height: 16,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {ownedCount}
              </span>
            )}
          </div>
          <button
            className="mobile-toggle"
            onClick={() => setNavOpen((v) => !v)}
            style={{ display: "none", background: "none", border: "none", cursor: "pointer" }}
          >
            <Menu size={22} color="#14151A" />
          </button>
        </div>
      </div>

      {navOpen && (
        <div style={{ borderTop: "1.5px solid var(--border)", padding: "10px 20px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setNavOpen(false)}
              style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", textDecoration: "none", padding: "8px 4px" }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
