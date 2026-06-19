import { useState } from "react";
import api from "../services/api";

const ROLES = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist", "DevOps Engineer", "AI Engineer", "Product Manager", "UX Designer"];
const TYPES = [
    { id: "technical", label: "Technical", icon: "💻" },
    { id: "hr", label: "HR & Behavioral", icon: "🤝" },
    { id: "both", label: "Both", icon: "⚡" },
];

export default function InterviewPrep() {
    const [role, setRole] = useState("");
    const [customRole, setCustomRole] = useState("");
    const [questionType, setQuestionType] = useState("both");
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [mockMode, setMockMode] = useState(false);
    const [currentQ, setCurrentQ] = useState(0);
    const [revealed, setRevealed] = useState(false);
    const [userAnswer, setUserAnswer] = useState("");

    const handleGenerate = async () => {
        const finalRole = customRole.trim() || role;
        if (!finalRole) { setError("Please select or enter a role."); return; }
        setLoading(true);
        setError("");
        setQuestions([]);
        setMockMode(false);

        try {
            const { data } = await api.post("/ai/interview-questions", {
                role: finalRole,
                type: questionType,
            });
            setQuestions(data.questions || []);
        } catch (e) {
            setError(e.response?.data?.message || "Failed to generate questions. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const startMock = () => {
        setMockMode(true);
        setCurrentQ(0);
        setRevealed(false);
        setUserAnswer("");
    };

    const nextQuestion = () => {
        if (currentQ < questions.length - 1) {
            setCurrentQ(c => c + 1);
            setRevealed(false);
            setUserAnswer("");
        } else {
            setMockMode(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">AI-Powered</p>
                <h1 className="text-3xl font-black" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Interview Preparation</h1>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Generate AI-crafted interview questions for any role and practice with mock mode.</p>
            </div>

            {/* Config Panel */}
            {!mockMode && (
                <div className="glass-card p-6 mb-6">
                    <div className="grid sm:grid-cols-2 gap-5 mb-5">
                        {/* Role Selection */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-secondary)" }}>Select Role</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {ROLES.map(r => (
                                    <button
                                        key={r}
                                        id={`role-${r.replace(/\s+/g, "-").toLowerCase()}`}
                                        type="button"
                                        onClick={() => { setRole(r); setCustomRole(""); }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                                            role === r && !customRole
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--bg-hover)]"
                                        }`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                            <input
                                id="custom-role-input"
                                type="text"
                                className="input text-sm"
                                placeholder="Or type a custom role..."
                                value={customRole}
                                onChange={e => { setCustomRole(e.target.value); setRole(""); }}
                            />
                        </div>

                        {/* Question Type */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-secondary)" }}>Question Type</p>
                            <div className="flex flex-col gap-2">
                                {TYPES.map(t => (
                                    <button
                                        key={t.id}
                                        id={`qtype-${t.id}`}
                                        type="button"
                                        onClick={() => setQuestionType(t.id)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left border ${
                                            questionType === t.id
                                                ? "bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-500/40"
                                                : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--bg-hover)]"
                                        }`}
                                    >
                                        <span className="text-base">{t.icon}</span>
                                        {t.label}
                                        {questionType === t.id && (
                                            <span className="ml-auto w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                                                <span className="w-2 h-2 rounded-full bg-white" />
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-sm text-rose-600 mb-4">❌ {error}</p>}

                    <button
                        id="generate-questions-btn"
                        onClick={handleGenerate}
                        disabled={loading}
                        className="btn btn-primary text-sm px-6 py-3 flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                Generating questions...
                            </>
                        ) : (
                            <>✨ Generate Interview Questions</>
                        )}
                    </button>
                </div>
            )}

            {/* Questions List */}
            {!mockMode && questions.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                            <span>📋</span> {questions.length} Questions Generated
                        </h2>
                        <button
                            id="start-mock-btn"
                            onClick={startMock}
                            className="btn btn-primary text-xs px-4 py-2 flex items-center gap-2"
                        >
                            🎯 Start Mock Interview
                        </button>
                    </div>
                    <div className="space-y-3">
                        {questions.map((q, i) => (
                            <div
                                key={i}
                                className="glass-card p-6 animate-fade-in"
                                style={{ animationDelay: `${i * 0.04}s` }}
                            >
                                <div className="flex items-start gap-3">
                                    <span
                                        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                                        style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)" }}
                                    >
                                        {i + 1}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{q.question}</p>
                                        {q.type && (
                                            <span className={`badge ${q.type === "technical" ? "badge-blue" : "badge-green"}`}>
                                                {q.type === "technical" ? "💻 Technical" : "🤝 HR"}
                                            </span>
                                        )}
                                        {q.hint && (
                                            <p className="text-xs mt-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>💡 {q.hint}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Mock Mode */}
            {mockMode && questions.length > 0 && (
                <div className="glass-card p-8 text-center">
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={() => setMockMode(false)} className="btn btn-ghost text-xs hover:bg-[var(--bg-hover)]" style={{ color: "var(--text-secondary)" }}>
                            ← Exit Mock Mode
                        </button>
                        <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                            Question {currentQ + 1} of {questions.length}
                        </span>
                    </div>

                    {/* Progress bar */}
                    <div className="progress-bar mb-8">
                        <div className="progress-fill" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
                    </div>

                    <div
                        className="mb-6 p-6 rounded-2xl text-left"
                        style={{ background: "var(--bg-hover)", border: "1px solid var(--border)" }}
                    >
                        <p className="text-lg font-bold leading-relaxed" style={{ color: "var(--text-primary)" }}>
                            {questions[currentQ]?.question}
                        </p>
                    </div>

                    {!revealed ? (
                        <div className="space-y-4">
                            <textarea
                                className="input text-sm resize-none w-full"
                                rows={4}
                                placeholder="Type your answer here before revealing the hint..."
                                value={userAnswer}
                                onChange={e => setUserAnswer(e.target.value)}
                            />
                            <button
                                id="reveal-answer-btn"
                                onClick={() => setRevealed(true)}
                                className="btn btn-secondary text-sm px-6 py-2.5 w-full"
                            >
                                💡 Reveal Hint & Tip
                            </button>
                        </div>
                    ) : (
                        <div>
                            {questions[currentQ]?.hint && (
                                <div className="mb-4 p-4 rounded-xl text-left text-sm badge-green border"
                                    style={{ borderColor: "#bbf7d0" }}>
                                    💡 <strong>Hint:</strong> {questions[currentQ].hint}
                                </div>
                            )}
                            <button
                                id="next-question-btn"
                                onClick={nextQuestion}
                                className="btn btn-primary text-sm px-8 py-3 w-full"
                            >
                                {currentQ < questions.length - 1 ? "Next Question →" : "🎉 Finish Interview"}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
