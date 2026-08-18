import React, { useState, useEffect } from "react";
import { HelpCircle, CheckCircle, XCircle, RotateCcw, Trophy, Sparkles, Plus, Trash2, X } from "lucide-react";

const INITIAL_QUIZ_QUESTIONS = [
  {
    id: 1,
    subject: "DSA",
    question: "What is the worst-case time complexity of searching in a Hash Table (separate chaining)?",
    options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
    answer: 2, // O(N)
    explanation: "In worst case, when all keys hash to the exact same bucket (hash collision), searching degrades to linear search O(N).",
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
    explanation: "Deadlock requires NO PREEMPTION (resources cannot be forcibly taken away).",
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
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newQ, setNewQ] = useState({
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

  const handleAddQuestion = () => {
    if (!newQ.question.trim() || newQ.options.some((o) => !o.trim())) {
      if (onToast) onToast("Please fill question and all 4 options", "error");
      return;
    }
    const qObj = {
      ...newQ,
      id: Date.now(),
      answer: Number(newQ.answer),
    };
    setQuestions((prev) => [...prev, qObj]);
    setNewQ({ subject: "DSA", question: "", options: ["", "", "", ""], answer: 0, explanation: "" });
    setAddModalOpen(false);
    if (onToast) onToast("New quiz question added!", "success");
  };

  const score = calculateScore();
  const allAnswered = Object.keys(selectedAnswers).length === questions.length;

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
          Test your fundamentals with frequently asked campus & tech interview questions.
        </p>

        {isAdmin && (
          <div style={{ marginTop: 12 }}>
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
              background: score >= Math.ceil(questions.length * 0.7) ? "#F0FDF8" : "var(--bg-secondary)",
              border: `1.5px solid ${score >= Math.ceil(questions.length * 0.7) ? "#00B37E" : "var(--border)"}`,
              borderRadius: 12,
              padding: "16px 20px",
              marginBottom: 24,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Trophy size={24} color={score >= Math.ceil(questions.length * 0.7) ? "#00B37E" : "#FFB238"} />
              <div>
                <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>
                  Your Score: {score} / {questions.length} ({Math.round((score / (questions.length || 1)) * 100)}%)
                </div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  {score === questions.length ? "🔥 Outstanding! Perfect score!" : "👍 Good attempt! Review the explanations below."}
                </div>
              </div>
            </div>

            <button
              onClick={handleReset}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
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
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        title="Delete Question (Admin)"
                        style={{ background: "#FFF1F2", border: "1px solid #FFD5DA", borderRadius: 6, padding: "3px 6px", cursor: "pointer", display: "flex", alignItems: "center" }}
                      >
                        <Trash2 size={12} color="#FF4D6D" />
                      </button>
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

                    if (showResults) {
                      if (optIdx === q.answer) {
                        optBg = "#F0FDF8";
                        optBorder = "#00B37E";
                        optColor = "#00B37E";
                      } else if (isOptionSelected && !isCorrect) {
                        optBg = "#FFF1F2";
                        optBorder = "#FF4D6D";
                        optColor = "#FF4D6D";
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
                          padding: "10px 14px",
                          borderRadius: 8,
                          border: `1.5px solid ${optBorder}`,
                          background: optBg,
                          color: optColor,
                          fontFamily: "Inter, sans-serif",
                          fontSize: 13.5,
                          fontWeight: isOptionSelected || (showResults && optIdx === q.answer) ? 700 : 500,
                          cursor: showResults ? "default" : "pointer",
                          transition: "all .12s ease",
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on submit */}
                {showResults && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: "10px 14px",
                      borderRadius: 8,
                      background: isCorrect ? "rgba(0, 179, 126, 0.08)" : "rgba(255, 77, 109, 0.08)",
                      borderLeft: `3px solid ${isCorrect ? "#00B37E" : "#FF4D6D"}`,
                      fontSize: 12.5,
                      color: "var(--text-secondary)",
                      lineHeight: 1.5,
                    }}
                  >
                    <strong style={{ color: isCorrect ? "#00B37E" : "#FF4D6D" }}>
                      {isCorrect ? "✅ Correct! " : "❌ Explanation: "}
                    </strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        {!showResults && (
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <button
              onClick={() => {
                if (!allAnswered) {
                  if (onToast) onToast("Please answer all questions before submitting!", "info");
                  return;
                }
                setShowResults(true);
                if (onToast) onToast(`Quiz completed! You scored ${score}/${questions.length}`, "success");
              }}
              style={{
                background: allAnswered ? "#14151A" : "var(--bg-secondary)",
                color: allAnswered ? "#FFFFFF" : "var(--text-muted)",
                border: "none",
                borderRadius: 10,
                padding: "12px 28px",
                fontFamily: "'Sora', sans-serif",
                fontSize: 14.5,
                fontWeight: 700,
                cursor: allAnswered ? "pointer" : "default",
                boxShadow: allAnswered ? "0 4px 14px rgba(20, 21, 26, 0.25)" : "none",
              }}
            >
              Submit Quiz & Check Score
            </button>
          </div>
        )}
      </div>

      {/* Admin Add Question Modal */}
      {addModalOpen && (
        <div onClick={() => setAddModalOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(16,18,24,0.65)", backdropFilter: "blur(4px)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 16, maxWidth: 520, width: "100%", padding: 24, animation: "popIn .15s ease", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, margin: 0 }}>Add Quiz MCQ Question</h3>
              <button onClick={() => setAddModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                type="text"
                placeholder="Subject (e.g. DSA, Java, Web, SQL, Python)"
                value={newQ.subject}
                onChange={(e) => setNewQ((q) => ({ ...q, subject: e.target.value }))}
                style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)" }}
              />
              <textarea
                placeholder="Question text..."
                rows={3}
                value={newQ.question}
                onChange={(e) => setNewQ((q) => ({ ...q, question: e.target.value }))}
                style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--input-bg)", color: "var(--text-primary)" }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {newQ.options.map((opt, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, width: 60 }}>Opt {i + 1}:</span>
                    <input
                      type="text"
                      placeholder={`Option ${i + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const next = [...newQ.options];
                        next[i] = e.target.value;
                        setNewQ((q) => ({ ...q, options: next }));
                      }}
                      style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)" }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>Correct Answer:</span>
                <select
                  value={newQ.answer}
                  onChange={(e) => setNewQ((q) => ({ ...q, answer: Number(e.target.value) }))}
                  style={{ padding: "8px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--surface)", color: "var(--text-primary)" }}
                >
                  <option value={0}>Option 1</option>
                  <option value={1}>Option 2</option>
                  <option value={2}>Option 3</option>
                  <option value={3}>Option 4</option>
                </select>
              </div>
              <textarea
                placeholder="Explanation for answer..."
                rows={2}
                value={newQ.explanation}
                onChange={(e) => setNewQ((q) => ({ ...q, explanation: e.target.value }))}
                style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)" }}
              />
              <button
                onClick={handleAddQuestion}
                style={{ background: "#14151A", color: "#fff", padding: "12px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif" }}
              >
                Publish Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

