import { Link } from "react-router-dom";
import heroDashboard from "../assets/landing-dashboard.png";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Float, Sphere, MeshDistortMaterial } from "@react-three/drei";

function Hero3DBackground() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20">
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={1} />
                <directionalLight position={[10, 10, 5]} intensity={2} />
                <Float speed={2} rotationIntensity={1} floatIntensity={2}>
                    <Sphere args={[1.5, 64, 64]} position={[0, 0, 0]}>
                        <MeshDistortMaterial
                            color="#3b82f6"
                            attach="material"
                            distort={0.4}
                            speed={2}
                            roughness={0.2}
                        />
                    </Sphere>
                </Float>
            </Canvas>
        </div>
    );
}

const features = [
    { icon: "🎯", title: "AI Job Matching", text: "Match your resume to thousands of live jobs with a compatibility score and missing skills breakdown." },
    { icon: "🤖", title: "AI Career Coach", text: "Get resume feedback, ATS tips, and interview advice from an AI coach powered by Groq LLaMA 3.3." },
    { icon: "🎤", title: "Interview Prep", text: "Generate role-specific questions with hints, then practice in mock interview mode." },
    { icon: "🛣️", title: "Career Roadmaps", text: "Step-by-step learning paths for Frontend, Backend, Full Stack, AI, Data Science, and DevOps." },
    { icon: "📊", title: "Application Tracking", text: "Kanban board to manage Applied, Interview, Offer, and Rejected stages with live statistics." },
    { icon: "📚", title: "Learning Hub", text: "Curated courses, docs, and videos from Coursera, Udemy, YouTube, and official sources." },
];

const stats = [
    { value: "5+", label: "Job Sources" },
    { value: "1,000+", label: "Live Roles" },
    { value: "AI", label: "Powered Coaching" },
    { value: "Free", label: "To Get Started" },
];

export default function Landing() {
    const hasToken = Boolean(localStorage.getItem("token"));
    const primaryPath = hasToken ? "/dashboard" : "/register";
    const primaryLabel = hasToken ? "Open Dashboard" : "Get Started Free";
    const { dark, toggle } = useTheme();

    const heroGradient = dark
        ? `radial-gradient(ellipse 80% 50% at 50% -20%, rgba(37,99,235,0.15), transparent), var(--bg)`
        : `radial-gradient(ellipse 80% 50% at 50% -20%, rgba(37,99,235,0.1), transparent), var(--bg)`;

    const ctaGradient = dark
        ? `linear-gradient(180deg, var(--bg-card) 0%, var(--bg) 100%)`
        : `linear-gradient(180deg, var(--bg-card) 0%, var(--bg) 100%)`;

    return (
        <div className="min-h-screen transition-colors duration-200" style={{ background: "var(--bg)", color: "var(--text-primary)" }}>

            {/* ── NAV ── */}
            <nav
                className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 sm:px-12"
                style={{
                    background: "var(--bg-card)",
                    backdropFilter: "blur(8px)",
                    borderBottom: "1px solid var(--border)",
                }}
            >
                <div className="flex items-center gap-2.5">
                    <div
                        className="w-7 h-7 rounded flex items-center justify-center text-white font-bold text-xs"
                        style={{ background: "#1e40af" }}
                    >
                        CP
                    </div>
                    <span className="font-bold text-sm tracking-tight" style={{ color: "var(--text-primary)" }}>CareerPilot</span>
                </div>
                <div className="flex items-center gap-3">
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
                                <circle cx="12" cy="12" r="5" />
                                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
                        ) : (
                            /* Moon icon */
                            <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </svg>
                        )}
                    </button>

                    {!hasToken && (
                        <Link
                            to="/login"
                            className="px-3.5 py-1.5 text-sm font-medium transition-colors rounded-md hover:bg-slate-100 dark:hover:bg-neutral-800"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            Sign In
                        </Link>
                    )}
                    <Link
                        to={primaryPath}
                        className="btn btn-primary"
                    >
                        {primaryLabel}
                    </Link>
                </div>
            </nav>

            {/* ── HERO ── */}
            <section
                className="relative flex flex-col items-center justify-center text-center px-6 sm:px-12 py-24 sm:py-32 overflow-hidden"
                style={{
                    background: heroGradient,
                    minHeight: "88vh",
                }}
            >
                <Hero3DBackground />
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10 max-w-3xl mx-auto"
                >
                    <p
                        className="inline-block text-xs font-semibold uppercase tracking-widest mb-5 px-3 py-1 rounded-full"
                        style={{
                            background: "rgba(29,78,216,0.1)",
                            border: "1px solid rgba(59,130,246,0.2)",
                            color: "var(--primary)",
                        }}
                    >
                        AI-Powered Job Search
                    </p>

                    <h1
                        className="text-5xl sm:text-7xl font-extrabold leading-[1.1] mb-6 text-slate-900 dark:text-white"
                        style={{ letterSpacing: "-0.03em" }}
                    >
                        Your complete{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                            career command
                        </span>
                        <br />
                        centre
                    </h1>

                    <p className="text-base sm:text-lg max-w-xl mx-auto mb-9 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        Aggregate jobs from 5+ platforms, match them to your resume, track every application,
                        and prepare for interviews — all in one place.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            to={primaryPath}
                            id="hero-cta-primary"
                            className="btn btn-primary px-7 py-3 text-sm font-bold flex items-center justify-center gap-2"
                        >
                            {primaryLabel}
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <Link
                            to={hasToken ? "/jobs" : "/login"}
                            id="hero-cta-secondary"
                            className="btn btn-secondary px-7 py-3 text-sm font-semibold flex items-center justify-center gap-2"
                        >
                            Browse Jobs
                        </Link>
                    </div>
                </motion.div>

                {/* Dashboard preview card */}
                <div className="w-full flex justify-center mt-16 relative z-10 px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                        className="max-w-5xl w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl"
                    style={{
                        border: "1px solid var(--border)",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    }}
                >
                    <div className="bg-[var(--bg-card)] border-b border-[var(--border)] px-4 py-3 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                    </div>
                    <img
                        src={heroDashboard}
                        alt="CareerPilot Dashboard"
                        className="w-full block"
                        style={{ objectFit: "cover", objectPosition: "top" }}
                    />
                    </motion.div>
                </div>
            </section>

            {/* ── STATS ── */}
            <div className="w-full flex justify-center" style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
                <div className="w-full max-w-5xl px-6 sm:px-12 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {stats.map((s, i) => (
                        <motion.div 
                            key={s.label} 
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="text-center"
                        >
                            <p className="text-2xl font-extrabold" style={{ color: "var(--text-primary)" }}>{s.value}</p>
                            <p className="text-xs font-medium mt-0.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{s.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ── FEATURES ── */}
            <section className="py-20 px-6 sm:px-12 w-full flex justify-center">
                <div className="w-full max-w-5xl">
                    <div className="text-center mb-12">
                        <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-3">Everything in One Platform</p>
                        <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: "var(--text-primary)", letterSpacing: "-0.015em" }}>
                            Built for serious job seekers
                        </h2>
                        <p className="text-sm max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
                            From discovery to offer letter, CareerPilot automates every step of your job search.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {features.map((f, i) => (
                            <motion.div
                                key={f.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="card p-5"
                            >
                                <div
                                    className="w-9 h-9 rounded-lg flex items-center justify-center text-lg mb-3"
                                    style={{ background: "rgba(29,78,216,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}
                                >
                                    {f.icon}
                                </div>
                                <h3 className="font-semibold text-sm mb-1.5" style={{ color: "var(--text-primary)" }}>{f.title}</h3>
                                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section
                className="relative py-24 px-6 sm:px-12 overflow-hidden w-full flex justify-center"
                style={{ background: ctaGradient }}
            >
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 w-full max-w-2xl text-center"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: "var(--text-primary)", letterSpacing: "-0.015em" }}>
                        Start your job search today
                    </h2>
                    <p className="text-sm mb-7" style={{ color: "var(--text-secondary)" }}>
                        Join professionals using CareerPilot to find and land their next role faster.
                    </p>
                    <Link
                        to={primaryPath}
                        id="cta-bottom"
                        className="btn btn-primary px-7 py-3 text-sm font-bold inline-flex items-center gap-2"
                    >
                        {primaryLabel}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </motion.div>
            </section>

            {/* Footer */}
            <footer
                className="text-center py-6 text-xs"
                style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)" }}
            >
                © 2025 CareerPilot — AI-Powered Career Platform
            </footer>
        </div>
    );
}
