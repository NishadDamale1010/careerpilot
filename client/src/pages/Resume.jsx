import { useState, useRef, useCallback } from "react";
import { getErrorMessage } from "../services/api";
import { uploadResume, getRecommendedJobs } from "../services/resumeService";
import { saveJob } from "../services/jobService";

// ─────────────────────────────────────────────────────────────────────────────
// Score ring SVG component
// ─────────────────────────────────────────────────────────────────────────────
function ScoreRing({ score }) {
    const r = 44;
    const circ = 2 * Math.PI * r;
    const offset = circ - (score / 100) * circ;
    const color =
        score >= 70
            ? "var(--success, #16a34a)"
            : score >= 40
            ? "var(--warning, #d97706)"
            : "var(--danger, #dc2626)";

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative w-24 h-24">
                <svg width="96" height="96" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
                    <circle
                        cx="48" cy="48" r={r}
                        fill="none" stroke={color} strokeWidth="8"
                        strokeDasharray={circ}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        transform="rotate(-90 48 48)"
                        style={{ transition: "stroke-dashoffset 1.2s ease" }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black" style={{ color: "var(--text-primary)" }}>{score}%</span>
                </div>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>ATS Score</p>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton card for loading state
// ─────────────────────────────────────────────────────────────────────────────
function JobSkeleton() {
    return (
        <div className="glass-card p-5 space-y-3 animate-pulse">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-300/20 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 rounded bg-slate-300/20 w-3/4" />
                    <div className="h-3 rounded bg-slate-300/20 w-1/2" />
                </div>
            </div>
            <div className="flex gap-2">
                <div className="h-5 w-16 rounded-full bg-slate-300/20" />
                <div className="h-5 w-20 rounded-full bg-slate-300/20" />
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Real job card with matched skill tags + Apply/Save buttons
// ─────────────────────────────────────────────────────────────────────────────
function RecommendedJobCard({ job, onSave }) {
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleSave = async (e) => {
        e.stopPropagation();
        if (saved || saving) return;
        setSaving(true);
        try {
            await saveJob(job);
            setSaved(true);
        } catch {
            // silently fail — user can try again
        } finally {
            setSaving(false);
        }
    };

    const initial = (job.company || job.title || "?").charAt(0).toUpperCase();
    const matchedSkills = job.matchedSkills || [];
    const displaySkills = matchedSkills.slice(0, 5);

    return (
        <div
            className="glass-card p-5 flex flex-col gap-3 hover:shadow-lg transition-all duration-200"
            style={{ border: "1px solid var(--border)" }}
        >
            {/* Header */}
            <div className="flex items-start gap-3">
                <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{
                        background: job.companyLogo
                            ? "transparent"
                            : "linear-gradient(135deg, #2563eb, #7c3aed)",
                    }}
                >
                    {job.companyLogo ? (
                        <img
                            src={job.companyLogo}
                            alt={job.company}
                            className="w-full h-full object-contain rounded-xl"
                            onError={(e) => {
                                e.target.style.display = "none";
                                e.target.parentNode.textContent = initial;
                            }}
                        />
                    ) : (
                        initial
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-snug truncate" style={{ color: "var(--text-primary)" }}>
                        {job.title || "Software Engineer"}
                    </p>
                    <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-secondary)" }}>
                        {job.company || "Company"}
                    </p>
                </div>

                {/* Source badge */}
                {job.source && (
                    <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{
                            background: "rgba(37,99,235,0.1)",
                            color: "#2563eb",
                            border: "1px solid rgba(37,99,235,0.2)",
                        }}
                    >
                        {job.source}
                    </span>
                )}
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                {job.location && (
                    <span className="flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        {job.location}
                    </span>
                )}
                {(job.type || job.employmentType) && (
                    <span className="flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect x="2" y="7" width="20" height="14" rx="2" />
                            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                        </svg>
                        {job.type || job.employmentType}
                    </span>
                )}
                {job.salary && (
                    <span className="flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="1" x2="12" y2="23" />
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        {job.salary}
                    </span>
                )}
                {job.isRemote && (
                    <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                        style={{ background: "rgba(22,163,74,0.12)", color: "#16a34a" }}
                    >
                        🌍 Remote
                    </span>
                )}
            </div>

            {/* Matched skills */}
            {displaySkills.length > 0 && (
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>
                        Matches your skills
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {displaySkills.map((skill) => (
                            <span
                                key={skill}
                                className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                                style={{
                                    background: "rgba(124,58,237,0.12)",
                                    color: "#7c3aed",
                                    border: "1px solid rgba(124,58,237,0.2)",
                                }}
                            >
                                ✓ {skill}
                            </span>
                        ))}
                        {matchedSkills.length > 5 && (
                            <span
                                className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                                style={{ background: "var(--bg-hover)", color: "var(--text-muted)" }}
                            >
                                +{matchedSkills.length - 5} more
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-1">
                {job.applyUrl ? (
                    <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary flex-1 text-xs py-2 text-center"
                        style={{ textDecoration: "none" }}
                    >
                        Apply Now →
                    </a>
                ) : (
                    <span className="flex-1 text-xs py-2 text-center opacity-50" style={{ color: "var(--text-muted)" }}>
                        No apply link
                    </span>
                )}
                <button
                    onClick={handleSave}
                    disabled={saved || saving}
                    className="btn btn-secondary text-xs py-2 px-3 flex-shrink-0 disabled:opacity-60"
                    title={saved ? "Saved!" : "Save job"}
                >
                    {saving ? (
                        <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin inline-block" />
                    ) : saved ? (
                        "✓ Saved"
                    ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Resume page
// ─────────────────────────────────────────────────────────────────────────────
export default function Resume() {
    const [file, setFile] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [skills, setSkills] = useState([]);
    const [matchScore, setMatchScore] = useState(null);
    const [wordCount, setWordCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Recommended jobs state
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [detectedRole, setDetectedRole] = useState("");
    const [jobsLoading, setJobsLoading] = useState(false);
    const [jobsError, setJobsError] = useState("");
    const [jobsFetched, setJobsFetched] = useState(false);

    const inputRef = useRef();

    const handleFile = (f) => {
        if (!f || f.type !== "application/pdf") {
            setError("Please select a PDF file.");
            return;
        }
        setFile(f);
        setError("");
        setMessage("");
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files?.[0]);
    };

    const fetchRecommendedJobs = useCallback(async () => {
        setJobsLoading(true);
        setJobsError("");
        try {
            const { data } = await getRecommendedJobs();
            setRecommendedJobs(data.jobs || []);
            setDetectedRole(data.detectedRole || "");
        } catch (err) {
            setJobsError(getErrorMessage(err, "Could not load job recommendations."));
        } finally {
            setJobsLoading(false);
            setJobsFetched(true);
        }
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) { setError("Please select a PDF resume."); return; }
        setLoading(true);
        setError("");
        setMessage("");
        setRecommendedJobs([]);
        setJobsFetched(false);

        const form = new FormData();
        form.append("resume", file);
        try {
            const { data } = await uploadResume(form);
            setSkills(data.skills || []);
            setMatchScore(data.matchScore ?? 0);
            setWordCount(data.wordCount || 0);
            setMessage(data.message || "Resume uploaded successfully!");
            // Auto-fetch recommended jobs after successful upload
            await fetchRecommendedJobs();
        } catch (err) {
            setError(getErrorMessage(err, "Resume upload failed"));
        } finally {
            setLoading(false);
        }
    };

    const atsTips = [
        "Use standard section headers: Experience, Education, Skills",
        "Avoid graphics, tables, or text-in-images in your PDF",
        "Include keywords from job descriptions you're targeting",
        "Use bullet points with measurable accomplishments",
        "Keep to 1–2 pages; prioritise recent experience",
    ];

    return (
        <div>
            {/* ── Page header ───────────────────────────────────────────────── */}
            <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">AI-Powered</p>
                <h1 className="text-3xl font-black" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                    Resume Center
                </h1>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                    Upload your PDF resume — we'll extract your skills with AI and instantly match you to real, live jobs.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* ── Left: Upload + Skills ────────────────────────────────── */}
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleUpload}>
                        {/* Drop zone */}
                        <div
                            className={`drop-zone p-10 text-center cursor-pointer transition-all ${dragOver ? "drag-over" : ""}`}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => inputRef.current?.click()}
                            style={{ borderRadius: "1rem" }}
                        >
                            <input
                                ref={inputRef}
                                type="file"
                                accept="application/pdf,.pdf"
                                className="hidden"
                                onChange={(e) => handleFile(e.target.files?.[0])}
                                id="resume-file-input"
                            />
                            <div className="text-5xl mb-4">{file ? "📄" : "📤"}</div>
                            {file ? (
                                <>
                                    <p className="font-bold mb-1" style={{ color: "var(--text-primary)" }}>{file.name}</p>
                                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                                        {(file.size / 1024).toFixed(1)} KB · PDF
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                                        Drag &amp; drop your resume here
                                    </p>
                                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                                        or click to browse · PDF only · max 5 MB
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Error / success */}
                        {error && (
                            <div className="mt-4 px-4 py-3 rounded-xl text-sm badge-red border" style={{ borderColor: "#fecaca" }}>
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="mt-4 px-4 py-3 rounded-xl text-sm badge-green border" style={{ borderColor: "#bbf7d0" }}>
                                ✅ {message}
                            </div>
                        )}

                        <button
                            id="resume-upload-btn"
                            type="submit"
                            disabled={loading || !file}
                            className="btn btn-primary w-full mt-5 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    Analysing your resume with AI…
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                    Upload &amp; Analyse Resume
                                </>
                            )}
                        </button>
                    </form>

                    {/* Extracted skills */}
                    {skills.length > 0 && (
                        <div className="glass-card p-6">
                            <h2 className="font-bold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                                <span>🎯</span>
                                Skills Extracted by AI
                                <span className="ml-auto text-xs font-semibold text-blue-500">{skills.length} found</span>
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="badge badge-blue animate-scale-in"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Right: Score + ATS tips ──────────────────────────────── */}
                <div className="space-y-6">
                    {matchScore !== null && (
                        <div className="glass-card p-6 flex flex-col items-center">
                            <ScoreRing score={matchScore} />
                            <div className="mt-4 w-full space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span style={{ color: "var(--text-secondary)" }}>Words scanned</span>
                                    <span className="font-bold" style={{ color: "var(--text-primary)" }}>{wordCount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span style={{ color: "var(--text-secondary)" }}>Skills detected</span>
                                    <span className="font-bold" style={{ color: "var(--text-primary)" }}>{skills.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span style={{ color: "var(--text-secondary)" }}>ATS Readiness</span>
                                    <span
                                        className="font-bold"
                                        style={{
                                            color:
                                                matchScore >= 70
                                                    ? "#16a34a"
                                                    : matchScore >= 40
                                                    ? "#d97706"
                                                    : "#dc2626",
                                        }}
                                    >
                                        {matchScore >= 70 ? "Strong" : matchScore >= 40 ? "Fair" : "Needs Work"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="glass-card p-6">
                        <h2 className="font-bold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                            <span>💡</span> ATS Tips
                        </h2>
                        <ul className="space-y-3" style={{ listStyle: "none", padding: 0 }}>
                            {atsTips.map((tip, i) => (
                                <li key={i} className="flex gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                                    <span
                                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                                        style={{ background: "rgba(37,99,235,0.1)", color: "#2563eb" }}
                                    >
                                        {i + 1}
                                    </span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* ── Recommended Jobs section ─────────────────────────────────────── */}
            {(jobsLoading || jobsFetched) && (
                <section className="mt-10" id="recommended-jobs">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-purple-500 mb-1">
                                Personalised for you
                            </p>
                            <h2
                                className="text-2xl font-black"
                                style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
                            >
                                🚀 Matched Jobs{detectedRole ? ` — ${detectedRole}` : ""}
                            </h2>
                            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                                Real, live listings sourced for your role · Updated every 30 min
                            </p>
                        </div>
                        <button
                            id="refresh-recommended-jobs"
                            onClick={fetchRecommendedJobs}
                            disabled={jobsLoading}
                            className="btn btn-secondary flex items-center gap-2 text-sm disabled:opacity-50"
                        >
                            <svg
                                width="14" height="14" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2.5"
                                className={jobsLoading ? "animate-spin" : ""}
                            >
                                <polyline points="23 4 23 10 17 10" />
                                <polyline points="1 20 1 14 7 14" />
                                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                            </svg>
                            Refresh
                        </button>
                    </div>

                    {jobsError && (
                        <div
                            className="mb-5 px-4 py-3 rounded-xl text-sm badge-red border"
                            style={{ borderColor: "#fecaca" }}
                        >
                            {jobsError}
                        </div>
                    )}

                    {jobsLoading ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <JobSkeleton key={i} />
                            ))}
                        </div>
                    ) : recommendedJobs.length === 0 ? (
                        <div
                            className="glass-card p-10 text-center"
                            style={{ color: "var(--text-muted)" }}
                        >
                            <div className="text-4xl mb-3">🔍</div>
                            <p className="font-semibold">No matched jobs found right now.</p>
                            <p className="text-sm mt-1">
                                Try refreshing — our job cache updates every 30 minutes.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {recommendedJobs.map((job, idx) => (
                                <RecommendedJobCard
                                    key={job._id || job.applyUrl || idx}
                                    job={job}
                                />
                            ))}
                        </div>
                    )}

                    <p className="text-xs text-center mt-4" style={{ color: "var(--text-muted)" }}>
                        Jobs sourced from JSearch (RapidAPI) and our aggregated cache. Listings are real and updated regularly.
                    </p>
                </section>
            )}
        </div>
    );
}
