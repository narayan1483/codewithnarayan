import React, { useState } from "react";
import { X, Lock, Loader2, ArrowUpRight } from "lucide-react";
import { adminLogin } from "../api.js";

export default function AdminLoginModal({ open, onClose, onLoginSuccess }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const submit = async () => {
    if (!password.trim()) {
      setError("Enter the admin password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await adminLogin(password.trim());
      setPassword("");
      onLoginSuccess();
      onClose();
    } catch (e) {
      setError(e.message || "Incorrect password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(20,21,26,0.5)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 70, padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderTop: "4px solid #14151A", borderRadius: 16, maxWidth: 360, width: "100%", padding: "22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Lock size={16} color="#14151A" />
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 17, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Admin Login</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="focus-ring" style={{ background: "var(--bg-secondary)", border: "none", borderRadius: 999, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={14} color="#6B7280" />
          </button>
        </div>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Admin password"
          autoFocus
          style={{ width: "100%", background: "var(--bg-secondary)", border: "1.5px solid var(--border)", borderRadius: 8, padding: "11px 13px", color: "var(--text-primary)", fontFamily: "Inter, sans-serif", fontSize: 13.5, outline: "none", marginBottom: 10 }}
        />

        {error && <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#FF4D6D", marginBottom: 10 }}>{error}</div>}

        <button onClick={submit} disabled={loading} style={{ width: "100%", fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 14, background: "#14151A", color: "#FFFFFF", border: "none", borderRadius: 8, padding: "12px", cursor: loading ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.7 : 1 }}>
          {loading ? (<><Loader2 size={15} className="spin" /> Checking...</>) : (<>Log in <ArrowUpRight size={15} /></>)}
        </button>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "var(--text-muted)", textAlign: "center", marginTop: 12 }}>
          Only the site owner can publish or delete notes.
        </p>
      </div>
    </div>
  );
}
