import { useState } from "react";
import { getErrorMessage } from "../services/api";
import { saveJob as saveJobRequest } from "../services/jobService";

const SOURCE_CLASS = {
    remoteok: "source-remoteok",
    wellfound: "source-wellfound",
    linkedin: "source-linkedin",
    jsearch: "source-jsearch",
    remotive: "source-remotive",
    themuse: "source-themuse",
    internshala: "source-internshala",
};

function getSourceClass(source) {
    if (!source) return "source-default";
    return SOURCE_CLASS[source.toLowerCase()] || "source-default";
}

export default function JobCard({ job, onUnsave }) {
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    const applyUrl = job.applyUrl || job.applyLink;
    const matchScore = job.matchScore;

    const handleSave = async () => {
        if (saved) return;
        setSaving(true);
        setError("");
        try {
            await saveJobRequest(job);
            setSaved(true);
        } catch (e) {
            setError(getErrorMessage(e, "Failed to save"));
        } finally {
            setSaving(false);
        }
    };

    return (
        <article className="glass-card-hover p-6 flex flex-col gap-5">
            <div className="flex gap-4 items-start">
                {/* Logo */}
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black text-white flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)" }}
                >
                    {(job.company || "?").charAt(0).toUpperCase()}
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-lg leading-snug truncate" style={{ color: "var(--text-primary)" }}>
                        {job.title || "Untitled role"}
                    </h2>
                    <p className="text-sm truncate" style={{ color: "var(--text-secondary)" }}>
                        {job.company || "Company unavailable"}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                        {job.location && <span className="flex items-center gap-1">📍 {job.location}</span>}
                        {job.salary && <span className="flex items-center gap-1">💰 {job.salary}</span>}
                        <span className="flex items-center gap-1">🕒 {job.postedAt || "Posted recently"}</span>
                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                        {/* Job Type Tag */}
                        {job.type && (
                            <div>
                                <span className={`badge ${job.type.toLowerCase().includes('intern') ? 'badge-amber' : 'badge-green'}`}>
                                    {job.type}
                                </span>
                            </div>
                        )}
                        {!job.type && job.title?.toLowerCase().includes('intern') && (
                            <div>
                                <span className="badge badge-amber">Internship</span>
                            </div>
                        )}

                        {/* Skills/Tags */}
                        {(job.missingSkills && job.missingSkills.length > 0) && (
                            <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] mr-1">Missing:</span>
                                {job.missingSkills.slice(0, 4).map((s) => (
                                    <span key={s} className="px-2 py-1 bg-[var(--danger-light)] text-[var(--danger)] border border-[rgba(239,68,68,0.2)] rounded-md text-[11px] font-semibold">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side Info */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0 pl-2">
                    {job.suspicious && (
                        <div
                            className="px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap border cursor-help"
                            style={{
                                background: "var(--danger-light)",
                                color: "var(--danger)",
                                borderColor: "rgba(239,68,68,0.2)",
                            }}
                            title={job.suspiciousReasons?.join(" | ")}
                        >
                            🚩 Suspicious
                        </div>
                    )}
                    {matchScore !== undefined && (
                        <div
                            className="px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap border"
                            style={{
                                background: matchScore >= 70 ? "var(--success-light)" : matchScore >= 40 ? "var(--warning-light)" : "var(--danger-light)",
                                color: matchScore >= 70 ? "var(--success)" : matchScore >= 40 ? "var(--warning)" : "var(--danger)",
                                borderColor: matchScore >= 70 ? "rgba(22,197,94,0.2)" : matchScore >= 40 ? "rgba(245,158,11,0.2)" : "rgba(239,68,68,0.2)",
                            }}
                        >
                            {matchScore}% Match
                        </div>
                    )}
                    {job.source && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getSourceClass(job.source)}`}>
                            {job.source}
                        </span>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-1 pt-4 border-t border-[var(--border)]">
                {applyUrl && (
                    <a
                        href={applyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary text-sm py-2 px-6"
                        style={{ textDecoration: "none" }}
                    >
                        Apply Now
                    </a>
                )}
                {onUnsave ? (
                    <button
                        type="button"
                        onClick={onUnsave}
                        className="btn btn-secondary flex items-center gap-1.5 py-2 px-4"
                        style={{ color: "var(--danger)", borderColor: "var(--danger-light)" }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                        Remove
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving || saved}
                        className={`btn py-2 px-4 ${
                            saved
                                ? "btn-secondary text-blue-600 border-blue-200 bg-blue-50/50 dark:text-blue-400 dark:border-blue-900/50 dark:bg-blue-950/20 cursor-default"
                                : "btn-secondary"
                        } flex items-center gap-1.5`}
                    >
                        <svg
                            width="14" height="14" viewBox="0 0 24 24"
                            fill={saved ? "currentColor" : "none"}
                            stroke="currentColor" strokeWidth="2"
                        >
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                        {saving ? "Saving..." : saved ? "Saved" : "Save"}
                    </button>
                )}
            </div>

            {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        </article>
    );
}
