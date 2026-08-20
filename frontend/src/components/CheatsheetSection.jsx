import React, { useState, useEffect } from "react";
import { Code2, Copy, Check, Terminal, Sparkles, Cpu, Plus, Trash2, X, ArrowLeft, ChevronUp } from "lucide-react";

const INITIAL_CHEATSHEETS = [
  {
    id: "dsa",
    title: "DSA Essential Patterns",
    icon: "🌲",
    color: "#3D5AFE",
    snippets: [
      {
        name: "Binary Search (Iterative - O(log N))",
        lang: "Java",
        code: `public int binarySearch(int[] nums, int target) {
    int low = 0, high = nums.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
      },
      {
        name: "Two Pointers (Pair Sum in Sorted Array)",
        lang: "Java",
        code: `public int[] twoSum(int[] numbers, int target) {
    int left = 0, right = numbers.length - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) return new int[]{left + 1, right + 1};
        else if (sum < target) left++;
        else right--;
    }
    return new int[]{-1, -1};
}`,
      },
      {
        name: "Fast & Slow Pointers (Linked List Cycle)",
        lang: "Java",
        code: `public boolean hasCycle(ListNode head) {
    if (head == null || head.next == null) return false;
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`,
      },
    ],
  },
  {
    id: "java",
    title: "Java 8 Streams & Lambdas",
    icon: "☕",
    color: "#FF8A3D",
    snippets: [
      {
        name: "Filter, Map & Collect to List",
        lang: "Java",
        code: `List<String> names = Arrays.asList("Narayan", "Prasad", "Maurya", "Code");
List<String> result = names.stream()
    .filter(name -> name.length() > 4)
    .map(String::toUpperCase)
    .collect(Collectors.toList());
// Output: [NARAYAN, PRASAD, MAURYA]`,
      },
      {
        name: "Group By & Frequency Count",
        lang: "Java",
        code: `Map<String, Long> frequencyMap = items.stream()
    .collect(Collectors.groupingBy(
        Function.identity(), 
        Collectors.counting()
    ));`,
      },
    ],
  },
  {
    id: "react",
    title: "React Modern Hooks",
    icon: "⚛️",
    color: "#06B6D4",
    snippets: [
      {
        name: "Custom useLocalStorage Hook",
        lang: "JavaScript",
        code: `function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}`,
      },
      {
        name: "useDebounce Hook (for Search Optimization)",
        lang: "JavaScript",
        code: `function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}`,
      },
    ],
  },
  {
    id: "sql",
    title: "SQL Placement Queries",
    icon: "🗄️",
    color: "#FF4D6D",
    snippets: [
      {
        name: "N-th Highest Salary (using DENSE_RANK)",
        lang: "SQL",
        code: `SELECT salary FROM (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rank_num
    FROM Employee
) ranked
WHERE rank_num = 2; -- 2nd Highest Salary`,
      },
      {
        name: "Find Duplicate Records in Table",
        lang: "SQL",
        code: `SELECT email, COUNT(email) as occurrences
FROM users
GROUP BY email
HAVING COUNT(email) > 1;`,
      },
    ],
  },
  {
    id: "python",
    title: "Python & AI Patterns",
    icon: "🐍",
    color: "#8B5CF6",
    snippets: [
      {
        name: "List & Dict Comprehensions with Conditions",
        lang: "Python",
        code: `# Filter even numbers and square them
evens_squared = [x**2 for x in range(20) if x % 2 == 0]

# Word frequency dictionary comprehension
words = ["ai", "ml", "python", "ai", "deeplearning", "ml"]
freq = {w: words.count(w) for w in set(words)}`,
      },
      {
        name: "Cosine Similarity for RAG & Embeddings",
        lang: "Python",
        code: `import numpy as np

def cosine_similarity(a, b):
    dot_product = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    return dot_product / (norm_a * norm_b)`,
      },
      {
        name: "FastAPI REST Endpoint for Model Inference",
        lang: "Python",
        code: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class QueryRequest(BaseModel):
    prompt: str

@app.post("/predict")
def predict(req: QueryRequest):
    return {"status": "success", "response": f"Processed: {req.prompt}"}`,
      },
    ],
  },
];

const CHEATSHEET_STORAGE_KEY = "codewithnarayan_custom_cheatsheets";
const ACTIVE_CHEATSHEET_TAB_STORAGE_KEY = "codewithnarayan_active_cheatsheet_tab";

export default function CheatsheetSection({ onCopyToast, isAdmin, onCollapse }) {
  const [sheets, setSheets] = useState(() => {
    try {
      const saved = localStorage.getItem(CHEATSHEET_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge initial categories with any saved categories
        const initialIds = new Set(INITIAL_CHEATSHEETS.map((s) => s.id));
        const customOnly = parsed.filter((s) => !initialIds.has(s.id));
        return [...INITIAL_CHEATSHEETS, ...customOnly];
      }
      return INITIAL_CHEATSHEETS;
    } catch {
      return INITIAL_CHEATSHEETS;
    }
  });

  const [activeTab, setActiveTab] = useState(() => {
    try {
      return localStorage.getItem(ACTIVE_CHEATSHEET_TAB_STORAGE_KEY) || "dsa";
    } catch {
      return "dsa";
    }
  });

  const [copiedIndex, setCopiedIndex] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newSnippet, setNewSnippet] = useState({ name: "", lang: "Java", code: "" });

  const [newCatModalOpen, setNewCatModalOpen] = useState(false);
  const [newCatForm, setNewCatForm] = useState({ id: "", title: "", icon: "⚡", color: "#3D5AFE" });

  // Dynamic Typewriter Ticker for Quick Revision Hub
  const CHEATSHEET_HIGHLIGHTS = [
    "⚡ Quick Revision Hub • 1-Click Code Cheatcodes",
    "🌲 DSA Patterns • Two Pointers, Binary Search & Sliding Window",
    "☕ Java 8 Streams & Lambdas • Filters, Mappings & Collectors",
    "⚛️ Modern React Hooks • custom hooks, useEffect & State Patterns",
    "🗄️ SQL Placement Queries • Joins, Aggregations & Group By",
    "🐍 Python & AI Snippets • PyTorch, NumPy & Vector Ops",
  ];
  const [typeIdx, setTypeIdx] = useState(0);
  const [typeSubIdx, setTypeSubIdx] = useState(0);
  const [typeDeleting, setTypeDeleting] = useState(false);

  useEffect(() => {
    if (CHEATSHEET_HIGHLIGHTS.length === 0) return;
    if (!typeDeleting && typeSubIdx === CHEATSHEET_HIGHLIGHTS[typeIdx].length) {
      const timeout = setTimeout(() => setTypeDeleting(true), 2200);
      return () => clearTimeout(timeout);
    }
    if (typeDeleting && typeSubIdx === 0) {
      setTypeDeleting(false);
      setTypeIdx((prev) => (prev + 1) % CHEATSHEET_HIGHLIGHTS.length);
      return;
    }
    const timeout = setTimeout(() => {
      setTypeSubIdx((prev) => prev + (typeDeleting ? -1 : 1));
    }, typeDeleting ? 20 : 40);
    return () => clearTimeout(timeout);
  }, [typeSubIdx, typeDeleting, typeIdx]);

  const typedHighlight = CHEATSHEET_HIGHLIGHTS[typeIdx]?.substring(0, typeSubIdx) || "";

  useEffect(() => {
    try {
      localStorage.setItem(CHEATSHEET_STORAGE_KEY, JSON.stringify(sheets));
    } catch (e) {}
  }, [sheets]);

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_CHEATSHEET_TAB_STORAGE_KEY, activeTab);
    } catch (e) {}
  }, [activeTab]);

  const currentSheet = sheets.find((c) => c.id === activeTab) || sheets[0] || INITIAL_CHEATSHEETS[0];

  const handleCopy = (code, idx) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    if (onCopyToast) onCopyToast("Code snippet copied to clipboard!", "success");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDeleteSnippet = (idx) => {
    if (!window.confirm("Delete this snippet?")) return;
    setSheets((prev) =>
      prev.map((s) => (s.id === activeTab ? { ...s, snippets: s.snippets.filter((_, i) => i !== idx) } : s))
    );
    if (onCopyToast) onCopyToast("Snippet deleted", "info");
  };

  const handleAddSnippet = () => {
    if (!newSnippet.name.trim() || !newSnippet.code.trim()) return;
    setSheets((prev) =>
      prev.map((s) => (s.id === activeTab ? { ...s, snippets: [newSnippet, ...s.snippets] } : s))
    );
    setNewSnippet({ name: "", lang: "Java", code: "" });
    setAddModalOpen(false);
    if (onCopyToast) onCopyToast("Snippet added successfully!", "success");
  };

  const handleAddCategory = () => {
    if (!newCatForm.title.trim()) return;
    const catId = newCatForm.id.trim().toLowerCase().replace(/\s+/g, "_") || `cat_${Date.now()}`;
    const createdCat = {
      id: catId,
      title: newCatForm.title.trim(),
      icon: newCatForm.icon.trim() || "⚡",
      color: newCatForm.color || "#3D5AFE",
      snippets: [],
    };
    setSheets((prev) => [...prev, createdCat]);
    setActiveTab(catId);
    setNewCatForm({ id: "", title: "", icon: "⚡", color: "#3D5AFE" });
    setNewCatModalOpen(false);
    if (onCopyToast) onCopyToast(`Category "${createdCat.title}" created!`, "success");
  };

  const handleDeleteCategory = (catId, e) => {
    e.stopPropagation();
    if (sheets.length <= 1) {
      alert("At least one category must remain.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this entire cheatsheet category?")) return;
    const updated = sheets.filter((s) => s.id !== catId);
    setSheets(updated);
    if (activeTab === catId) {
      setActiveTab(updated[0]?.id || "dsa");
    }
    if (onCopyToast) onCopyToast("Category deleted", "info");
  };

  return (
    <div
      id="cheatsheets"
      className="notes-explorer-container"
      style={{
        maxWidth: 1080,
        margin: "0 auto",
        padding: "20px 20px 60px",
        animation: "slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
      }}
    >
      {/* Top Banner Toolbar with Back / Collapse button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {onCollapse && (
            <button
              onClick={onCollapse}
              className="hub-back-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 8,
                border: "1.5px solid var(--border)",
                background: "var(--surface)",
                color: "var(--text-primary)",
                fontFamily: "'Sora', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to Categories</span>
            </button>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 18 }}>⚡</span>
            <span
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 800,
                fontSize: 16,
                color: "var(--text-primary)",
              }}
            >
              Cheatsheets Explorer
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                padding: "2px 7px",
                borderRadius: 999,
                background: "rgba(244, 63, 94, 0.12)",
                color: "#F43F5E",
                fontWeight: 700,
              }}
            >
              {sheets.length} Categories
            </span>
          </div>
        </div>

        {onCollapse && (
          <button
            onClick={onCollapse}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              background: "transparent",
              border: "none",
              color: "var(--text-secondary)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Sora', sans-serif",
            }}
          >
            <span>Collapse View</span>
            <ChevronUp size={14} />
          </button>
        )}
      </div>

      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            background: "rgba(244, 63, 94, 0.08)",
            border: "1px solid rgba(244, 63, 94, 0.2)",
            borderRadius: 999,
            padding: "5px 14px",
            fontSize: 12,
            fontWeight: 700,
            color: "#F43F5E",
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: 8,
            maxWidth: "96%",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(244, 63, 94, 0.08)",
          }}
        >
          <span style={{ whiteSpace: "nowrap" }}>{typedHighlight}</span>
          <span className="hub-typewriter-cursor" style={{ color: "#F43F5E" }}>|</span>
        </div>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 8px" }}>
          Instant Code Cheatsheets
        </h2>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "var(--text-secondary)", maxWidth: 540, margin: "0 auto" }}>
          Production-tested templates and most frequently asked coding patterns with 1-click copy.
        </p>
      </div>

      {/* Cheatsheet Categories & Admin Add button */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", marginBottom: 18 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {sheets.map((cs) => {
            const isActive = activeTab === cs.id;
            return (
              <button
                key={cs.id}
                onClick={() => setActiveTab(cs.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 16px",
                  borderRadius: 10,
                  border: `1.5px solid ${isActive ? cs.color : "var(--border)"}`,
                  background: isActive ? cs.color : "var(--surface)",
                  color: isActive ? "#FFFFFF" : "var(--text-primary)",
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all .15s ease",
                }}
              >
                <span>{cs.icon}</span>
                <span>{cs.title}</span>
              </button>
            );
          })}
        </div>

        {isAdmin && (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setNewCatModalOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 8,
                border: "1.5px dashed var(--border)",
                background: "var(--surface)",
                color: "var(--text-primary)",
                fontFamily: "'Sora', sans-serif",
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <Plus size={14} /> New Category
            </button>
            <button
              onClick={() => setAddModalOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 8,
                border: "none",
                background: "#14151A",
                color: "#fff",
                fontFamily: "'Sora', sans-serif",
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <Plus size={14} /> Add Snippet
            </button>
            {sheets.length > 1 && (
              <button
                onClick={(e) => handleDeleteCategory(activeTab, e)}
                title="Delete current category"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid #FFD5DA",
                  background: "#FFF1F2",
                  color: "#FF4D6D",
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <Trash2 size={13} /> Delete Category
              </button>
            )}
          </div>
        )}
      </div>

      {/* Code Snippets List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {currentSheet.snippets.map((snippet, idx) => {
          const isCopied = copiedIndex === idx;
          return (
            <div
              key={idx}
              style={{
                background: "var(--surface)",
                border: "1.5px solid var(--border)",
                borderRadius: 14,
                overflow: "hidden",
                boxShadow: "0 4px 20px -8px rgba(0,0,0,0.05)",
              }}
            >
              {/* Snippet Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 18px",
                  background: "var(--bg-secondary)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Terminal size={15} color={currentSheet.color} />
                  <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 13.5, fontWeight: 700, color: "var(--text-primary)" }}>
                    {snippet.name}
                  </span>
                  <span style={{ fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace", background: "var(--surface)", border: "1px solid var(--border)", padding: "2px 6px", borderRadius: 4, color: "var(--text-muted)", fontWeight: 600 }}>
                    {snippet.lang}
                  </span>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteSnippet(idx)}
                      title="Delete snippet (Admin)"
                      style={{ background: "#FFF1F2", border: "1px solid #FFD5DA", borderRadius: 6, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center" }}
                    >
                      <Trash2 size={13} color="#FF4D6D" />
                    </button>
                  )}

                  <button
                    onClick={() => handleCopy(snippet.code, idx)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 12px",
                      borderRadius: 6,
                      border: "1px solid var(--border)",
                      background: isCopied ? "#00B37E" : "var(--surface)",
                      color: isCopied ? "#fff" : "var(--text-primary)",
                      fontSize: 12,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all .15s ease",
                    }}
                  >
                    {isCopied ? <Check size={13} /> : <Copy size={13} />}
                    {isCopied ? "Copied!" : "Copy Code"}
                  </button>
                </div>
              </div>

              {/* Code Area */}
              <pre
                style={{
                  margin: 0,
                  padding: "16px 18px",
                  background: "var(--input-bg)",
                  color: "var(--text-primary)",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  lineHeight: 1.6,
                  overflowX: "auto",
                }}
              >
                <code>{snippet.code}</code>
              </pre>
            </div>
          );
        })}
      </div>

      {/* Admin Add Snippet Modal */}
      {addModalOpen && (
        <div onClick={() => setAddModalOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(16,18,24,0.65)", backdropFilter: "blur(4px)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 16, maxWidth: 500, width: "100%", padding: 24, animation: "popIn .15s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, margin: 0 }}>Add Code Snippet</h3>
              <button onClick={() => setAddModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                type="text"
                placeholder="Snippet Title (e.g. Dijkstra Algorithm Java)"
                value={newSnippet.name}
                onChange={(e) => setNewSnippet((s) => ({ ...s, name: e.target.value }))}
                style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)" }}
              />
              <input
                type="text"
                placeholder="Language (e.g. Java, JavaScript, Python, SQL)"
                value={newSnippet.lang}
                onChange={(e) => setNewSnippet((s) => ({ ...s, lang: e.target.value }))}
                style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)" }}
              />
              <textarea
                placeholder="Paste code here..."
                rows={6}
                value={newSnippet.code}
                onChange={(e) => setNewSnippet((s) => ({ ...s, code: e.target.value }))}
                style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--input-bg)", color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}
              />
              <button
                onClick={handleAddSnippet}
                style={{ background: "#14151A", color: "#fff", padding: "12px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif" }}
              >
                Publish Snippet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add Category Modal */}
      {newCatModalOpen && (
        <div onClick={() => setNewCatModalOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(16,18,24,0.65)", backdropFilter: "blur(4px)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 16, maxWidth: 450, width: "100%", padding: 24, animation: "popIn .15s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, margin: 0 }}>Create New Cheatsheet Category</h3>
              <button onClick={() => setNewCatModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Unique Category ID (e.g. cpp, ai, devops)</label>
                <input
                  type="text"
                  placeholder="e.g. cpp"
                  value={newCatForm.id}
                  onChange={(e) => setNewCatForm((f) => ({ ...f, id: e.target.value }))}
                  style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)" }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Category Title</label>
                <input
                  type="text"
                  placeholder="e.g. C++ STL & DSA Master"
                  value={newCatForm.title}
                  onChange={(e) => setNewCatForm((f) => ({ ...f, title: e.target.value }))}
                  style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Emoji Icon</label>
                  <input
                    type="text"
                    placeholder="⚡"
                    value={newCatForm.icon}
                    onChange={(e) => setNewCatForm((f) => ({ ...f, icon: e.target.value }))}
                    style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Theme Color</label>
                  <input
                    type="color"
                    value={newCatForm.color}
                    onChange={(e) => setNewCatForm((f) => ({ ...f, color: e.target.value }))}
                    style={{ width: "100%", height: 42, padding: "2px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg-secondary)", cursor: "pointer" }}
                  />
                </div>
              </div>
              <button
                onClick={handleCreateCategory}
                style={{ background: "#3D5AFE", color: "#fff", padding: "12px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif", marginTop: 6 }}
              >
                Create Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

