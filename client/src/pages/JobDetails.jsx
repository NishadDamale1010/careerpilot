import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getAggregatedJobById, saveJob } from "../services/jobService";
import { getErrorMessage } from "../services/api";
import toast from "react-hot-toast";

export default function JobDetails() {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        let ignore = false;
        const loadJob = async () => {
            try {
                setLoading(true);
                const { data } = await getAggregatedJobById(id);
                if (!ignore && data.job) {
                    setJob(data.job);
                }
            } catch (err) {
                if (!ignore) setError(getErrorMessage(err, "Job not found"));
            } finally {
                if (!ignore) setLoading(false);
            }
        };
        loadJob();
        return () => { ignore = true; };
    }, [id]);

    const handleSave = async () => {
        if (saved || !job) return;
        setSaving(true);
        try {
            await saveJob(job);
            setSaved(true);
            toast.success("Job saved successfully!");
        } catch (e) {
            toast.error(getErrorMessage(e, "Failed to save job"));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-6 animate-pulse p-6">
                <div className="h-48 bg-slate-200 dark:bg-neutral-800 rounded-xl" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="h-8 bg-slate-200 dark:bg-neutral-800 rounded w-3/4" />
                        <div className="h-4 bg-slate-200 dark:bg-neutral-800 rounded w-1/2" />
                        <div className="h-32 bg-slate-200 dark:bg-neutral-800 rounded" />
                    </div>
                    <div className="h-64 bg-slate-200 dark:bg-neutral-800 rounded-xl" />
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="p-12 text-center">
                <h2 className="text-3xl mb-4">🔍</h2>
                <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{error || "Job not found"}</h3>
                <Link to="/jobs" className="btn btn-primary mt-6 inline-block">Back to Jobs</Link>
            </div>
        );
    }

    const applyUrl = job.applyUrl || job.applyLink;

    // Decode HTML entities if description is HTML
    const decodeHtml = (html) => {
        if (!html) return "No description provided.";
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pb-12"
        >
            {/* Header Banner */}
            <div 
                className="relative rounded-2xl overflow-hidden mb-8 p-8"
                style={{
                    background: "linear-gradient(135deg, rgba(37,99,235,0.1), rgba(79,70,229,0.05))",
                    border: "1px solid var(--border)",
                }}
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div 
                        className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white flex-shrink-0 shadow-lg"
                        style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)" }}
                    >
                        {(job.company || "?").charAt(0).toUpperCase()}
                    </div>
                    
                    <div>
                        <h1 className="text-3xl font-extrabold mb-2" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                            {job.title || "Untitled Role"}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                            <span className="flex items-center gap-1.5">
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                                {job.company || "Company Unavailable"}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                {job.location || "Remote"}
                            </span>
                            {job.salary && (
                                <span className="flex items-center gap-1.5">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                    {job.salary}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Description */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="glass-card p-8">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                            Job Description
                        </h2>
                        
                        {/* We use a prose-like styling for raw text to make it readable */}
                        <div 
                            className="text-sm leading-relaxed whitespace-pre-wrap font-medium" 
                            style={{ color: "var(--text-secondary)" }}
                            dangerouslySetInnerHTML={{ __html: job.description ? decodeHtml(job.description) : "No description provided." }}
                        />
                    </section>
                </div>

                {/* Right Column: Sticky Sidebar */}
                <div className="space-y-6">
                    <div className="sticky top-6 glass-card p-6 border border-[var(--border)]">
                        <h3 className="font-bold text-lg mb-4" style={{ color: "var(--text-primary)" }}>Action</h3>
                        
                        <div className="flex flex-col gap-3">
                            {applyUrl ? (
                                <a
                                    href={applyUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-primary w-full py-3 flex items-center justify-center gap-2"
                                    style={{ textDecoration: "none" }}
                                >
                                    Apply Now
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                </a>
                            ) : (
                                <div className="p-3 text-center rounded-lg bg-slate-100 dark:bg-neutral-800 text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
                                    No application link available
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving || saved}
                                className={`btn w-full py-3 flex items-center justify-center gap-2 ${
                                    saved 
                                        ? "btn-secondary text-blue-600 border-blue-200 bg-blue-50 dark:text-blue-400 dark:border-blue-900/50 dark:bg-blue-900/20" 
                                        : "btn-secondary"
                                }`}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                                </svg>
                                {saving ? "Saving..." : saved ? "Saved" : "Save for Later"}
                            </button>
                        </div>

                        <hr className="my-6 border-[var(--border)]" />

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>Source</p>
                                <span className={`badge uppercase ${job.source ? `source-${job.source.toLowerCase()}` : ""}`}>
                                    {job.source || "Unknown"}
                                </span>
                            </div>

                            {job.trustScore !== undefined && (
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>AI Trust Score</p>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 flex-1 bg-[var(--bg)] rounded-full overflow-hidden">
                                            <div 
                                                className="h-full rounded-full transition-all duration-1000"
                                                style={{ 
                                                    width: `${job.trustScore}%`,
                                                    background: job.trustScore >= 80 ? "var(--success)" : job.trustScore >= 50 ? "var(--warning)" : "var(--danger)"
                                                }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{job.trustScore}%</span>
                                    </div>
                                    {job.suspiciousReasons?.length > 0 && (
                                        <p className="text-xs mt-2 text-red-500 font-medium">
                                            ⚠️ {job.suspiciousReasons[0]}
                                        </p>
                                    )}
                                </div>
                            )}

                            {job.postedAt && (
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>Posted</p>
                                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                                        {new Date(job.postedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
