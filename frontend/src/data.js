export const SUBJECTS = [
  { id: "dsa", label: "DSA", tag: "data-structures", color: "#3D5AFE", icon: "🌲" },
  { id: "java", label: "Java", tag: "oop-language", color: "#FF8A3D", icon: "☕" },
  { id: "web", label: "Web Dev", tag: "html-css-js", color: "#00B37E", icon: "🌐" },
  { id: "react", label: "React", tag: "frontend-lib", color: "#06B6D4", icon: "⚛️" },
  { id: "python", label: "Python", tag: "programming", color: "#3B82F6", icon: "🐍" },
  { id: "springboot", label: "Spring Boot", tag: "java-backend", color: "#10B981", icon: "🍃" },
  { id: "mongodb", label: "MongoDB", tag: "nosql-database", color: "#22C55E", icon: "🍃" },
  { id: "networking", label: "Computer Networking", tag: "core-cs", color: "#6366F1", icon: "📡" },
  { id: "sysdesign", label: "System Design", tag: "scale-and-design", color: "#A855F7", icon: "🏛️" },
  { id: "dbms", label: "DBMS", tag: "databases", color: "#FF4D6D", icon: "🗄️" },
  { id: "os", label: "OS", tag: "operating-systems", color: "#0EA5E9", icon: "💻" },
  { id: "placement", label: "Placement Prep", tag: "interview-prep", color: "#F59E0B", icon: "🎯" },
];

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

export const SOCIALS_META = [
  { key: "instagram", label: "Instagram", href: "https://instagram.com/code.withnarayan" },
  { key: "youtube", label: "YouTube", href: "#" },
  { key: "github", label: "GitHub", href: "https://github.com/narayan1483" },
  { key: "linkedin", label: "LinkedIn", href: "https://linkedin.com/in/narayan-prasad-maurya" },
  { key: "email", label: "Email", href: "mailto:narayanprasad111126@gmail.com" },
];

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Notes", href: "#notes" },
  { label: "Roadmap 🎯", href: "#roadmap" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const BUNDLES = [
  { id: "b1", title: "DSA Complete Bundle", noteIds: [1, 2, 3], color: "#3D5AFE", tagline: "3 notes bundled — everything to crack DSA rounds" },
  { id: "b2", title: "Java Full Course Bundle", noteIds: [4, 5], color: "#FF8A3D", tagline: "2 notes bundled — Basics to OOP, complete Java prep" },
  { id: "b3", title: "Placement Ready Bundle", noteIds: [2, 8, 9], color: "#A855F7", tagline: "3 notes bundled — DSA, System Design & DBMS combined" },
];

const FALLBACK_PALETTE = ["#3D5AFE", "#FF8A3D", "#00B37E", "#A855F7", "#FF4D6D", "#0EA5E9", "#F59E0B", "#10B981", "#6366F1", "#EC4899"];

const hashColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return FALLBACK_PALETTE[Math.abs(hash) % FALLBACK_PALETTE.length];
};

export const colorFor = (subject) => {
  if (!subject) return FALLBACK_PALETTE[0];
  const s = subject.toLowerCase().replace(/[^a-z]/g, "");
  const match = SUBJECTS.find(
    (item) => item.id.toLowerCase() === s || item.label.toLowerCase().replace(/[^a-z]/g, "") === s || s.includes(item.id)
  );
  return match ? match.color : hashColor(subject.toLowerCase());
};

export const tagFor = (subject) => {
  if (!subject) return "";
  const s = subject.toLowerCase().replace(/[^a-z]/g, "");
  const match = SUBJECTS.find(
    (item) => item.id.toLowerCase() === s || item.label.toLowerCase().replace(/[^a-z]/g, "") === s || s.includes(item.id)
  );
  return match ? match.tag : subject.toLowerCase().replace(/\s+/g, "-");
};

export const iconFor = (subject) => {
  if (!subject) return "📄";
  const s = subject.toLowerCase().replace(/[^a-z]/g, "");
  const match = SUBJECTS.find(
    (item) => item.id.toLowerCase() === s || item.label.toLowerCase().replace(/[^a-z]/g, "") === s || s.includes(item.id)
  );
  return match ? match.icon : "📄";
};

