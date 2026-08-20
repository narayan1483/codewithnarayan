import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import HubCategoryModal, { renderHubIcon } from "./HubCategoryModal.jsx";
import {
  fetchCategoryHubs,
  createCategoryHub,
  updateCategoryHub,
  deleteCategoryHub,
  resetCategoryHubs,
} from "../api.js";

const HUBS_STORAGE_KEY = "codewithnarayan_custom_hubs";

const ROTATING_TOPICS = [
  "✨ Explore Study Materials • 25+ Handwritten PDF Notes",
  "🌲 DSA Roadmap 2026 • Arrays, Trees, Graphs & DP Patterns",
  "☕ Java Mastery • OOP, Multithreading & JVM Architecture",
  "🏛️ System Design • Complete LLD & HLD Interview Handbooks",
  "⚡ Cheatcodes & Cheatsheets • Fast Revision Handbooks",
  "🏆 600+ Interview Questions • Placement Ready Guides",
  "🍃 Spring Boot • Microservices & Full-Stack Backend Notes",
  "⚛️ React & Modern Web Dev • Frontend Component Guides",
  "🗄️ SQL & DBMS • Transactions, Queries & Indexing Handbooks",
  "📡 Computer Networking & OS • Core CS Interview Notes",
];

function useTopicTypewriter(topics, typingSpeed = 40, deletingSpeed = 20, pauseTime = 2200) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!topics || topics.length === 0) return;

    if (!isDeleting && subIndex === topics[index].length) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseTime);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && subIndex === 0) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % topics.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [subIndex, isDeleting, index, topics, typingSpeed, deletingSpeed, pauseTime]);

  return topics[index] ? topics[index].substring(0, subIndex) : "";
}

export const INITIAL_CATEGORIES = [
  {
    id: "all_notes",
    title: "All Notes & Handbooks",
    subtitle: "Handwritten notes, PDF guides & DSA sheets to ace your exams & SDE interviews.",
    badge: "25+ Notes",
    badgeColor: "#10B981",
    iconName: "FileText",
    gradient: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
    glowColor: "rgba(16, 185, 129, 0.25)",
    badgeText: "All CS Notes",
    actionType: "all_notes",
    target: "all",
  },
  {
    id: "cheatsheets",
    title: "Cheatsheets & Handbooks",
    subtitle: "Quick syntax sheets, one-liners & interview reference handbooks for fast revision.",
    badge: "Cheatcodes",
    badgeColor: "#F43F5E",
    iconName: "Zap",
    gradient: "linear-gradient(135deg, #E11D48 0%, #F43F5E 100%)",
    glowColor: "rgba(244, 63, 94, 0.25)",
    badgeText: "Contest Solutions",
    actionType: "section",
    target: "cheatsheets",
  },
  {
    id: "sysdesign",
    title: "System Design & Core CS",
    subtitle: "Complete LLD & HLD architectures, DBMS, Operating Systems & Networking notes.",
    badge: "Handwritten",
    badgeColor: "#F59E0B",
    iconName: "Layers",
    gradient: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)",
    glowColor: "rgba(245, 158, 11, 0.25)",
    badgeText: "System Design",
    actionType: "subject",
    target: "System Design",
  },
  {
    id: "roadmap",
    title: "Developer Roadmaps",
    subtitle: "Step-by-step career tracks for Frontend, Backend, DevOps & DSA mastery.",
    badge: "2026 Updated",
    badgeColor: "#8B5CF6",
    iconName: "Compass",
    gradient: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)",
    glowColor: "rgba(139, 92, 246, 0.25)",
    badgeText: "Roadmaps",
    ribbon: "COMING SOON",
    actionType: "section",
    target: "roadmap",
  },
  {
    id: "quiz",
    title: "Daily Placement Quiz",
    subtitle: "Interactive daily quizzes, MCQs & instant score checks with solutions.",
    badge: "Daily Quiz",
    badgeColor: "#3B82F6",
    iconName: "Trophy",
    gradient: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
    glowColor: "rgba(59, 130, 246, 0.25)",
    badgeText: "Daily Quiz",
    actionType: "section",
    target: "quiz",
  },
  {
    id: "interview_prep",
    title: "600+ Interview Q&A Sheets",
    subtitle: "600+ Placement & Technical interview questions, answers and practice sheets.",
    badge: "600+ Questions",
    badgeColor: "#06B6D4",
    iconName: "HelpCircle",
    gradient: "linear-gradient(135deg, #0D9488 0%, #06B6D4 100%)",
    glowColor: "rgba(6, 182, 212, 0.25)",
    badgeText: "Interview Prep",
    actionType: "subject",
    target: "Placement Preparation",
  },
];

export default function CategoryHubSection({
  totalNotes,
  onOpenAllNotes,
  isNotesExpanded,
  onOpenCheatsheets,
  isCheatsheetsExpanded,
  onOpenBundles,
  isBundlesExpanded,
  onOpenQuiz,
  isQuizExpanded,
  onSelectCategory,
  onScrollTo,
  isAdmin,
}) {
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem(HUBS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((c) =>
          c.id === "bundles"
            ? {
                ...c,
                id: "quiz",
                title: "Daily Placement Quiz",
                subtitle: "Interactive daily placement quizzes, MCQs & instant score checks with solutions.",
                badge: "Daily Quiz",
                badgeText: "Daily Quiz",
                iconName: "Trophy",
                actionType: "section",
                target: "quiz",
              }
            : c
        );
      }
      return INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Dynamic Typewriter Ticker for Explore Study Materials
  const typedTopic = useTopicTypewriter(ROTATING_TOPICS);

  // Fetch 24/7 synced categories from MySQL DB backend
  useEffect(() => {
    fetchCategoryHubs()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
          try {
            localStorage.setItem(HUBS_STORAGE_KEY, JSON.stringify(data));
          } catch (e) {}
        }
      })
      .catch(() => {});
  }, []);

  // Sync to state + localStorage
  const saveCategories = (newList) => {
    setCategories(newList);
    try {
      localStorage.setItem(HUBS_STORAGE_KEY, JSON.stringify(newList));
    } catch (e) {}
  };

  const handleCreateOrUpdate = async (itemData) => {
    if (editingCategory) {
      const updated = categories.map((c) => (c.id === editingCategory.id ? itemData : c));
      saveCategories(updated);
      try {
        await updateCategoryHub(editingCategory.id, itemData);
      } catch (err) {
        console.warn("Backend hub update error:", err);
      }
    } else {
      const updated = [...categories, itemData];
      saveCategories(updated);
      try {
        await createCategoryHub(itemData);
      } catch (err) {
        console.warn("Backend hub create error:", err);
      }
    }
    setEditingCategory(null);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this category box?")) return;
    const updated = categories.filter((c) => c.id !== id);
    saveCategories(updated);
    try {
      await deleteCategoryHub(id);
    } catch (err) {
      console.warn("Backend hub delete error:", err);
    }
  };

  const handleEditClick = (cat, e) => {
    e.stopPropagation();
    setEditingCategory(cat);
    setModalOpen(true);
  };

  const handleResetDefaults = async () => {
    if (!window.confirm("Reset category boxes to original default 6?")) return;
    saveCategories(INITIAL_CATEGORIES);
    try {
      const res = await resetCategoryHubs();
      if (res && res.length > 0) saveCategories(res);
    } catch (err) {
      console.warn("Backend hub reset error:", err);
    }
  };

  const handleCardClick = (cat) => {
    const isCheatsheetCard =
      cat.id === "cheatsheets" ||
      cat.target === "cheatsheets" ||
      (cat.title && cat.title.toLowerCase().includes("cheatsheet"));

    const isBundlesCard =
      cat.id === "bundles" ||
      cat.target === "bundles" ||
      (cat.title && cat.title.toLowerCase().includes("bundle"));

    const isQuizCard =
      cat.id === "quiz" ||
      cat.target === "quiz" ||
      (cat.title && cat.title.toLowerCase().includes("quiz"));

    if (cat.actionType === "all_notes") {
      onOpenAllNotes();
    } else if (isCheatsheetCard && onOpenCheatsheets) {
      onOpenCheatsheets();
    } else if (isBundlesCard && onOpenBundles) {
      onOpenBundles();
    } else if (isQuizCard && onOpenQuiz) {
      onOpenQuiz();
    } else if (cat.actionType === "subject") {
      onSelectCategory(cat.target || cat.title);
    } else if (cat.actionType === "section") {
      onScrollTo(cat.target || "roadmap");
    } else if (cat.actionType === "custom_link") {
      if (cat.customUrl) {
        window.open(cat.customUrl, "_blank", "noopener,noreferrer");
      }
    } else {
      onSelectCategory(cat.target || cat.title);
    }
  };

  return (
    <section
      id="categories"
      style={{
        maxWidth: 1080,
        margin: "0 auto",
        padding: "10px 20px 32px",
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: 24, position: "relative" }}>
        {/* Dynamic Typewriter Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            background: "rgba(61, 90, 254, 0.08)",
            border: "1px solid rgba(61, 90, 254, 0.2)",
            borderRadius: 999,
            padding: "5px 14px",
            fontSize: 12,
            fontWeight: 700,
            color: "#3D5AFE",
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: 10,
            maxWidth: "96%",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(61, 90, 254, 0.08)",
          }}
        >
          <span style={{ whiteSpace: "nowrap" }}>{typedTopic}</span>
          <span className="hub-typewriter-cursor">|</span>
        </div>

        <h2
          style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(22px, 3.5vw, 28px)",
            color: "var(--text-primary)",
            margin: "0 0 6px",
            letterSpacing: "-0.5px",
          }}
        >
          Learn By Intuition & ace SDE Interviews
        </h2>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            color: "var(--text-secondary)",
            margin: "0 0 14px",
          }}
        >
          Select a hub below to explore handwritten notes, roadmaps, cheatsheets & practice sheets.
        </p>

        {/* Admin Controls */}
        {isAdmin && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "var(--surface)",
              border: "1.5px solid var(--border)",
              padding: "6px 12px",
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                fontWeight: 700,
                color: "#10B981",
              }}
            >
              👑 Admin Mode
            </span>
            <button
              onClick={() => {
                setEditingCategory(null);
                setModalOpen(true);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 12px",
                borderRadius: 8,
                border: "none",
                background: "#14151A",
                color: "#FFFFFF",
                fontFamily: "'Sora', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <Plus size={13} color="#B4FF39" />
              <span>Add Category Box</span>
            </button>

            <button
              onClick={handleResetDefaults}
              title="Reset to default 6 category boxes"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "5px 9px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--bg-secondary)",
                color: "var(--text-secondary)",
                fontSize: 11.5,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid of Hub Boxes (codewitharyan style) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
          gap: 16,
        }}
      >
        {categories.map((cat) => {
          const isCheatsheetCard =
            cat.id === "cheatsheets" ||
            cat.target === "cheatsheets" ||
            (cat.title && cat.title.toLowerCase().includes("cheatsheet"));

          const isBundlesCard =
            cat.id === "bundles" ||
            cat.target === "bundles" ||
            (cat.title && cat.title.toLowerCase().includes("bundle"));

          const isQuizCard =
            cat.id === "quiz" ||
            cat.target === "quiz" ||
            (cat.title && cat.title.toLowerCase().includes("quiz"));

          const isCurrentActive =
            (isNotesExpanded && cat.actionType === "all_notes") ||
            (isCheatsheetsExpanded && isCheatsheetCard) ||
            (isBundlesExpanded && isBundlesCard) ||
            (isQuizExpanded && isQuizCard);

          const dynamicBadge =
            cat.id === "all_notes" ? `${totalNotes || 25}+ Notes` : cat.badge;

          return (
            <div
              key={cat.id}
              onClick={() => handleCardClick(cat)}
              className="category-hub-card"
              style={{
                position: "relative",
                background: "var(--surface)",
                border: isCurrentActive
                  ? `2px solid ${cat.badgeColor || "#10B981"}`
                  : "1.5px solid var(--border)",
                borderRadius: 16,
                padding: "20px 18px",
                display: "flex",
                alignItems: "center",
                gap: 16,
                cursor: "pointer",
                boxShadow: isCurrentActive
                  ? `0 10px 30px -8px ${cat.glowColor || "rgba(16, 185, 129, 0.25)"}`
                  : "0 2px 8px rgba(0, 0, 0, 0.04)",
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                overflow: "hidden",
              }}
            >
              {/* Optional Top Ribbon */}
              {cat.ribbon && (
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: -24,
                    transform: "rotate(30deg)",
                    background: "#14151A",
                    color: "#fff",
                    fontSize: 8.5,
                    fontWeight: 800,
                    letterSpacing: 0.5,
                    padding: "2px 26px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    fontFamily: "'JetBrains Mono', monospace",
                    zIndex: 2,
                  }}
                >
                  {cat.ribbon}
                </div>
              )}

              {/* Admin Edit/Delete Floating Controls on each Card */}
              {isAdmin && (
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    zIndex: 3,
                  }}
                >
                  <button
                    onClick={(e) => handleEditClick(cat, e)}
                    title="Edit Category Box"
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 6,
                      border: "1px solid var(--border)",
                      background: "var(--surface)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Pencil size={12} color="var(--text-secondary)" />
                  </button>

                  <button
                    onClick={(e) => handleDelete(cat.id, e)}
                    title="Delete Category Box"
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 6,
                      border: "1px solid #FFD5DA",
                      background: "#FFF1F2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Trash2 size={12} color="#FF4D6D" />
                  </button>
                </div>
              )}

              {/* Left Gradient Icon Badge */}
              <div
                className="category-badge-box"
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: 14,
                  background: cat.gradient || "linear-gradient(135deg, #059669 0%, #10B981 100%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                  flexShrink: 0,
                  boxShadow: `0 8px 16px -4px ${cat.glowColor || "rgba(16, 185, 129, 0.25)"}`,
                  transition: "transform 0.25s ease",
                }}
              >
                {renderHubIcon(cat.iconName)}
                <span
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 9.5,
                    fontWeight: 700,
                    color: "#FFFFFF",
                    textAlign: "center",
                    lineHeight: 1.1,
                    padding: "0 2px",
                    textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                  }}
                >
                  {cat.badgeText || "Category"}
                </span>
              </div>

              {/* Content Info */}
              <div style={{ flex: 1, minWidth: 0, paddingRight: isAdmin ? 48 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <h3
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontWeight: 700,
                      fontSize: 16,
                      color: "var(--text-primary)",
                      margin: 0,
                      lineHeight: 1.25,
                    }}
                  >
                    {cat.title}
                  </h3>
                  {dynamicBadge && (
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10.5,
                        fontWeight: 700,
                        padding: "2px 7px",
                        borderRadius: 6,
                        background: `${cat.badgeColor || "#10B981"}18`,
                        color: cat.badgeColor || "#10B981",
                        border: `1px solid ${cat.badgeColor || "#10B981"}33`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {dynamicBadge}
                    </span>
                  )}
                </div>

                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12.5,
                    color: "var(--text-secondary)",
                    margin: "0 0 6px",
                    lineHeight: 1.45,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {cat.subtitle}
                </p>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 12,
                    fontWeight: 700,
                    color: isCurrentActive
                      ? isCheatsheetCard
                        ? "#F43F5E"
                        : isBundlesCard
                        ? "#3B82F6"
                        : isQuizCard
                        ? "#06B6D4"
                        : "#10B981"
                      : "#3D5AFE",
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  <span>
                    {cat.actionType === "all_notes"
                      ? isNotesExpanded
                        ? "Viewing Notes (Click to Collapse)"
                        : "Explore All Notes"
                      : isCheatsheetCard
                      ? isCheatsheetsExpanded
                        ? "Viewing Cheatsheets (Click to Collapse)"
                        : "Explore Cheatsheets"
                      : isBundlesCard
                      ? isBundlesExpanded
                        ? "Viewing Bundles (Click to Collapse)"
                        : "Explore Bundles"
                      : isQuizCard
                      ? isQuizExpanded
                        ? "Viewing Quiz (Click to Collapse)"
                        : "Start Placement Quiz"
                      : cat.actionType === "subject"
                      ? `Explore ${cat.target || "Topic"} Notes`
                      : cat.actionType === "custom_link"
                      ? "Open Link"
                      : "Open Section"}
                  </span>
                  {cat.actionType === "custom_link" ? (
                    <ExternalLink size={13} />
                  ) : (
                    <ChevronRight
                      size={14}
                      style={{
                        transform: isCurrentActive ? "rotate(90deg)" : "none",
                        transition: "transform 0.2s ease",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hub Category Create / Edit Modal */}
      <HubCategoryModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleCreateOrUpdate}
        editingItem={editingCategory}
      />
    </section>
  );
}
