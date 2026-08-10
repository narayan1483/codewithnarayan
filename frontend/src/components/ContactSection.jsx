import React, { useState } from "react";
import { Check, ArrowUpRight, Loader2 } from "lucide-react";

export default function ContactSection({ onSend }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState("");

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const send = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("error");
      setErrorMsg("Please fill in all fields before sending.");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email.trim())) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    setStatus("sending");
    try {
      await onSend(form);
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (e) {
      setStatus("error");
      setErrorMsg(e.message || "Couldn't send right now — try again.");
    }
  };

  const inputStyle = { width: "100%", background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 8, padding: "11px 13px", color: "var(--text-primary)", fontFamily: "Inter, sans-serif", fontSize: 13.5, outline: "none" };
  const labelStyle = { fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "var(--text-muted)", letterSpacing: 0.3, textTransform: "uppercase", display: "block", marginBottom: 6 };

  return (
    <div id="contact" style={{ background: "var(--bg-secondary)", borderTop: "1.5px solid var(--border)", borderBottom: "1.5px solid var(--border)" }}>
      <div style={{ maxWidth: 620, margin: "0 auto", padding: "56px 20px" }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#3D5AFE", letterSpacing: 0.4, textTransform: "uppercase" }}>Get in touch</span>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 26, color: "var(--text-primary)", margin: "8px 0 24px" }}>Questions, requests, or a note idea?</h2>

        {status === "sent" ? (
          <div style={{ background: "#F0FDF8", border: "1.5px solid #00B37E33", borderRadius: 10, padding: "18px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Check size={18} color="#00B37E" />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "var(--text-primary)" }}>Message sent — we'll get back to you soon.</span>
            </div>
            <button onClick={() => setStatus("idle")} style={{ background: "none", border: "none", color: "#00B37E", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, textDecoration: "underline", cursor: "pointer" }}>
              Send another
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 180 }}>
                <label style={labelStyle}>Name</label>
                <input style={inputStyle} value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" />
              </div>
              <div style={{ flex: 1, minWidth: 180 }}>
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Message</label>
              <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical", fontFamily: "Inter, sans-serif" }} value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="What's on your mind?" />
            </div>
            {status === "error" && (
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#FF4D6D" }}>{errorMsg}</div>
            )}
            <button onClick={send} disabled={status === "sending"} style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 14, background: "#14151A", color: "#FFFFFF", border: "none", borderRadius: 8, padding: "13px", cursor: status === "sending" ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: status === "sending" ? 0.7 : 1 }}>
              {status === "sending" ? (<><Loader2 size={15} className="spin" /> Sending...</>) : (<>Send message <ArrowUpRight size={15} /></>)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
