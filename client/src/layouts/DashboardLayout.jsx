import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../context/ThemeContext";

const pageTitles = {
    "/dashboard": "Dashboard",
    "/jobs": "Browse Jobs",
    "/ai-match": "AI Job Match",
    "/saved-jobs": "Saved Jobs",
    "/applications": "Applications",
    "/resume": "Resume",
    "/ai-coach": "AI Career Coach",
    "/interview-prep": "Interview Prep",
    "/roadmaps": "Career Roadmaps",
    "/learning": "Learning Hub",
    "/settings": "Settings",
};

export default function DashboardLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { dark, toggle } = useTheme();
    const pageTitle = pageTitles[location.pathname] || "CareerPilot";
    const [cmdOpen, setCmdOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setCmdOpen((prev) => !prev);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const executeCommand = (path) => {
        setCmdOpen(false);
        navigate(path);
    };

    return (
        <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>
            <Sidebar collapsed={collapsed} />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header
                    className="sticky top-0 z-20 flex items-center gap-4 px-6 py-4"
                    style={{
                        background: "var(--bg-card)",
                        borderBottom: "1px solid var(--border)",
                    }}
                >
                    {/* Hamburger */}
                    <button
                        type="button"
                        onClick={() => setCollapsed((c) => !c)}
                        className="btn btn-ghost p-1.5 rounded-md"
                        aria-label="Toggle sidebar"
                    >
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <line x1="3" y1="12" x2="21" y2="12"/>
                            <line x1="3" y1="18" x2="21" y2="18"/>
                        </svg>
                    </button>

                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                        {pageTitle}
                    </span>

                    <div className="ml-auto flex items-center gap-2">
                        {/* Command Palette Trigger */}
                        <button
                            type="button"
                            onClick={() => setCmdOpen(true)}
                            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium mr-2"
                            style={{ borderColor: "var(--border)", color: "var(--text-secondary)", background: "var(--bg-hover)" }}
                        >
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                            </svg>
                            Search...
                            <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-[var(--bg-card)] border border-[var(--border)]">Ctrl+K</span>
                        </button>

                        {/* Dark mode toggle */}
                        <button
                            type="button"
                            onClick={toggle}
                            title={dark ? "Switch to light mode" : "Switch to dark mode"}
                            className="btn btn-ghost p-1.5 rounded-md"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            {dark ? (
                                /* Sun icon */
                                <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="5"/>
                                    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                                    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                                </svg>
                            ) : (
                                /* Moon icon */
                                <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                                </svg>
                            )}
                        </button>

                        {/* Notification Bell */}
                        <button
                            type="button"
                            className="btn btn-ghost p-1.5 rounded-md relative"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 border-2 border-[var(--bg-card)]"></span>
                        </button>

                        {/* Avatar — click to go to Settings */}
                        <button
                            onClick={() => navigate("/settings")}
                            title="Profile & Settings"
                            className="w-8 h-8 rounded-full ml-1 overflow-hidden border-2 hover:ring-2 hover:ring-blue-500 transition-all"
                            style={{ borderColor: "var(--border)" }}
                        >
                            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Nishad&backgroundColor=b6e3f4" alt="Avatar" className="w-full h-full object-cover" />
                        </button>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-8 lg:p-8 animate-fade-in">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>

            {/* Command Palette Modal */}
            {cmdOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 bg-black/40 backdrop-blur-sm" onClick={() => setCmdOpen(false)}>
                    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
                        <div className="p-3 border-b border-[var(--border)] flex items-center gap-3">
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="ml-2 text-[var(--text-muted)]" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                            </svg>
                            <input autoFocus type="text" placeholder="Type a command or search..." className="w-full bg-transparent border-none outline-none text-[var(--text-primary)] text-sm" />
                            <span className="text-[10px] font-semibold bg-[var(--bg-hover)] text-[var(--text-muted)] px-2 py-1 rounded">ESC</span>
                        </div>
                        <div className="p-2 py-3 max-h-[60vh] overflow-y-auto">
                            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">Pages</p>
                            {Object.entries(pageTitles).map(([path, title]) => (
                                <button
                                    key={path}
                                    onClick={() => executeCommand(path)}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-left"
                                >
                                    <span className="truncate">{title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
