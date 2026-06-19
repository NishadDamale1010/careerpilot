import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const nav = [
    { to: "/dashboard", label: "Dashboard", emoji: "grid" },
    { to: "/jobs", label: "Browse Jobs", emoji: "briefcase" },
    { to: "/ai-match", label: "AI Job Match", emoji: "star", badge: "AI" },
    { to: "/saved-jobs", label: "Saved Jobs", emoji: "bookmark" },
    { to: "/applications", label: "Applications", emoji: "file" },
    { to: "/resume", label: "Resume", emoji: "doc" },
];

const aiNav = [
    { to: "/ai-coach", label: "AI Career Coach", emoji: "chat", badge: "AI" },
    { to: "/interview-prep", label: "Interview Prep", emoji: "mic", badge: "AI" },
    { to: "/roadmaps", label: "Career Roadmaps", emoji: "map" },
    { to: "/learning", label: "Learning Hub", emoji: "book" },
];

const icons = {
    grid: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    briefcase: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
    star: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    bookmark: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
    file: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    doc: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.342a2 2 0 0 0-.602-1.43l-4.44-4.342A2 2 0 0 0 13.56 2H6a2 2 0 0 0-2 2z"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/></svg>,
    chat: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    mic: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>,
    map: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
    book: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    logout: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    settings: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
};

export default function Sidebar({ collapsed }) {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("User");
    const [userTitle, setUserTitle] = useState("");

    useEffect(() => {
        // Try JWT first for immediate render, then API for accurate data
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const p = JSON.parse(atob(token.split(".")[1]));
                setUserName(p.name || p.email?.split("@")[0] || "User");
            }
        } catch {}
        // Fetch accurate profile from API
        import("../services/profileService").then(({ getProfile }) => {
            getProfile().then(({ data }) => {
                if (data.name) setUserName(data.name);
                if (data.jobTitle) setUserTitle(data.jobTitle);
            }).catch(() => {});
        });
    }, []);

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
            isActive
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        } dark-nav-link`;

    const darkLinkClass = ({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 sidebar-link ${isActive ? "sidebar-link-active" : ""}`;

    return (
        <aside
            className="sticky top-0 h-screen flex flex-col z-30 shrink-0"
            style={{
                width: collapsed ? "60px" : "var(--sidebar-width, 232px)",
                background: "var(--bg-sidebar)",
                borderRight: "1px solid var(--border)",
                transition: "width 0.25s ease",
                overflow: "hidden",
            }}
        >
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-5 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                    style={{ background: "#2563eb" }}>
                    CP
                </div>
                {!collapsed && <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>CareerPilot</span>}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
                {!collapsed && (
                    <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                        Main
                    </p>
                )}
                {nav.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        title={collapsed ? item.label : undefined}
                        className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                    >
                        <span className="flex-shrink-0 opacity-80">{icons[item.emoji]}</span>
                        {!collapsed && <span className="truncate">{item.label}</span>}
                        {!collapsed && item.badge && (
                            <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white">
                                {item.badge}
                            </span>
                        )}
                    </NavLink>
                ))}

                <div className="pt-4 mt-3 border-t" style={{ borderTop: "1px solid var(--border)" }}>
                    {!collapsed && (
                        <p className="px-3 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                            AI Tools
                        </p>
                    )}
                    {aiNav.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            title={collapsed ? item.label : undefined}
                            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                        >
                            <span className="flex-shrink-0 opacity-80">{icons[item.emoji]}</span>
                            {!collapsed && <span className="truncate">{item.label}</span>}
                            {!collapsed && item.badge && (
                                <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white">
                                    {item.badge}
                                </span>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>

            {/* Footer */}
            <div className="px-4 py-4" style={{ borderTop: "1px solid var(--border)" }}>
                {!collapsed && (
                    <NavLink
                        to="/settings"
                        title="Profile & Settings"
                        className={({ isActive }) => `nav-link${isActive ? " active" : ""} mb-2`}
                    >
                        <span className="flex-shrink-0 opacity-80">{icons.settings}</span>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>{userName}</p>
                            {userTitle && <p className="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>{userTitle}</p>}
                        </div>
                    </NavLink>
                )}
                {collapsed && (
                    <NavLink
                        to="/settings"
                        title="Settings"
                        className={({ isActive }) => `nav-link justify-center${isActive ? " active" : ""} mb-2`}
                    >
                        <span className="flex-shrink-0 opacity-80">{icons.settings}</span>
                    </NavLink>
                )}
                <button
                    type="button"
                    onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}
                    title={collapsed ? "Sign Out" : undefined}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
                    style={{ color: "#dc2626", background: "transparent", border: "none", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--danger-light)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                    <span className="flex-shrink-0">{icons.logout}</span>
                    {!collapsed && <span>Sign Out</span>}
                </button>
            </div>
        </aside>
    );
}
