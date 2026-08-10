import React, { useState, useEffect } from "react";
import { Flame } from "lucide-react";

export default function LiveCounter() {
  const [count, setCount] = useState(127);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 2));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: "inline-flex", alignItems: "center", gap: 7, background: "#FFF7ED",
        border: "1.5px solid #FFE4C4", padding: "6px 12px", borderRadius: 999,
      }}
    >
      <Flame size={13} color="#FF8A3D" />
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#9A5B1F" }}>
        <b>{count}+</b> students downloaded notes today
      </span>
    </div>
  );
}
