import { useEffect, useState } from "react";
import { getRecommendedJobs } from "../services/resumeService";
import { getProfile } from "../services/profileService";
import { getErrorMessage } from "../services/api";

export default function AIMatch() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userSkills, setUserSkills] = useState([]);
    const [profile, setProfile] = useState(null);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        (async () => {
            try {
                // Fetch real skills + profile from API (NOT JWT decode)
                const profileRes = await getProfile();
                const prof = profileRes.data;
                setProfile(prof);
                const skills = prof.skills || [];
                setUserSkills(skills);

                const { data } = await getRecommendedJobs();
                const matched = data.jobs || [];
                setJobs(matched);
            } catch (e) {
                setError(getErrorMessage(e, "Failed to load jobs for matching"));
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const filtered = filter === "high" ? jobs.filter(j => j.matchScore >= 70)
        : filter === "mid" ? jobs.filter(j => j.matchScore >= 40 && j.matchScore < 70)
        : jobs;

    const topSkillGaps = (() => {
        const counts = {};
        jobs.forEach(j => (j.missingSkills || []).forEach(s => { counts[s] = (counts[s] || 0) + 1; }));
        return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
    })();

    return (
        <div>
            <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">AI-Powered</p>
                <h1 className="text-3xl font-black" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>AI Job Matching</h1>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Jobs ranked by compatibility with your extracted resume skills.</p>
            </div>

            {/* Skills Row */}
            <div className="glass-card p-6 mb-8">
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-secondary)" }}>Your Detected Skills</p>
                {userSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {userSkills.map(s => (
                            <span key={s} className="badge badge-blue">
                                {s}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                        No skills detected. <a href="/resume" className="text-blue-600 dark:text-blue-400 underline">Upload your resume</a> to enable AI matching.
                    </p>
                )}
            </div>

            {/* Skill Gap Analysis */}
            {topSkillGaps.length > 0 && (
                <div className="glass-card p-6 mb-8">
                    <h2 className="font-bold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                        📊 Skill Gap Analysis
                        <span className="text-xs font-normal ml-1" style={{ color: "var(--text-muted)" }}>— skills most requested in jobs you don't have</span>
                    </h2>
                    <div className="space-y-3">
                        {topSkillGaps.map(([skill, count]) => (
                            <div key={skill} className="flex items-center gap-3">
                                <span className="text-xs font-semibold w-28 capitalize truncate" style={{ color: "var(--text-secondary)" }}>{skill}</span>
                                <div className="flex-1 progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${Math.min(100, (count / (jobs.length || 1)) * 100)}%` }}
                                    />
                                </div>
                                <span className="text-xs w-12 text-right" style={{ color: "var(--text-muted)" }}>{count} jobs</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-6 px-4 py-3 rounded-xl text-sm badge-red border" style={{ borderColor: "#fecaca" }}>
                    {error}
                </div>
            )}

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-5">
                {[
                    { key: "all", label: "All Jobs" },
                    { key: "high", label: "🔥 High Match (70%+)" },
                    { key: "mid", label: "⭐ Mid Match (40-69%)" },
                ].map(opt => (
                    <button
                        key={opt.key}
                        id={`match-filter-${opt.key}`}
                        type="button"
                        onClick={() => setFilter(opt.key)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                            filter === opt.key
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--bg-hover)]"
                        }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* Jobs */}
            {loading ? (
                <div className="grid gap-6 lg:grid-cols-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="glass-card p-5 space-y-3">
                            <div className="skeleton h-5 rounded-lg w-3/4" />
                            <div className="skeleton h-4 rounded-lg w-1/2" />
                            <div className="skeleton h-6 rounded-full w-20 mt-2" />
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>
                    <div className="text-4xl mb-3">🎯</div>
                    <p className="font-semibold">No matching jobs in this category.</p>
                </div>
            ) : (
                <div className="grid gap-6 lg:grid-cols-2">
                    {filtered.slice(0, 20).map(job => {
                        const applyUrl = job.applyUrl || job.applyLink;
                        const scoreColor = job.matchScore >= 70 ? "var(--success)" : job.matchScore >= 40 ? "var(--warning)" : "var(--text-muted)";
                        const scoreBg = job.matchScore >= 70 ? "var(--success-light)" : job.matchScore >= 40 ? "var(--warning-light)" : "var(--bg-hover)";
                        const scoreBorder = job.matchScore >= 70 ? "rgba(22,197,94,0.2)" : job.matchScore >= 40 ? "rgba(245,158,11,0.2)" : "var(--border)";
                        return (
                            <div key={job._id || job.applyUrl} className="glass-card-hover p-6">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex items-start gap-3 min-w-0">
                                        <div
                                            className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                                            style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)" }}
                                        >
                                            {(job.company || "?").charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm truncate" style={{ color: "var(--text-primary)" }}>{job.title}</p>
                                            <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>{job.company} {job.location ? `· ${job.location}` : ""}</p>
                                        </div>
                                    </div>
                                    <div
                                        className="flex-shrink-0 text-center px-3 py-1 rounded-xl"
                                        style={{ background: scoreBg, border: `1px solid ${scoreBorder}` }}
                                    >
                                        <p className="text-lg font-black" style={{ color: scoreColor }}>{job.matchScore}%</p>
                                        <p className="text-[9px] font-semibold uppercase" style={{ color: "var(--text-muted)" }}>Match</p>
                                    </div>
                                </div>

                                {/* Matched Skills */}
                                {job.matchedSkills?.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                        {job.matchedSkills.map(s => (
                                            <span key={s} className="badge badge-green">
                                                ✓ {s}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Missing Skills */}
                                {job.missingSkills?.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        <span className="text-[10px] self-center" style={{ color: "var(--text-muted)" }}>Missing:</span>
                                        {job.missingSkills.map(s => (
                                            <span key={s} className="badge badge-red">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {applyUrl && (
                                    <a href={applyUrl} target="_blank" rel="noreferrer"
                                        className="btn btn-primary text-xs py-2 inline-flex items-center gap-1.5"
                                        style={{ textDecoration: "none" }}>
                                        Apply Now →
                                    </a>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
