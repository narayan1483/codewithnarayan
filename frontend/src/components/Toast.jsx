import React, { useState, useCallback } from "react";
import { CheckCircle2, Info, XCircle } from "lucide-react";

const ICONS = { success: CheckCircle2, info: Info, error: XCircle };
const COLORS = { success: "#00B37E", info: "#3D5AFE", error: "#FF4D6D" };

export function useToasts() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  return { toasts, showToast };
}

export function ToastStack({ toasts }) {
  return (
    <div
      style={{
        position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", gap: 8, zIndex: 100, alignItems: "center",
        width: "100%", padding: "0 16px", pointerEvents: "none",
      }}
    >
      {toasts.map((t) => {
        const Icon = ICONS[t.type];
        const color = COLORS[t.type];
        return (
          <div
            key={t.id}
            style={{
              background: "#14151A", color: "#FFFFFF", borderRadius: 10, padding: "12px 16px",
              display: "flex", alignItems: "center", gap: 9, boxShadow: "0 8px 24px -6px rgba(0,0,0,0.35)",
              fontFamily: "Inter, sans-serif", fontSize: 13.5, animation: "toastIn .2s ease", maxWidth: 360,
              pointerEvents: "auto",
            }}
          >
            <Icon size={16} color={color} style={{ flexShrink: 0 }} />
            <span>{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}
