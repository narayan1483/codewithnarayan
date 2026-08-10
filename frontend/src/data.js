export const SUBJECTS = [
  { id: "dsa", label: "DSA", tag: "data-structures", color: "#3D5AFE" },
  { id: "java", label: "Java", tag: "oop-language", color: "#FF8A3D" },
  { id: "web", label: "Web Dev", tag: "html-css-js", color: "#00B37E" },
  { id: "sysdesign", label: "System Design", tag: "scale-and-design", color: "#A855F7" },
  { id: "dbms", label: "DBMS", tag: "databases", color: "#FF4D6D" },
  { id: "os", label: "OS", tag: "operating-systems", color: "#0EA5E9" },
];

// 📎 Add each note's Google Drive share link here (Anyone with link → Viewer).
// Example: "https://drive.google.com/file/d/1AbCxyz.../view?usp=sharing"
export const NOTES = [
  { id: 1, subject: "dsa", title: "Arrays — Complete Notes", pages: 24, level: "Beginner", desc: "Memory representation, traversal, 1D/2D arrays, common operations with diagrams.", rating: 4.8, downloads: 312, driveLink: "" },
  { id: 2, subject: "dsa", title: "DSA Roadmap 2026", pages: 20, level: "All Levels", desc: "Your complete guide to mastering DSA — fundamentals to interview prep.", rating: 4.9, downloads: 540, driveLink: "" },
  { id: 3, subject: "dsa", title: "Linked List Cycle Patterns", pages: 16, level: "Intermediate", desc: "Floyd's cycle detection, fast-slow pointers, worked examples.", rating: 4.6, downloads: 178, driveLink: "" },
  { id: 4, subject: "java", title: "Java Notes — Ch.1 Basics", pages: 32, level: "Beginner", desc: "Syntax, variables, control flow — everything is an object.", rating: 4.7, downloads: 264, driveLink: "" },
  { id: 5, subject: "java", title: "Java Notes — Ch.2 OOP", pages: 28, level: "Intermediate", desc: "Classes, constructors, inheritance, polymorphism, abstraction.", rating: 4.7, downloads: 201, driveLink: "" },
  { id: 6, subject: "web", title: "Web Dev — HTML Basics", pages: 18, level: "Beginner", desc: "Document structure, tags, semantic HTML explained visually.", rating: 4.5, downloads: 156, driveLink: "" },
  { id: 7, subject: "web", title: "Web Dev — Full Notes", pages: 40, level: "All Levels", desc: "HTML, CSS, JS fundamentals bundled into one structured set.", rating: 4.8, downloads: 389, driveLink: "" },
  { id: 8, subject: "sysdesign", title: "System Design Handwritten", pages: 30, level: "Advanced", desc: "Learn, design, build, scale — core concepts with real diagrams.", rating: 4.9, downloads: 297, driveLink: "" },
  { id: 9, subject: "dbms", title: "DBMS Core Concepts", pages: 22, level: "Intermediate", desc: "Normalization, transactions, indexing, ER diagrams.", rating: 4.6, downloads: 143, driveLink: "" },
  { id: 10, subject: "os", title: "Operating Systems Notes", pages: 26, level: "Intermediate", desc: "Processes, scheduling, memory management, deadlocks.", rating: 4.6, downloads: 167, driveLink: "" },
];

// ⚠️ Edit these with real links before going live
export const SOCIALS_META = [
  { key: "instagram", label: "Instagram", href: "https://instagram.com/code.withnarayan" },
  { key: "youtube", label: "YouTube", href: "#" },
  { key: "github", label: "GitHub", href: "https://github.com/narayan1483" },
  { key: "linkedin", label: "LinkedIn", href: "www.linkedin.com/in/narayan-prasad-maurya" },
  { key: "email", label: "Email", href: "narayanprasad111126@gmail.com" },
];

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Notes", href: "#notes" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const BUNDLES = [
  { id: "b1", title: "DSA Complete Bundle", noteIds: [1, 2, 3], color: "#3D5AFE", tagline: "3 notes bundled — everything to crack DSA rounds" },
  { id: "b2", title: "Java Full Course Bundle", noteIds: [4, 5], color: "#FF8A3D", tagline: "2 notes bundled — Basics to OOP, complete Java prep" },
  { id: "b3", title: "Placement Ready Bundle", noteIds: [2, 8, 9], color: "#A855F7", tagline: "3 notes bundled — DSA, System Design & DBMS combined" },
];

const FALLBACK_PALETTE = ["#3D5AFE", "#FF8A3D", "#00B37E", "#A855F7", "#FF4D6D", "#0EA5E9", "#F59E0B", "#14B8A6", "#EC4899"];

const hashColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return FALLBACK_PALETTE[Math.abs(hash) % FALLBACK_PALETTE.length];
};

export const colorFor = (subject) => {
  if (!subject) return FALLBACK_PALETTE[0];
  const match = SUBJECTS.find(
    (s) => s.id.toLowerCase() === subject.toLowerCase() || s.label.toLowerCase() === subject.toLowerCase()
  );
  return match ? match.color : hashColor(subject.toLowerCase());
};

export const tagFor = (subject) => {
  if (!subject) return "";
  const match = SUBJECTS.find(
    (s) => s.id.toLowerCase() === subject.toLowerCase() || s.label.toLowerCase() === subject.toLowerCase()
  );
  return match ? match.tag : subject.toLowerCase().replace(/\s+/g, "-");
};
