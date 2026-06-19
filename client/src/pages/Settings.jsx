import { useState, useEffect, useCallback } from "react";
import { getProfile, updateProfile } from "../services/profileService";
import { getErrorMessage } from "../services/api";
import { Link } from "react-router-dom";

const EXPERIENCE_LEVELS = ["Student", "Entry Level", "Mid Level", "Senior Level", "Lead / Manager"];
const JOB_TYPES = ["Any", "Full-time", "Part-time", "Internship", "Remote", "Contract"];
const TABS = [
    { id: "profile", label: "👤 Profile", icon: "user" },
    { id: "preferences", label: "🎯 Job Preferences", icon: "target" },
    { id: "skills", label: "⚡ Skills", icon: "skills" },
    { id: "links", label: "🔗 Social Links", icon: "links" },
];

// ── Input component ───────────────────────────────────────────────────────────
const Field = ({ label, hint, children }) => (
    <div className="space-y-1.5">
        <label className="block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {label}
        </label>
        {hint && <p className="text-xs" style={{ color: "var(--text-muted)" }}>{hint}</p>}
        {children}
    </div>
);

const Input = ({ value, onChange, placeholder, type = "text", prefix }) => (
    <div className="relative flex items-center">
        {prefix && (
            <span
                className="absolute left-3 text-xs font-medium pointer-events-none"
                style={{ color: "var(--text-muted)" }}
            >
                {prefix}
            </span>
        )}
        <input
            type={type}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="input"
            style={prefix ? { paddingLeft: "2.5rem" } : {}}
        />
    </div>
);

const Textarea = ({ value, onChange, placeholder, rows = 3 }) => (
    <textarea
        rows={rows}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input"
        style={{ resize: "vertical", minHeight: "80px" }}
    />
);

const Select = ({ value, onChange, options }) => (
    <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="input"
    >
        {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
        ))}
    </select>
);

// ── Skill chip editor ─────────────────────────────────────────────────────────
function SkillsEditor({ skills, onChange }) {
    const [input, setInput] = useState("");

    const addSkill = () => {
        const trimmed = input.trim();
        if (trimmed && !skills.includes(trimmed)) {
            onChange([...skills, trimmed]);
        }
        setInput("");
    };

    const removeSkill = (s) => onChange(skills.filter((x) => x !== s));

    const handleKey = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addSkill();
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Type a skill and press Enter…"
                    className="input flex-1"
                />
                <button
                    type="button"
                    onClick={addSkill}
                    disabled={!input.trim()}
                    className="btn btn-secondary px-4 disabled:opacity-40"
                >
                    Add
                </button>
            </div>
            {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {skills.map((s) => (
                        <span
                            key={s}
                            className="badge badge-blue flex items-center gap-1.5 pr-1"
                        >
                            {s}
                            <button
                                type="button"
                                onClick={() => removeSkill(s)}
                                className="ml-1 hover:text-red-500 transition-colors leading-none"
                                aria-label={`Remove ${s}`}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {skills.length} skill{skills.length !== 1 ? "s" : ""} added · These are also extracted automatically when you upload your resume
            </p>
        </div>
    );
}

// ── Toggle component ──────────────────────────────────────────────────────────
const Toggle = ({ value, onChange, label }) => (
    <label className="flex items-center gap-3 cursor-pointer select-none">
        <div className="relative">
            <input type="checkbox" className="sr-only" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
            <div
                className="w-10 h-5 rounded-full transition-colors duration-200"
                style={{ background: value ? "var(--primary)" : "var(--border)" }}
            />
            <div
                className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
                style={{ transform: value ? "translateX(20px)" : "translateX(0)" }}
            />
        </div>
        <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</span>
    </label>
);

// ── Main Settings page ────────────────────────────────────────────────────────
export default function Settings() {
    const [activeTab, setActiveTab] = useState("profile");
    const [form, setForm] = useState({
        name: "",
        jobTitle: "",
        bio: "",
        location: "",
        experienceLevel: "Student",
        preferredJobType: "Any",
        preferredSalary: "",
        openToWork: true,
        education: "",
        experience: "",
        skills: [],
        linkedIn: "",
        github: "",
        portfolio: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    const set = useCallback((key, val) => {
        setForm((prev) => ({ ...prev, [key]: val }));
        setSaved(false);
    }, []);

    // Load current profile
    useEffect(() => {
        (async () => {
            try {
                const { data } = await getProfile();
                setForm((prev) => ({ ...prev, ...data, skills: data.skills || [] }));
            } catch (err) {
                setError(getErrorMessage(err, "Could not load profile."));
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSaved(false);
        try {
            await updateProfile(form);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            setError(getErrorMessage(err, "Could not save profile."));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 max-w-3xl">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="skeleton h-12 rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="max-w-3xl">
            {/* Header */}
            <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">Account</p>
                <h1
                    className="text-3xl font-black"
                    style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
                >
                    Profile & Settings
                </h1>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                    Your profile info powers job recommendations, AI matching, and career coaching.
                </p>
            </div>

            {/* Tab Bar */}
            <div
                className="flex gap-1 mb-6 p-1 rounded-xl"
                style={{ background: "var(--bg-hover)", border: "1px solid var(--border)" }}
            >
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        id={`settings-tab-${tab.id}`}
                        onClick={() => setActiveTab(tab.id)}
                        className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                        style={{
                            background: activeTab === tab.id ? "var(--bg-card)" : "transparent",
                            color: activeTab === tab.id ? "var(--text-primary)" : "var(--text-muted)",
                            boxShadow: activeTab === tab.id ? "var(--shadow)" : "none",
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Error banner */}
            {error && (
                <div className="mb-4 px-4 py-3 rounded-xl text-sm badge-red border" style={{ borderColor: "#fecaca" }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSave}>
                {/* ── Profile Tab ─────────────────────────────────────────────── */}
                {activeTab === "profile" && (
                    <div className="glass-card p-6 space-y-5">
                        <h2 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                            Personal Information
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-5">
                            <Field label="Full Name" hint="Shown on your profile and applications">
                                <Input value={form.name} onChange={(v) => set("name", v)} placeholder="Nishad Damale" />
                            </Field>
                            <Field label="Job Title / Role" hint="What you do or aspire to do">
                                <Input value={form.jobTitle} onChange={(v) => set("jobTitle", v)} placeholder="Full Stack Developer" />
                            </Field>
                        </div>

                        <Field label="Bio" hint="A short intro about yourself">
                            <Textarea
                                value={form.bio}
                                onChange={(v) => set("bio", v)}
                                placeholder="Passionate Full Stack Developer with 2 years of experience building scalable web apps..."
                                rows={3}
                            />
                        </Field>

                        <Field label="Location" hint="City, Country — used to filter jobs near you">
                            <Input value={form.location} onChange={(v) => set("location", v)} placeholder="Pune, India" />
                        </Field>

                        <Field label="Education" hint="Degree, institution, graduation year">
                            <Textarea
                                value={form.education}
                                onChange={(v) => set("education", v)}
                                placeholder="B.Tech. Computer Engineering — PES Modern College of Engineering, 2026"
                                rows={2}
                            />
                        </Field>

                        <Field label="Experience Summary" hint="Brief work history">
                            <Textarea
                                value={form.experience}
                                onChange={(v) => set("experience", v)}
                                placeholder="2 years building MERN stack apps. Interned at XYZ Corp as a frontend dev..."
                                rows={3}
                            />
                        </Field>
                    </div>
                )}

                {/* ── Preferences Tab ──────────────────────────────────────────── */}
                {activeTab === "preferences" && (
                    <div className="glass-card p-6 space-y-5">
                        <h2 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                            Job Preferences
                            <span className="text-xs font-normal ml-2" style={{ color: "var(--text-muted)" }}>
                                — used to personalise job recommendations
                            </span>
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-5">
                            <Field label="Experience Level">
                                <Select
                                    value={form.experienceLevel}
                                    onChange={(v) => set("experienceLevel", v)}
                                    options={EXPERIENCE_LEVELS}
                                />
                            </Field>
                            <Field label="Preferred Job Type">
                                <Select
                                    value={form.preferredJobType}
                                    onChange={(v) => set("preferredJobType", v)}
                                    options={JOB_TYPES}
                                />
                            </Field>
                        </div>

                        <Field label="Expected Salary / Package" hint="e.g. 8–12 LPA or $60k–$80k/yr">
                            <Input
                                value={form.preferredSalary}
                                onChange={(v) => set("preferredSalary", v)}
                                placeholder="8–12 LPA"
                            />
                        </Field>

                        <div
                            className="p-4 rounded-xl"
                            style={{ background: "var(--bg-hover)", border: "1px solid var(--border)" }}
                        >
                            <Toggle
                                value={form.openToWork}
                                onChange={(v) => set("openToWork", v)}
                                label="Open to Work — signal you're actively looking for opportunities"
                            />
                        </div>

                        <div
                            className="p-4 rounded-xl flex items-start gap-3"
                            style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.15)" }}
                        >
                            <span className="text-lg flex-shrink-0">💡</span>
                            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                                <strong style={{ color: "var(--text-primary)" }}>How this is used:</strong><br />
                                Your experience level and job type are used in AI job matching and resume-based recommendations. For best results, also <Link to="/resume" className="text-blue-500 underline">upload your resume</Link> to extract skills automatically.
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Skills Tab ────────────────────────────────────────────────── */}
                {activeTab === "skills" && (
                    <div className="glass-card p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                                    Your Skills
                                </h2>
                                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                                    Manually add skills or upload your resume to auto-extract them
                                </p>
                            </div>
                            <Link to="/resume" className="btn btn-secondary text-xs px-3 py-1.5">
                                📄 Upload Resume
                            </Link>
                        </div>

                        <SkillsEditor
                            skills={form.skills}
                            onChange={(skills) => set("skills", skills)}
                        />

                        {form.skills.length === 0 && (
                            <div
                                className="p-5 rounded-xl text-center text-sm"
                                style={{ background: "var(--bg-hover)", color: "var(--text-muted)" }}
                            >
                                <div className="text-3xl mb-2">⚡</div>
                                <p className="font-semibold mb-1">No skills yet</p>
                                <p>Add skills above, or <Link to="/resume" className="text-blue-500 underline">upload your resume</Link> to extract them automatically with AI.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Social Links Tab ──────────────────────────────────────────── */}
                {activeTab === "links" && (
                    <div className="glass-card p-6 space-y-5">
                        <h2 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                            Social &amp; Portfolio Links
                        </h2>

                        <Field label="LinkedIn Profile">
                            <Input
                                value={form.linkedIn}
                                onChange={(v) => set("linkedIn", v)}
                                placeholder="https://linkedin.com/in/your-profile"
                                prefix="🔗"
                            />
                        </Field>

                        <Field label="GitHub Profile">
                            <Input
                                value={form.github}
                                onChange={(v) => set("github", v)}
                                placeholder="https://github.com/your-username"
                                prefix="🐙"
                            />
                        </Field>

                        <Field label="Portfolio / Personal Website">
                            <Input
                                value={form.portfolio}
                                onChange={(v) => set("portfolio", v)}
                                placeholder="https://your-portfolio.dev"
                                prefix="🌐"
                            />
                        </Field>

                        {(form.linkedIn || form.github || form.portfolio) && (
                            <div className="flex flex-wrap gap-3 pt-2">
                                {form.linkedIn && (
                                    <a href={form.linkedIn} target="_blank" rel="noreferrer"
                                        className="btn btn-secondary text-xs px-3 py-1.5">
                                        View LinkedIn ↗
                                    </a>
                                )}
                                {form.github && (
                                    <a href={form.github} target="_blank" rel="noreferrer"
                                        className="btn btn-secondary text-xs px-3 py-1.5">
                                        View GitHub ↗
                                    </a>
                                )}
                                {form.portfolio && (
                                    <a href={form.portfolio} target="_blank" rel="noreferrer"
                                        className="btn btn-secondary text-xs px-3 py-1.5">
                                        View Portfolio ↗
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Save button */}
                <div className="mt-6 flex items-center gap-3">
                    <button
                        id="settings-save-btn"
                        type="submit"
                        disabled={saving}
                        className="btn btn-primary px-8 py-2.5 disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                Saving…
                            </>
                        ) : "Save Changes"}
                    </button>

                    {saved && (
                        <span
                            className="text-sm font-semibold flex items-center gap-1.5 animate-fade-in"
                            style={{ color: "var(--success)" }}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Saved!
                        </span>
                    )}
                </div>
            </form>

            {/* Profile completeness card */}
            <CompletionCard form={form} />
        </div>
    );
}

// ── Profile Completeness helper ────────────────────────────────────────────────
function CompletionCard({ form }) {
    const checks = [
        { label: "Name", done: !!form.name },
        { label: "Job Title", done: !!form.jobTitle },
        { label: "Location", done: !!form.location },
        { label: "Skills (3+)", done: (form.skills || []).length >= 3 },
        { label: "Bio", done: !!form.bio },
        { label: "GitHub / LinkedIn", done: !!(form.github || form.linkedIn) },
        { label: "Resume uploaded", done: false }, // server-side only
    ];
    const done = checks.filter((c) => c.done).length;
    const pct = Math.round((done / checks.length) * 100);

    return (
        <div
            className="mt-6 glass-card p-5"
        >
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                    Profile Completeness
                </h3>
                <span
                    className="text-xs font-bold"
                    style={{ color: pct >= 80 ? "var(--success)" : pct >= 50 ? "var(--warning)" : "var(--danger)" }}
                >
                    {pct}%
                </span>
            </div>
            <div className="progress-bar mb-4">
                <div
                    className="progress-fill"
                    style={{
                        width: `${pct}%`,
                        background: pct >= 80 ? "var(--success)" : pct >= 50 ? "var(--warning)" : "var(--primary)",
                    }}
                />
            </div>
            <div className="grid grid-cols-2 gap-2">
                {checks.map((c) => (
                    <div key={c.label} className="flex items-center gap-2 text-xs" style={{ color: c.done ? "var(--text-secondary)" : "var(--text-muted)" }}>
                        <span style={{ color: c.done ? "var(--success)" : "var(--border)" }}>
                            {c.done ? "✓" : "○"}
                        </span>
                        {c.label}
                    </div>
                ))}
            </div>
        </div>
    );
}
