import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, "data.json");
const adapter = new JSONFile(file);
const defaultData = { notes: [], messages: [], nextNoteId: 1, nextMessageId: 1 };
const db = new Low(adapter, defaultData);

await db.read();
db.data ||= defaultData;

// Seed with starter notes if empty
if (db.data.notes.length === 0) {
  const starterNotes = [
    { title: "Arrays — Complete Notes", subject: "dsa", pages: 24, level: "Beginner", description: "Memory representation, traversal, 1D/2D arrays, common operations with diagrams.", downloads: 312, rating: 4.8 },
    { title: "DSA Roadmap 2026", subject: "dsa", pages: 20, level: "All Levels", description: "Your complete guide to mastering DSA — fundamentals to interview prep.", downloads: 540, rating: 4.9 },
    { title: "Linked List Cycle Patterns", subject: "dsa", pages: 16, level: "Intermediate", description: "Floyd's cycle detection, fast-slow pointers, worked examples.", downloads: 178, rating: 4.6 },
    { title: "Java Notes — Ch.1 Basics", subject: "java", pages: 32, level: "Beginner", description: "Syntax, variables, control flow — everything is an object.", downloads: 264, rating: 4.7 },
    { title: "Java Notes — Ch.2 OOP", subject: "java", pages: 28, level: "Intermediate", description: "Classes, constructors, inheritance, polymorphism, abstraction.", downloads: 201, rating: 4.7 },
    { title: "Web Dev — HTML Basics", subject: "web", pages: 18, level: "Beginner", description: "Document structure, tags, semantic HTML explained visually.", downloads: 156, rating: 4.5 },
    { title: "Web Dev — Full Notes", subject: "web", pages: 40, level: "All Levels", description: "HTML, CSS, JS fundamentals bundled into one structured set.", downloads: 389, rating: 4.8 },
    { title: "System Design Handwritten", subject: "sysdesign", pages: 30, level: "Advanced", description: "Learn, design, build, scale — core concepts with real diagrams.", downloads: 297, rating: 4.9 },
    { title: "DBMS Core Concepts", subject: "dbms", pages: 22, level: "Intermediate", description: "Normalization, transactions, indexing, ER diagrams.", downloads: 143, rating: 4.6 },
    { title: "Operating Systems Notes", subject: "os", pages: 26, level: "Intermediate", description: "Processes, scheduling, memory management, deadlocks.", downloads: 167, rating: 4.6 },
  ];

  db.data.notes = starterNotes.map((n) => ({
    id: db.data.nextNoteId++,
    ...n,
    file_path: null,
    file_name: null,
    created_at: new Date().toISOString(),
  }));
  await db.write();
}

export default db;
