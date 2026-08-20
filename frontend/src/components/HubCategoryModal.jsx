import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Pencil,
  FileText,
  Zap,
  Layers,
  Compass,
  Package,
  Trophy,
  Code,
  BookOpen,
  Terminal,
  Sparkles,
  Cpu,
  Database,
  Folder,
  Check,
} from "lucide-react";

export const GRADIENT_PRESETS = [
  {
    id: "green",
    name: "Emerald Green",
    gradient: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
    badgeColor: "#10B981",
    glowColor: "rgba(16, 185, 129, 0.25)",
  },
  {
    id: "pink",
    name: "Crimson Pink",
    gradient: "linear-gradient(135deg, #E11D48 0%, #F43F5E 100%)",
    badgeColor: "#F43F5E",
    glowColor: "rgba(244, 63, 94, 0.25)",
  },
  {
    id: "orange",
    name: "Amber Orange",
    gradient: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)",
    badgeColor: "#F59E0B",
    glowColor: "rgba(245, 158, 11, 0.25)",
  },
  {
    id: "purple",
    name: "Royal Purple",
    gradient: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)",
    badgeColor: "#8B5CF6",
    glowColor: "rgba(139, 92, 246, 0.25)",
  },
  {
    id: "blue",
    name: "Ocean Blue",
    gradient: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
    badgeColor: "#3B82F6",
    glowColor: "rgba(59, 130, 246, 0.25)",
  },
  {
    id: "teal",
    name: "Teal Cyan",
    gradient: "linear-gradient(135deg, #0D9488 0%, #06B6D4 100%)",
    badgeColor: "#06B6D4",
    glowColor: "rgba(6, 182, 212, 0.25)",
  },
  {
    id: "indigo",
    name: "Cyber Indigo",
    gradient: "linear-gradient(135deg, #1E1B4B 0%, #4338CA 100%)",
    badgeColor: "#6366F1",
    glowColor: "rgba(99, 102, 241, 0.25)",
  },
  {
    id: "sunset",
    name: "Fiery Sunset",
    gradient: "linear-gradient(135deg, #EA580C 0%, #F97316 100%)",
    badgeColor: "#F97316",
    glowColor: "rgba(249, 115, 22, 0.25)",
  },
];

export const ICON_OPTIONS = [
  { id: "FileText", label: "Document", Icon: FileText },
  { id: "Zap", label: "Lightning", Icon: Zap },
  { id: "Layers", label: "Layers / Arch", Icon: Layers },
  { id: "Compass", label: "Compass / Map", Icon: Compass },
  { id: "Package", label: "Package / Bundle", Icon: Package },
  { id: "Trophy", label: "Trophy / Quiz", Icon: Trophy },
  { id: "Code", label: "Code", Icon: Code },
  { id: "BookOpen", label: "Book", Icon: BookOpen },
  { id: "Terminal", label: "Terminal", Icon: Terminal },
  { id: "Database", label: "Database", Icon: Database },
  { id: "Cpu", label: "Hardware / Core", Icon: Cpu },
  { id: "Folder", label: "Folder", Icon: Folder },
  { id: "Sparkles", label: "Sparkles", Icon: Sparkles },
];

export function renderHubIcon(iconName, size = 26, color = "#FFFFFF") {
  const matched = ICON_OPTIONS.find((i) => i.id === iconName);
  if (matched) {
    const Component = matched.Icon;
    return <Component size={size} color={color} strokeWidth={2.2} />;
  }
  return <FileText size={size} color={color} strokeWidth={2.2} />;
}

export default function HubCategoryModal({
  open,
  onClose,
  onSave,
  editingItem,
}) {
  const isEdit = !!editingItem;

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    badgeText: "",
    badge: "New",
    ribbon: "",
    icon: "FileText",
    colorPreset: "green",
    actionType: "subject", // "subject" | "all_notes" | "section" | "custom_link"
    target: "System Design",
    customUrl: "",
  });

  // Only re-initialize form when modal opens or editing item changes
  useEffect(() => {
    if (open) {
      if (editingItem) {
        const matchedPreset =
          GRADIENT_PRESETS.find((p) => p.gradient === editingItem.gradient) ||
          GRADIENT_PRESETS[0];

        setForm({
          title: editingItem.title || "",
          subtitle: editingItem.subtitle || "",
          badgeText: editingItem.badgeText || "",
          badge: editingItem.badge || "",
          ribbon: editingItem.ribbon || "",
          icon: editingItem.iconName || "FileText",
          colorPreset: matchedPreset.id,
          actionType: editingItem.actionType || "subject",
          target: editingItem.target || "System Design",
          customUrl: editingItem.customUrl || "",
        });
      } else {
        setForm({
          title: "",
          subtitle: "",
          badgeText: "",
          badge: "New",
          ribbon: "",
          icon: "FileText",
          colorPreset: "green",
          actionType: "subject",
          target: "System Design",
          customUrl: "",
        });
      }
    }
  }, [open, editingItem?.id]);

  if (!open) return null;

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.subtitle.trim() || !form.badgeText.trim()) {
      alert("Please fill in Title, Subtitle, and Badge Text.");
      return;
    }

    const preset =
      GRADIENT_PRESETS.find((p) => p.id === form.colorPreset) ||
      GRADIENT_PRESETS[0];

    const categoryData = {
      id: editingItem ? editingItem.id : `hub_${Date.now()}`,
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      badgeText: form.badgeText.trim(),
      badge: form.badge.trim(),
      ribbon: form.ribbon.trim(),
      iconName: form.icon,
      gradient: preset.gradient,
      badgeColor: preset.badgeColor,
      glowColor: preset.glowColor,
      actionType: form.actionType,
      target: form.target,
      customUrl: form.customUrl,
    };

    onSave(categoryData);
    onClose();
  };

  const currentPreset =
    GRADIENT_PRESETS.find((p) => p.id === form.colorPreset) ||
    GRADIENT_PRESETS[0];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(16, 18, 24, 0.75)",
        backdropFilter: "blur(6px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface)",
          border: "1.5px solid var(--border)",
          borderTop: `4px solid ${currentPreset.badgeColor}`,
          borderRadius: 20,
          maxWidth: 560,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "24px 26px 28px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
          animation: "popIn 0.18s ease",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 20,
                fontWeight: 800,
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              {isEdit ? "Edit Category Box" : "Create New Category Box"}
            </h2>
            <p
              style={{
                fontSize: 12.5,
                color: "var(--text-secondary)",
                margin: "4px 0 0",
              }}
            >
              Changes are saved 24/7 to the database and sync across all devices.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: 999,
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={16} color="var(--text-secondary)" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Live Mini Preview Box */}
          <div
            style={{
              background: "var(--bg-secondary)",
              border: "1.5px solid var(--border)",
              borderRadius: 14,
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 12,
                background: currentPreset.gradient,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                flexShrink: 0,
                boxShadow: `0 6px 14px -3px ${currentPreset.glowColor}`,
              }}
            >
              {renderHubIcon(form.icon, 22)}
              <span
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 8.5,
                  fontWeight: 700,
                  color: "#fff",
                  textAlign: "center",
                }}
              >
                {form.badgeText || "Category"}
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <strong
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 14.5,
                    color: "var(--text-primary)",
                  }}
                >
                  {form.title || "Category Box Title"}
                </strong>
                {form.badge && (
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9.5,
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: `${currentPreset.badgeColor}18`,
                      color: currentPreset.badgeColor,
                      border: `1px solid ${currentPreset.badgeColor}33`,
                    }}
                  >
                    {form.badge}
                  </span>
                )}
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  margin: "3px 0 0",
                  lineHeight: 1.35,
                }}
              >
                {form.subtitle || "Category description will appear here..."}
              </p>
            </div>
          </div>

          {/* Title & Badge Text */}
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Sora', sans-serif", display: "block", marginBottom: 6 }}>
                Box Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="e.g. System Design Mastery"
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1.5px solid var(--border)",
                  background: "var(--bg)",
                  color: "var(--text-primary)",
                  fontSize: 13.5,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Sora', sans-serif", display: "block", marginBottom: 6 }}>
                Icon Badge Label *
              </label>
              <input
                type="text"
                value={form.badgeText}
                onChange={(e) => update("badgeText", e.target.value)}
                placeholder="e.g. System Design"
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1.5px solid var(--border)",
                  background: "var(--bg)",
                  color: "var(--text-primary)",
                  fontSize: 13.5,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Subtitle Description */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Sora', sans-serif", display: "block", marginBottom: 6 }}>
              Subtitle / Description *
            </label>
            <textarea
              rows={2}
              value={form.subtitle}
              onChange={(e) => update("subtitle", e.target.value)}
              placeholder="e.g. Complete LLD & HLD architectures, DBMS, and interview notes."
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1.5px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text-primary)",
                fontSize: 13.5,
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Top Badge & Top Ribbon */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Sora', sans-serif", display: "block", marginBottom: 6 }}>
                Top Right Badge (Pill)
              </label>
              <input
                type="text"
                value={form.badge}
                onChange={(e) => update("badge", e.target.value)}
                placeholder="e.g. 2026 Updated, Hot, 15+ Notes"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1.5px solid var(--border)",
                  background: "var(--bg)",
                  color: "var(--text-primary)",
                  fontSize: 13.5,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Sora', sans-serif", display: "block", marginBottom: 6 }}>
                Corner Ribbon (Optional)
              </label>
              <input
                type="text"
                value={form.ribbon}
                onChange={(e) => update("ribbon", e.target.value)}
                placeholder="e.g. COMING SOON, LIVE"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1.5px solid var(--border)",
                  background: "var(--bg)",
                  color: "var(--text-primary)",
                  fontSize: 13.5,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Gradient Color Preset Picker */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Sora', sans-serif", display: "block", marginBottom: 8 }}>
              Color Theme
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {GRADIENT_PRESETS.map((preset) => {
                const isSelected = form.colorPreset === preset.id;
                return (
                  <button
                    type="button"
                    key={preset.id}
                    onClick={() => update("colorPreset", preset.id)}
                    style={{
                      padding: "8px 6px",
                      borderRadius: 8,
                      border: isSelected
                        ? `2px solid ${preset.badgeColor}`
                        : "1.5px solid var(--border)",
                      background: "var(--bg-secondary)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 999,
                        background: preset.gradient,
                        display: "inline-block",
                      }}
                    />
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {preset.name.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Sora', sans-serif", display: "block", marginBottom: 8 }}>
              Choose Icon
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(65px, 1fr))",
                gap: 8,
                maxHeight: 120,
                overflowY: "auto",
                padding: "4px 2px",
              }}
            >
              {ICON_OPTIONS.map((item) => {
                const isSelected = form.icon === item.id;
                const IconComp = item.Icon;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => update("icon", item.id)}
                    style={{
                      padding: "8px 4px",
                      borderRadius: 8,
                      border: isSelected ? "2px solid #3D5AFE" : "1.5px solid var(--border)",
                      background: isSelected ? "rgba(61, 90, 254, 0.1)" : "var(--bg-secondary)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 10,
                      fontWeight: 600,
                      color: isSelected ? "#3D5AFE" : "var(--text-secondary)",
                    }}
                  >
                    <IconComp size={18} />
                    <span>{item.label.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Type & Target */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Sora', sans-serif", display: "block", marginBottom: 6 }}>
              What happens on Click?
            </label>
            <select
              value={form.actionType}
              onChange={(e) => update("actionType", e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1.5px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text-primary)",
                fontSize: 13.5,
                outline: "none",
                cursor: "pointer",
                marginBottom: 10,
                boxSizing: "border-box",
              }}
            >
              <option value="subject">Filter Notes Explorer by Subject / Topic</option>
              <option value="all_notes">Toggle & Expand All Notes (25+ Notes)</option>
              <option value="section">Scroll to Page Section (Roadmap, Cheatsheets, Quiz, Bundles)</option>
              <option value="custom_link">Open External Link / Google Drive Folder</option>
            </select>

            {form.actionType === "subject" && (
              <div>
                <label style={{ fontSize: 11.5, color: "var(--text-secondary)", display: "block", marginBottom: 4 }}>
                  Subject Topic Name:
                </label>
                <input
                  type="text"
                  value={form.target}
                  onChange={(e) => update("target", e.target.value)}
                  placeholder="e.g. System Design, DSA, Java, Web Dev, Python, Spring Boot, DevOps"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 8,
                    border: "1.5px solid var(--border)",
                    background: "var(--bg)",
                    color: "var(--text-primary)",
                    fontSize: 13.5,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            )}

            {form.actionType === "section" && (
              <div>
                <label style={{ fontSize: 11.5, color: "var(--text-secondary)", display: "block", marginBottom: 4 }}>
                  Select Target Section:
                </label>
                <select
                  value={form.target}
                  onChange={(e) => update("target", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 8,
                    border: "1.5px solid var(--border)",
                    background: "var(--bg)",
                    color: "var(--text-primary)",
                    fontSize: 13.5,
                    outline: "none",
                    cursor: "pointer",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="cheatsheets">Cheatsheets & Cheatcodes (#cheatsheets)</option>
                  <option value="roadmap">Developer Roadmaps (#roadmap)</option>
                  <option value="quiz">Interactive Placement Quizzes (#quiz)</option>
                  <option value="bundles">Curated Placement Bundles (#bundles)</option>
                  <option value="contact">Contact Section (#contact)</option>
                </select>
              </div>
            )}

            {form.actionType === "custom_link" && (
              <div>
                <label style={{ fontSize: 11.5, color: "var(--text-secondary)", display: "block", marginBottom: 4 }}>
                  Enter URL (Google Drive, Notion, Website):
                </label>
                <input
                  type="url"
                  value={form.customUrl}
                  onChange={(e) => update("customUrl", e.target.value)}
                  placeholder="https://drive.google.com/..."
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 8,
                    border: "1.5px solid var(--border)",
                    background: "var(--bg)",
                    color: "var(--text-primary)",
                    fontSize: 13.5,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 10,
              paddingTop: 12,
              borderTop: "1px solid var(--border)",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "9px 16px",
                borderRadius: 8,
                border: "1.5px solid var(--border)",
                background: "var(--bg-secondary)",
                color: "var(--text-secondary)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "9px 20px",
                borderRadius: 8,
                border: "none",
                background: "#14151A",
                color: "#FFFFFF",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              }}
            >
              <Check size={15} color="#B4FF39" />
              <span>{isEdit ? "Save Changes" : "Create Category Box"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
