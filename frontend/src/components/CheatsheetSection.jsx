import React, { useState, useEffect } from "react";
import { Code2, Copy, Check, Terminal, Sparkles, Cpu, Plus, Trash2, X } from "lucide-react";

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
];

const CHEATSHEET_STORAGE_KEY = "codewithnarayan_custom_cheatsheets";

export default function CheatsheetSection({ onCopyToast, isAdmin }) {
  const [activeTab, setActiveTab] = useState("dsa");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [sheets, setSheets] = useState(() => {
    try {
      const saved = localStorage.getItem(CHEATSHEET_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_CHEATSHEETS;
    } catch {
      return INITIAL_CHEATSHEETS;
    }
  });

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newSnippet, setNewSnippet] = useState({ name: "", lang: "Java", code: "" });

  useEffect(() => {
    try {
      localStorage.setItem(CHEATSHEET_STORAGE_KEY, JSON.stringify(sheets));
    } catch (e) {}
  }, [sheets]);

  const currentSheet = sheets.find((c) => c.id === activeTab) || sheets[0];

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
    if (onCopyToast) onCopyToast("New snippet published!", "success");
  };

  return (
    <div id="cheatsheets" style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 20px 60px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(0, 179, 126, 0.1)",
            color: "#00B37E",
            padding: "4px 12px",
            borderRadius: 20,
            fontSize: 12,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          <Cpu size={14} /> Quick Revision Hub
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
            <Plus size={14} /> Add Snippet (Admin)
          </button>
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
    </div>
  );
}

