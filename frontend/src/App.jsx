import React, { useState, useEffect, useMemo } from "react";
import AnnouncementBanner from "./components/AnnouncementBanner.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import RecentlyViewed from "./components/RecentlyViewed.jsx";
import TrendingSection from "./components/TrendingSection.jsx";
import CategoryHubSection from "./components/CategoryHubSection.jsx";
import NotesSection from "./components/NotesSection.jsx";
import RoadmapSection from "./components/RoadmapSection.jsx";
import CheatsheetSection from "./components/CheatsheetSection.jsx";
import QuizSection from "./components/QuizSection.jsx";
import CommandPalette from "./components/CommandPalette.jsx";
import NoteModal from "./components/NoteModal.jsx";
import AddNoteModal from "./components/AddNoteModal.jsx";
import AdminLoginModal from "./components/AdminLoginModal.jsx";
import RequestNoteModal from "./components/RequestNoteModal.jsx";
import AboutSection from "./components/AboutSection.jsx";
import ContactSection from "./components/ContactSection.jsx";
import BundlesSection from "./components/BundlesSection.jsx";
import Footer from "./components/Footer.jsx";
import ChatWidget from "./components/ChatWidget.jsx";
import BottomNav from "./components/BottomNav.jsx";
import { useToasts, ToastStack } from "./components/Toast.jsx";
import {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote,
  sendContactMessage,
  sendNoteRequest,
  fetchAdminStats,
  getAdminPassword,
  clearAdminSession,
} from "./api.js";

const WISHLIST_KEY = "codewithnarayan_wishlist";
const RECENT_KEY = "codewithnarayan_recent_notes";

export default function App() {
  const [active, setActive] = useState("all");
  const [filterTag, setFilterTag] = useState("all");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [openNote, setOpenNote] = useState(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [owned, setOwned] = useState(new Set());
  const [wishlist, setWishlist] = useState(new Set());
  const [recentNoteIds, setRecentNoteIds] = useState(() => {
    try {
      const saved = localStorage.getItem(RECENT_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => !!getAdminPassword());
  const [adminStats, setAdminStats] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const [isCheatsheetsExpanded, setIsCheatsheetsExpanded] = useState(false);
  const [isBundlesExpanded, setIsBundlesExpanded] = useState(false);
  const [isQuizExpanded, setIsQuizExpanded] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("codewithnarayan_theme") || "light");
  const { toasts, showToast } = useToasts();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("codewithnarayan_theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // load notes from the backend, and wishlist from this browser
  useEffect(() => {
    loadNotes();
    try {
      const savedWishlist = localStorage.getItem(WISHLIST_KEY);
      if (savedWishlist) setWishlist(new Set(JSON.parse(savedWishlist)));
    } catch (e) {
      // ignore corrupt/missing data
    }
  }, []);

  // Global keyboard shortcut for Ctrl + K command palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch admin stats whenever admin logs in
  useEffect(() => {
    if (isAdmin) {
      fetchAdminStats()
        .then(setAdminStats)
        .catch(() => {});
    } else {
      setAdminStats(null);
    }
  }, [isAdmin, notes]);

  const loadNotes = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const data = await fetchNotes();
      setNotes(data);

      // Check URL query param for deep-linking (e.g., ?note=5)
      const params = new URLSearchParams(window.location.search);
      const noteId = params.get("note");
      if (noteId) {
        const found = data.find((n) => String(n.id) === String(noteId));
        if (found) handleOpenNote(found);
      }
    } catch (e) {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNote = (note) => {
    setOpenNote(note);
    if (!note) return;
    setRecentNoteIds((prev) => {
      const updated = [note.id, ...prev.filter((id) => id !== note.id)].slice(0, 5);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const recentNotesList = useMemo(() => {
    return recentNoteIds
      .map((id) => notes.find((n) => n.id === id))
      .filter(Boolean);
  }, [recentNoteIds, notes]);

  const totalDownloads = useMemo(() => {
    return notes.reduce((sum, n) => sum + Number(n.downloads || 0), 0);
  }, [notes]);

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
        showToast("Removed from saved notes", "info");
      } else {
        updated.add(id);
        showToast("Saved to your wishlist", "success");
      }
      localStorage.setItem(WISHLIST_KEY, JSON.stringify([...updated]));
      return updated;
    });
  };

  const publishNote = async (form) => {
    const newNote = await createNote(form);
    setNotes((prev) => [newNote, ...prev]);
    showToast(`"${newNote.title}" published successfully`, "success");
  };

  const editNote = async (id, form) => {
    const updated = await updateNote(id, form);
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    setOpenNote((prev) => (prev && prev.id === id ? updated : prev));
    showToast(`"${updated.title}" updated`, "success");
  };

  const openEditModal = (note) => {
    setOpenNote(null);
    setEditingNote(note);
    setAddOpen(true);
  };

  const filtered = useMemo(() => {
    let list = notes.filter((n) => {
      const s1 = (n.subject || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      const s2 = active.toLowerCase().replace(/[^a-z0-9]/g, "");
      const matchesSubject =
        active === "all" ||
        active === "wishlist" ||
        s1 === s2 ||
        (s2.includes("system") && s1.includes("system")) ||
        ((s2.includes("placement") || s2.includes("interview")) && (s1.includes("placement") || s1.includes("interview")));

      const matchesWishlist = active !== "wishlist" || wishlist.has(n.id);
      const matchesQuery =
        n.title.toLowerCase().includes(query.toLowerCase()) ||
        (n.subject || "").toLowerCase().includes(query.toLowerCase()) ||
        (n.desc || "").toLowerCase().includes(query.toLowerCase());

      // Quick Tag filters
      let matchesTag = true;
      if (filterTag === "popular") matchesTag = Number(n.downloads || 0) >= 50;
      else if (filterTag === "top_rated") matchesTag = Number(n.rating || 0) >= 4.8;
      else if (filterTag === "big_packs") matchesTag = Number(n.pages || 0) >= 20;

      return matchesSubject && matchesWishlist && matchesQuery && matchesTag;
    });

    list = [...list];
    if (sortBy === "popular") list.sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0));
    else if (sortBy === "pages") list.sort((a, b) => (b.pages ?? 0) - (a.pages ?? 0));
    else if (sortBy === "az") list.sort((a, b) => a.title.localeCompare(b.title));
    else list.sort((a, b) => b.id - a.id); // newest
    return list;
  }, [active, filterTag, query, notes, sortBy, wishlist]);

  const handleGet = (note) => {
    setOwned((prev) => new Set(prev).add(note.id));
    setNotes((prev) => prev.map((n) => (n.id === note.id ? { ...n, downloads: (n.downloads ?? 0) + 1 } : n)));
    showToast(`"${note.title}" opened`, "success");
  };

  const openBundle = (bundle, items) => {
    showToast(`${bundle.title}: ${items.map((n) => n.title).join(", ")}`, "info");
  };

  const handleContactSend = async (form) => {
    await sendContactMessage(form);
    showToast("Message sent — we'll get back to you soon", "success");
  };

  const handleRequestSubmit = async (form) => {
    await sendNoteRequest(form);
    showToast("Note request submitted successfully!", "success");
  };

  const handleDeleteNote = async (id) => {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      showToast("Note deleted", "info");
    } catch (e) {
      showToast(e.message || "Couldn't delete — try logging in again", "error");
      throw e;
    }
  };

  const handleAdminLogout = () => {
    clearAdminSession();
    setIsAdmin(false);
    showToast("Logged out of admin", "info");
  };

  const scrollToSection = (id) => {
    if (id === "notes") {
      setIsNotesExpanded(true);
    }
    if (id === "cheatsheets") {
      setIsCheatsheetsExpanded(true);
    }
    if (id === "bundles") {
      setIsBundlesExpanded(true);
    }
    if (id === "quiz") {
      setIsQuizExpanded(true);
    }
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  const isNotesActive = isNotesExpanded || query.trim().length > 0 || active !== "all" || filterTag !== "all";

  const handleOpenCheatsheets = () => {
    setIsCheatsheetsExpanded((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => scrollToSection("cheatsheets"), 80);
      }
      return next;
    });
  };

  const handleOpenBundles = () => {
    setIsBundlesExpanded((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => scrollToSection("bundles"), 80);
      }
      return next;
    });
  };

  const handleOpenQuiz = () => {
    setIsQuizExpanded((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => scrollToSection("quiz"), 80);
      }
      return next;
    });
  };

  const handleOpenSystemDesign = () => {
    const match = notes.find((n) => (n.subject || "").toLowerCase().includes("system"));
    const targetSubject = match ? match.subject : "System Design";
    setActive(targetSubject);
    setIsNotesExpanded(true);
    setTimeout(() => scrollToSection("notes"), 80);
  };

  const handleOpenInterviewQuestions = () => {
    const match = notes.find(
      (n) =>
        (n.subject || "").toLowerCase().includes("placement") ||
        (n.subject || "").toLowerCase().includes("interview")
    );
    const targetSubject = match ? match.subject : "Placement Preparation";
    setActive(targetSubject);
    setIsNotesExpanded(true);
    setTimeout(() => scrollToSection("notes"), 80);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <AnnouncementBanner isAdmin={isAdmin} />
      <Header
        ownedCount={owned.size}
        onAddNote={() => { setEditingNote(null); setAddOpen(true); }}
        theme={theme}
        onToggleTheme={toggleTheme}
        isAdmin={isAdmin}
        onAdminLoginClick={() => setAdminLoginOpen(true)}
        onAdminLogout={handleAdminLogout}
        stats={adminStats}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />
      <Hero
        query={query}
        setQuery={setQuery}
        totalNotes={notes.length}
        totalDownloads={totalDownloads}
        onRequestClick={() => setRequestModalOpen(true)}
      />

      <CategoryHubSection
        totalNotes={notes.length}
        onOpenAllNotes={() => {
          setIsNotesExpanded((prev) => {
            const nextState = !prev;
            if (nextState) {
              setTimeout(() => scrollToSection("notes"), 80);
            }
            return nextState;
          });
        }}
        isNotesExpanded={isNotesActive}
        onOpenCheatsheets={handleOpenCheatsheets}
        isCheatsheetsExpanded={isCheatsheetsExpanded}
        onOpenBundles={handleOpenBundles}
        isBundlesExpanded={isBundlesExpanded}
        onOpenQuiz={handleOpenQuiz}
        isQuizExpanded={isQuizExpanded}
        onOpenSystemDesign={handleOpenSystemDesign}
        onOpenInterviewQuestions={handleOpenInterviewQuestions}
        onSelectCategory={(subj) => {
          setActive(subj);
          setIsNotesExpanded(true);
          setTimeout(() => scrollToSection("notes"), 80);
        }}
        onScrollTo={scrollToSection}
        isAdmin={isAdmin}
      />

      {loadError ? (
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "20px", textAlign: "center" }}>
          <div style={{ background: "var(--bg-secondary)", border: "1.5px dashed var(--border)", borderRadius: 10, padding: "24px 16px", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "var(--text-secondary)" }}>
            Couldn't reach the backend at <code>localhost:5000</code>. Make sure it's running (<code>npm run dev</code> in the backend folder), then{" "}
            <button onClick={loadNotes} style={{ background: "none", border: "none", color: "#3D5AFE", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit", fontSize: "inherit" }}>
              try again
            </button>.
          </div>
        </div>
      ) : (
        isNotesActive && (
          <>
            <RecentlyViewed recentNotes={recentNotesList} onOpen={handleOpenNote} />
            <TrendingSection notes={notes} onOpen={handleOpenNote} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
            <NotesSection
              active={active}
              setActive={setActive}
              filterTag={filterTag}
              setFilterTag={setFilterTag}
              filtered={filtered}
              notes={notes}
              loading={loading}
              query={query}
              onOpen={handleOpenNote}
              sortBy={sortBy}
              setSortBy={setSortBy}
              wishlist={wishlist}
              onToggleWishlist={toggleWishlist}
              onRequestClick={() => setRequestModalOpen(true)}
              onCollapse={() => {
                setIsNotesExpanded(false);
                setActive("all");
                setFilterTag("all");
                scrollToSection("categories");
              }}
            />
          </>
        )
      )}

      {isCheatsheetsExpanded && (
        <CheatsheetSection
          onCopyToast={showToast}
          isAdmin={isAdmin}
          onCollapse={() => {
            setIsCheatsheetsExpanded(false);
            scrollToSection("categories");
          }}
        />
      )}

      {isQuizExpanded && (
        <QuizSection
          onToast={showToast}
          isAdmin={isAdmin}
          onCollapse={() => {
            setIsQuizExpanded(false);
            scrollToSection("categories");
          }}
        />
      )}

      <RoadmapSection
        onFilterNotesBySubject={(subj) => {
          setActive(subj);
          setIsNotesExpanded(true);
          scrollToSection("notes");
        }}
        isAdmin={isAdmin}
      />
      <BundlesSection allNotes={notes} onOpenBundle={openBundle} />
      <AboutSection />
      <ContactSection onSend={handleContactSend} />
      <Footer />

      <NoteModal
        note={openNote}
        onClose={() => setOpenNote(null)}
        onGet={handleGet}
        owned={openNote && owned.has(openNote.id)}
        isAdmin={isAdmin}
        onDelete={handleDeleteNote}
        onEdit={openEditModal}
      />
      {isAdmin && (
        <AddNoteModal
          open={addOpen}
          onClose={() => { setAddOpen(false); setEditingNote(null); }}
          onPublish={publishNote}
          onUpdate={editNote}
          editingNote={editingNote}
        />
      )}
      <RequestNoteModal
        open={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        onSubmitSuccess={handleRequestSubmit}
      />
      <AdminLoginModal open={adminLoginOpen} onClose={() => setAdminLoginOpen(false)} onLoginSuccess={() => setIsAdmin(true)} />
      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        notes={notes}
        onOpenNote={handleOpenNote}
        onSelectSection={scrollToSection}
      />
      <ChatWidget open={chatOpen} onOpenChange={setChatOpen} />
      <BottomNav
        onChatToggle={() => setChatOpen((v) => !v)}
        onOpenQuiz={handleOpenQuiz}
        wishlistCount={wishlist.size}
      />
      <ToastStack toasts={toasts} />
    </div>
  );
}


