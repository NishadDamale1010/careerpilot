import { useEffect, useState } from "react";
import { getErrorMessage } from "../services/api";
import { getApplications, updateApplicationStatus } from "../services/applicationService";

const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

const STATUS_CONFIG = {
    Applied:   { color: "#2563eb", bg: "var(--primary-light)", border: "rgba(59,130,246,0.2)",  icon: "📥" },
    Interview: { color: "#d97706", bg: "var(--warning-light)", border: "rgba(245,158,11,0.2)",  icon: "🎙️" },
    Offer:     { color: "#16a34a", bg: "var(--success-light)", border: "rgba(34,197,94,0.2)",  icon: "🎉" },
    Rejected:  { color: "#dc2626", bg: "var(--danger-light)",  border: "rgba(239,68,68,0.2)",   icon: "❌" },
};

function KanbanCard({ app, onStatusChange }) {
    const [updating, setUpdating] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.Applied;

    const handleStatus = async (newStatus) => {
        if (newStatus === app.status) return;
        setUpdating(true);
        setShowDropdown(false);
        try {
            await onStatusChange(app._id, newStatus);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="kanban-card p-5 mb-4 relative">
            <p className="font-semibold text-sm leading-snug mb-1" style={{ color: "var(--text-primary)" }}>
                {app.jobId?.title || "Tracked Application"}
            </p>
            <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>{app.jobId?.company || "Company unavailable"}</p>
            <div className="flex items-center justify-between gap-2">
                <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide"
                    style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                >
                    {cfg.icon} {app.status}
                </span>
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown((v) => !v)}
                        disabled={updating}
                        className="btn btn-ghost px-2 py-1 text-xs hover:bg-[var(--bg-hover)]"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        {updating ? "..." : "Change ↕"}
                    </button>
                    {showDropdown && (
                        <div
                            className="absolute right-0 bottom-8 z-20 min-w-[140px] rounded-xl overflow-hidden"
                            style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}
                        >
                            {STATUSES.filter((s) => s !== app.status).map((s) => {
                                const c = STATUS_CONFIG[s];
                                return (
                                    <button
                                        key={s}
                                        onClick={() => handleStatus(s)}
                                        className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-[var(--bg-hover)] transition-colors flex items-center gap-2"
                                        style={{ color: c.color, background: "transparent", border: "none", cursor: "pointer" }}
                                    >
                                        {c.icon} {s}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            {app.createdAt && (
                <p className="text-[10px] mt-2" style={{ color: "var(--text-muted)" }}>
                    {new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
            )}
        </div>
    );
}

export default function Applications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;
        (async () => {
            try {
                const { data } = await getApplications();
                if (!ignore) setApplications(data || []);
            } catch (e) {
                if (!ignore) setError(getErrorMessage(e, "Unable to load applications"));
            } finally {
                if (!ignore) setLoading(false);
            }
        })();
        return () => { ignore = true; };
    }, []);

    const handleStatusChange = async (appId, newStatus) => {
        try {
            await updateApplicationStatus(appId, newStatus);
            setApplications((prev) =>
                prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
            );
        } catch (e) {
            setError(getErrorMessage(e, "Failed to update status"));
        }
    };

    const grouped = STATUSES.reduce((acc, s) => {
        acc[s] = applications.filter((a) => a.status === s);
        return acc;
    }, {});

    const stats = STATUSES.map((s) => ({ status: s, count: grouped[s].length, cfg: STATUS_CONFIG[s] }));

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">Kanban Board</p>
                <h1 className="text-3xl font-black" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Applications</h1>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Track every role and where it stands.</p>
            </div>

            {error && (
                <div className="mb-6 px-4 py-3 rounded-xl text-sm badge-red border" style={{ borderColor: "#fecaca" }}>
                    {error}
                </div>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
                {stats.map(({ status, count, cfg }) => (
                    <div
                        key={status}
                        className="glass-card p-6 text-center"
                        style={{ borderColor: cfg.border }}
                    >
                        <p className="text-2xl font-black mb-1" style={{ color: cfg.color }}>
                            {loading ? "—" : count}
                        </p>
                        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
                            {cfg.icon} {status}
                        </p>
                    </div>
                ))}
            </div>

            {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {STATUSES.map((s) => (
                        <div key={s} className="kanban-column p-5">
                            <div className="skeleton h-5 w-24 rounded-lg mb-4" />
                            {[1, 2].map((i) => <div key={i} className="skeleton h-24 rounded-xl mb-3" />)}
                        </div>
                    ))}
                </div>
            ) : applications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="text-6xl mb-4">📁</div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>No applications yet</h3>
                    <p className="text-sm max-w-sm" style={{ color: "var(--text-secondary)" }}>Apply to jobs and track them here in a kanban board.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {STATUSES.map((status) => {
                        const cfg = STATUS_CONFIG[status];
                        const column = grouped[status];
                        return (
                            <div key={status} className="kanban-column p-5">
                                {/* Column header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <span>{cfg.icon}</span>
                                        <span className="text-sm font-bold" style={{ color: cfg.color }}>{status}</span>
                                    </div>
                                    <span
                                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                                        style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                                    >
                                        {column.length}
                                    </span>
                                </div>
                                {/* Cards */}
                                {column.length === 0 ? (
                                    <div
                                        className="text-center py-6 text-xs rounded-xl"
                                        style={{ border: "1px dashed var(--border)", color: "var(--text-muted)" }}
                                    >
                                        No {status.toLowerCase()} jobs
                                    </div>
                                ) : (
                                    column.map((app) => (
                                        <KanbanCard
                                            key={app._id}
                                            app={app}
                                            onStatusChange={handleStatusChange}
                                        />
                                    ))
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
