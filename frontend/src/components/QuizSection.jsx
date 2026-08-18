import React, { useState, useEffect } from "react";
import { HelpCircle, CheckCircle, XCircle, RotateCcw, Trophy, Sparkles, Plus, Trash2, Pencil, X, Check, ArrowRight } from "lucide-react";

const INITIAL_QUIZ_QUESTIONS = [
  {
    id: 1,
    subject: "DSA",
    question: "What is the worst-case time complexity of searching in a Hash Table (separate chaining)?",
    options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
    answer: 2, // O(N)
    explanation: "In the worst case, when all keys hash to the exact same bucket (hash collision), searching degrades to linear search O(N).",
  },
  {
    id: 2,
    subject: "Java",
    question: "Which of the following is NOT a marker interface in Java?",
    options: ["Serializable", "Cloneable", "Remote", "Runnable"],
    answer: 3, // Runnable
    explanation: "Runnable has a 'run()' method, so it is a Functional Interface, not a Marker Interface (which contains 0 methods).",
  },
  {
    id: 3,
    subject: "DBMS",
    question: "Which normal form removes transitive dependencies?",
    options: ["1NF", "2NF", "3NF", "BCNF"],
    answer: 2, // 3NF
    explanation: "Third Normal Form (3NF) ensures that all non-prime attributes are non-transitively dependent on the primary key.",
  },
  {
    id: 4,
    subject: "OS",
    question: "Which condition is NOT necessary for a Deadlock to occur?",
    options: ["Mutual Exclusion", "Hold and Wait", "Preemption allowed", "Circular Wait"],
    answer: 2, // Preemption allowed
    explanation: "Deadlock requires NO PREEMPTION (resources cannot be forcibly taken away). If preemption is allowed, deadlock cannot occur.",
  },
  {
    id: 5,
    subject: "Web Dev",
    question: "In JavaScript, what is the output of `typeof null`?",
    options: ["'null'", "'undefined'", "'object'", "'boolean'"],
    answer: 2, // 'object'
    explanation: "In JavaScript, `typeof null === 'object'` is a legacy bug from the first implementation of JS that was never fixed for backward compatibility.",
  },
];

const QUIZ_STORAGE_KEY = "codewithnarayan_custom_quiz";

export default function QuizSection({ onToast, isAdmin }) {
  const [questions, setQuestions] = useState(() => {
    try {
      const saved = localStorage.getItem(QUIZ_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_QUIZ_QUESTIONS;
    } catch {
      return INITIAL_QUIZ_QUESTIONS;
    }
  });

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [editingQId, setEditingQId] = useState(null);
  const [qForm, setQForm] = useState({
    subject: "DSA",
    question: "",
    options: ["", "", "", ""],
    answer: 0,
    explanation: "",
  });

  useEffect(() => {
    try {
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(questions));
    } catch (e) {}
  }, [questions]);

  const handleSelect = (qId, optionIdx) => {
    if (showResults) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.answer) score++;
    });
    return score;
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const handleDeleteQuestion = (id) => {
    if (!window.confirm("Delete this question?")) return;
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    if (onToast) onToast("Question removed", "info");
  };

  const openAddModal = () => {
    setQForm({ subject: "DSA", question: "", options: ["", "", "", ""], answer: 0, explanation: "" });
    setEditingQId(null);
    setModalMode("add");
  };

  const openEditModal = (q) => {
    setQForm({
      subject: q.subject || "DSA",
      question: q.question || "",
      options: [...(q.options || ["", "", "", ""])],
      answer: q.answer || 0,
      explanation: q.explanation || "",
    });
    setEditingQId(q.id);
    setModalMode("edit");
  };

  const handleSaveQuestion = () => {
    if (!qForm.question.trim() || qForm.options.some((o) => !o.trim())) {
      if (onToast) onToast("Please fill the question and all 4 options", "error");
      return;
    }

    if (modalMode === "edit") {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === editingQId ? { ...qForm, id: editingQId, answer: Number(qForm.answer) } : q
        )
      );
      if (onToast) onToast("Quiz question updated!", "success");
    } else {
      const qObj = {
        ...qForm,
        id: Date.now(),
        answer: Number(qForm.answer),
      };
      setQuestions((prev) => [...prev, qObj]);
      if (onToast) onToast("New quiz question published!", "success");
    }

    setModalMode(null);
  };

  const score = calculateScore();
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div id="quiz" style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 20px 60px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255, 138, 61, 0.1)",
            color: "#FF8A3D",
            padding: "4px 12px",
            borderRadius: 20,
            fontSize: 12,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          <HelpCircle size={14} /> Quick Daily Challenge
        </div>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 8px" }}>
          Daily Interview Placement Quiz
        </h2>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "var(--text-secondary)", maxWidth: 540, margin: "0 auto" }}>
          Select your answers and click <strong>"Submit Quiz & Check Score"</strong> to reveal correct answers with in-depth explanations!
        </p>

        {isAdmin && (
          <div style={{ marginTop: 12 }}>
            <button
              onClick={openAddModal}
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
              <Plus size={14} /> Add Quiz Question (Admin)
            </button>
          </div>
        )}
      </div>

      <div
        style={{
          background: "var(--surface)",
          border: "1.5px solid var(--border)",
          borderRadius: 16,
          padding: "24px 24px 28px",
          boxShadow: "0 10px 30px -10px rgba(0,0,0,0.06)",
        }}
      >
        {/* Score Banner when completed */}
        {showResults && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: score >= Math.ceil(questions.length * 0.7) ? "rgba(0, 179, 126, 0.1)" : "var(--bg-secondary)",
              border: `1.5px solid ${score >= Math.ceil(questions.length * 0.7) ? "#00B37E" : "var(--border)"}`,
              borderRadius: 12,
              padding: "16px 20px",
              marginBottom: 24,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Trophy size={26} color={score >= Math.ceil(questions.length * 0.7) ? "#00B37E" : "#FFB238"} />
              <div>
                <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 17, fontWeight: 800, color: "var(--text-primary)" }}>
                  Your Score: {score} / {questions.length} ({Math.round((score / (questions.length || 1)) * 100)}%)
                </div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  {score === questions.length ? "🔥 Outstanding! Perfect 100% score!" : "👍 Check the detailed green/red explanations below."}
                </div>
              </div>
            </div>

            <button
              onClick={handleReset}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 16px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: "var(--text-primary)",
                fontFamily: "'Sora', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <RotateCcw size={14} /> Retry Quiz
            </button>
          </div>
        )}

        {/* Questions list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {questions.map((q, idx) => {
            const isUserSelected = selectedAnswers[q.id] !== undefined;
            const isCorrect = selectedAnswers[q.id] === q.answer;

            return (
              <div
                key={q.id}
                style={{
                  padding: "18px 20px",
                  borderRadius: 12,
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 11.5, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#3D5AFE", background: "rgba(61, 90, 254, 0.1)", padding: "2px 8px", borderRadius: 4 }}>
                    {q.subject}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
                      Q{idx + 1} of {questions.length}
                    </span>
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => openEditModal(q)}
                          title="Edit Question (Admin)"
                          style={{ background: "#EEF2FF", border: "1px solid #C7D2FE", borderRadius: 6, padding: "3px 6px", cursor: "pointer", display: "flex", alignItems: "center" }}
                        >
                          <Pencil size={12} color="#4F46E5" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          title="Delete Question (Admin)"
                          style={{ background: "#FFF1F2", border: "1px solid #FFD5DA", borderRadius: 6, padding: "3px 6px", cursor: "pointer", display: "flex", alignItems: "center" }}
                        >
                          <Trash2 size={12} color="#FF4D6D" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 14 }}>
                  {q.question}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 8 }}>
                  {q.options.map((opt, optIdx) => {
                    const isOptionSelected = selectedAnswers[q.id] === optIdx;
                    let optBg = "var(--surface)";
                    let optBorder = "var(--border)";
                    let optColor = "var(--text-primary)";
                    let badge = null;

                    if (showResults) {
                      if (optIdx === q.answer) {
                        optBg = "#F0FDF8";
                        optBorder = "#00B37E";
                        optColor = "#00875A";
                        badge = "✅ Correct";
                      } else if (isOptionSelected && optIdx !== q.answer) {
                        optBg = "#FFF1F2";
                        optBorder = "#FF4D6D";
                        optColor = "#D90429";
                        badge = "❌ Your Answer";
                      }
                    } else if (isOptionSelected) {
                      optBg = "#3D5AFE";
                      optBorder = "#3D5AFE";
                      optColor = "#FFFFFF";
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelect(q.id, optIdx)}
                        style={{
                          textAlign: "left",
                          padding: "11px 14px",
                          borderRadius: 9,
                          border: `1.5px solid ${optBorder}`,
                          background: optBg,
                          color: optColor,
                          fontFamily: "Inter, sans-serif",
                          fontSize: 13.5,
                          fontWeight: isOptionSelected || (showResults && optIdx === q.answer) ? 700 : 500,
                          cursor: showResults ? "default" : "pointer",
                          transition: "all .12s ease",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span>{opt}</span>
                        {badge && (
                          <span style={{ fontSize: 11, fontWeight: 700, marginLeft: 8 }}>{badge}</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Detailed Explanation on submit */}
                {showResults && (
                  <div
                    style={{
                      marginTop: 14,
                      padding: "12px 16px",
                      borderRadius: 9,
                      background: isCorrect ? "rgba(0, 179, 126, 0.08)" : "rgba(255, 77, 109, 0.08)",
                      borderLeft: `4px solid ${isCorrect ? "#00B37E" : "#FF4D6D"}`,
                      fontSize: 13,
                      color: "var(--text-primary)",
                      lineHeight: 1.5,
                    }}
                  >
                    <div style={{ fontWeight: 800, color: isCorrect ? "#00B37E" : "#FF4D6D", marginBottom: 4 }}>
                      {isCorrect ? "✅ Correct Answer!" : "❌ Detailed Explanation:"}
                    </div>
                    <div>{q.explanation}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ALWAYS VISIBLE SUBMIT BUTTON */}
        {!showResults && (
          <div style={{ textAlign: "center", marginTop: 28, borderTop: "1px solid var(--border)", paddingTop: 20 }}>
            <button
              onClick={() => {
                if (answeredCount === 0) {
                  if (onToast) onToast("Please select at least 1 answer to submit!", "info");
                  return;
                }
                setShowResults(true);
                if (onToast) onToast(`Quiz submitted! You scored ${score}/${questions.length}`, "success");
              }}
              style={{
                background: "linear-gradient(135deg, #14151A 0%, #2D3748 100%)",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 12,
                padding: "14px 36px",
                fontFamily: "'Sora', sans-serif",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.18)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "all .15s ease",
              }}
            >
              <span>🚀 Submit Quiz & Check Score</span>
              <span style={{ fontSize: 12, background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: 12 }}>
                {answeredCount}/{questions.length} Answered
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Admin Add / Edit Question Modal */}
      {modalMode && (
        <div onClick={() => setModalMode(null)} style={{ position: "fixed", inset: 0, background: "rgba(16,18,24,0.65)", backdropFilter: "blur(4px)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 16, maxWidth: 520, width: "100%", padding: 24, animation: "popIn .15s ease", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, margin: 0 }}>
                {modalMode === "edit" ? "Edit Quiz Question" : "Add Quiz MCQ Question"}
              </h3>
              <button onClick={() => setModalMode(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-muted)", display: "block", marginBottom: 4 }}>SUBJECT</label>
                <input
                  type="text"
                  placeholder="Subject (e.g. DSA, Java, Web, SQL, OS)"
                  value={qForm.subject}
                  onChange={(e) => setQForm((q) => ({ ...q, subject: e.target.value }))}
                  style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)" }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-muted)", display: "block", marginBottom: 4 }}>QUESTION TEXT</label>
                <textarea
                  placeholder="Type question here..."
                  rows={3}
                  value={qForm.question}
                  onChange={(e) => setQForm((q) => ({ ...q, question: e.target.value }))}
                  style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--input-bg)", color: "var(--text-primary)" }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-muted)", display: "block", marginBottom: 4 }}>4 OPTIONS</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {qForm.options.map((opt, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, width: 65 }}>Opt {i + 1}:</span>
                      <input
                        type="text"
                        placeholder={`Option ${i + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const next = [...qForm.options];
                          next[i] = e.target.value;
                          setQForm((q) => ({ ...q, options: next }));
                        }}
                        style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)" }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>Correct Answer:</span>
                <select
                  value={qForm.answer}
                  onChange={(e) => setQForm((q) => ({ ...q, answer: Number(e.target.value) }))}
                  style={{ padding: "8px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--surface)", color: "var(--text-primary)", fontWeight: 700 }}
                >
                  <option value={0}>Option 1 ({qForm.options[0] ? qForm.options[0].slice(0, 20) : "1"})</option>
                  <option value={1}>Option 2 ({qForm.options[1] ? qForm.options[1].slice(0, 20) : "2"})</option>
                  <option value={2}>Option 3 ({qForm.options[2] ? qForm.options[2].slice(0, 20) : "3"})</option>
                  <option value={3}>Option 4 ({qForm.options[3] ? qForm.options[3].slice(0, 20) : "4"})</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-muted)", display: "block", marginBottom: 4 }}>EXPLANATION (SHOWN AFTER SUBMISSION)</label>
                <textarea
                  placeholder="Detailed explanation why this answer is correct..."
                  rows={3}
                  value={qForm.explanation}
                  onChange={(e) => setQForm((q) => ({ ...q, explanation: e.target.value }))}
                  style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)" }}
                />
              </div>

              <button
                onClick={handleSaveQuestion}
                style={{ background: "#14151A", color: "#fff", padding: "12px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif" }}
              >
                {modalMode === "edit" ? "Save Question Changes" : "Publish Question"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


