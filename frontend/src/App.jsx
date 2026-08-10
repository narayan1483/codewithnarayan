import React, { useState, useEffect, useMemo } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import NotesSection from "./components/NotesSection.jsx";
import NoteModal from "./components/NoteModal.jsx";
import AddNoteModal from "./components/AddNoteModal.jsx";
import AdminLoginModal from "./components/AdminLoginModal.jsx";
import AboutSection from "./components/AboutSection.jsx";
import ContactSection from "./components/ContactSection.jsx";
import Footer from "./components/Footer.jsx";
import ChatWidget from "./components/ChatWidget.jsx";
import TrendingSection from "./components/TrendingSection.jsx";
import BundlesSection from "./components/BundlesSection.jsx";
import BottomNav from "./components/BottomNav.jsx";
import { useToasts, ToastStack } from "./components/Toast.jsx";
import { fetchNotes, createNote, updateNote, deleteNote, sendContactMessage, getAdminPassword, clearAdminSession } from "./api.js";

const WISHLIST_KEY = "codewithnarayan_wishlist";

export default function App() {
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [openNote, setOpenNote] = useState(null);
  const [owned, setOwned] = useState(new Set());
  const [wishlist, setWishlist] = useState(new Set());
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => !!getAdminPassword());
  const [chatOpen, setChatOpen] = useState(false);
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

  const loadNotes = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const data = await fetchNotes();
      setNotes(data);
    } catch (e) {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

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
      const matchesSubject = active === "all" || active === "wishlist" || (n.subject || "").toLowerCase() === active.toLowerCase();
      const matchesWishlist = active !== "wishlist" || wishlist.has(n.id);
      const matchesQuery = n.title.toLowerCase().includes(query.toLowerCase());
      return matchesSubject && matchesWishlist && matchesQuery;
    });
    list = [...list];
    if (sortBy === "popular") list.sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0));
    else if (sortBy === "az") list.sort((a, b) => a.title.localeCompare(b.title));
    else list.sort((a, b) => b.id - a.id); // newest
    return list;
  }, [active, query, notes, sortBy, wishlist]);

  const handleGet = (note) => {
    setOwned((prev) => new Set(prev).add(note.id));
    setNotes((prev) => prev.map((n) => (n.id === note.id ? { ...n, downloads: (n.downloads ?? 0) + 1 } : n)));
    showToast(`"${note.title}" downloaded`, "success");
  };

  const openBundle = (bundle, items) => {
    showToast(`${bundle.title}: ${items.map((n) => n.title).join(", ")}`, "info");
  };

  const handleContactSend = async (form) => {
    await sendContactMessage(form);
    showToast("Message sent — we'll get back to you soon", "success");
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

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Header
        ownedCount={owned.size}
        onAddNote={() => { setEditingNote(null); setAddOpen(true); }}
        theme={theme}
        onToggleTheme={toggleTheme}
        isAdmin={isAdmin}
        onAdminLoginClick={() => setAdminLoginOpen(true)}
        onAdminLogout={handleAdminLogout}
      />
      <Hero query={query} setQuery={setQuery} />
      <TrendingSection notes={notes} onOpen={setOpenNote} wishlist={wishlist} onToggleWishlist={toggleWishlist} />

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
        <NotesSection
          active={active}
          setActive={setActive}
          filtered={filtered}
          notes={notes}
          loading={loading}
          query={query}
          onOpen={setOpenNote}
          sortBy={sortBy}
          setSortBy={setSortBy}
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
        />
      )}

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
      <AdminLoginModal open={adminLoginOpen} onClose={() => setAdminLoginOpen(false)} onLoginSuccess={() => setIsAdmin(true)} />
      <ChatWidget open={chatOpen} onOpenChange={setChatOpen} />
      <BottomNav onChatToggle={() => setChatOpen((v) => !v)} wishlistCount={wishlist.size} />
      <ToastStack toasts={toasts} />
    </div>
  );
}
