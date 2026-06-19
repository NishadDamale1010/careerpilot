import { useState, useRef, useEffect } from "react";
import api from "../services/api";

const TABS = [
    { id: "career", label: "Career Advice", icon: "💼", prompt: "Give me career advice based on my skills and experience." },
    { id: "resume", label: "Resume Review", icon: "📄", prompt: "Review my resume and give detailed feedback to improve it." },
    { id: "ats", label: "ATS Tips", icon: "🤖", prompt: "Give me specific ATS optimization tips for my resume." },
    { id: "interview", label: "Interview Tips", icon: "🎙️", prompt: "What are the most important things to prepare for a technical interview?" },
    { id: "learning", label: "Learning Path", icon: "📚", prompt: "Based on my skills, what should I learn next to advance my career?" },
];

function getUserContext() {
    try {
        const token = localStorage.getItem("token");
        if (!token) return { name: "User", skills: [] };
        const p = JSON.parse(atob(token.split(".")[1]));
        return { name: p.name || "User", skills: p.skills || [] };
    } catch { return { name: "User", skills: [] }; }
}

export default function AICoach() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("career");
    const messagesEndRef = useRef(null);
    const ctx = getUserContext();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (text) => {
        if (!text.trim() || loading) return;
        const userMsg = { role: "user", content: text.trim() };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        const aiMsg = { role: "assistant", content: "" };
        setMessages(prev => [...prev, aiMsg]);

        try {
            const systemPrompt = `You are CareerPilot AI, an expert career coach. The user's name is ${ctx.name}. Their skills include: ${ctx.skills.join(", ") || "not specified yet"}. Give actionable, specific, and encouraging advice. Be concise but thorough. Use bullet points where helpful.`;

            const response = await api.post("/ai/coach", {
                message: text.trim(),
                systemPrompt,
                history: messages.slice(-6),
            });

            const reply = response.data?.reply || response.data?.message || "I'm sorry, I couldn't generate a response. Please try again.";
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: reply };
                return updated;
            });
        } catch (err) {
            const errMsg = err.response?.data?.message || "Failed to get response. Check your connection.";
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: `❌ ${errMsg}` };
                return updated;
            });
        } finally {
            setLoading(false);
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab.id);
        sendMessage(tab.prompt);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
    };

    return (
        <div className="flex flex-col h-full" style={{ height: "calc(100vh - 120px)" }}>
            <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">Groq LLaMA 3.3</p>
                <h1 className="text-3xl font-black" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>AI Career Coach</h1>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Your personal AI career advisor — ask anything about jobs, interviews, or your career path.</p>
            </div>

            {/* Quick Topic Tabs */}
            <div className="flex gap-2 mb-4 flex-wrap">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        id={`coach-tab-${tab.id}`}
                        type="button"
                        onClick={() => handleTabClick(tab)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                            activeTab === tab.id
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--bg-hover)]"
                        }`}
                    >
                        <span>{tab.icon}</span> {tab.label}
                    </button>
                ))}
            </div>

            {/* Chat Window */}
            <div
                className="flex-1 glass-card overflow-y-auto p-6 mb-5 flex flex-col gap-4"
                style={{ minHeight: 0 }}
            >
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center flex-1 text-center py-12">
                        <div className="text-6xl mb-4">🤖</div>
                        <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Hi, I'm your AI Career Coach!</h3>
                        <p className="text-sm max-w-md" style={{ color: "var(--text-secondary)" }}>
                            Ask me anything about your career, resume, interviews, or click a topic above to get started.
                        </p>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div className={msg.role === "user" ? "chat-bubble-user px-4 py-3 text-sm" : "chat-bubble-ai px-4 py-3 text-sm"}>
                            {msg.role === "assistant" && i === messages.length - 1 && loading && msg.content === "" ? (
                                <div className="flex items-center gap-1.5 py-1">
                                    <span className="chat-typing-dot" />
                                    <span className="chat-typing-dot" />
                                    <span className="chat-typing-dot" />
                                </div>
                            ) : (
                                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                    id="coach-message-input"
                    type="text"
                    className="input flex-1"
                    placeholder="Ask your career coach anything..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={loading}
                />
                <button
                    id="coach-send-btn"
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="btn btn-primary px-5 flex items-center gap-2"
                >
                    {loading ? (
                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    )}
                    Send
                </button>
            </form>
        </div>
    );
}
