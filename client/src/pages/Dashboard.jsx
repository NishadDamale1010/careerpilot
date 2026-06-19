import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Bar, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS, CategoryScale, LinearScale,
    BarElement, ArcElement, Tooltip, Legend,
} from "chart.js";
import { getErrorMessage } from "../services/api";
import { getApplications } from "../services/applicationService";
import { getAggregatedJobs, getSavedJobs } from "../services/jobService";
import { getRecommendedJobs } from "../services/resumeService";
import { useTheme } from "../context/ThemeContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ============================================
// DATA TRANSFORMERS
// ============================================

/**
 * Transform raw applications into monthly aggregation
 * Uses calendar month indices for consistency
 */
function buildMonthlyData(applications) {
    const monthCounts = new Array(12).fill(0);

    applications.forEach((app) => {
        try {
            const createdDate = new Date(app.createdAt);
            if (!isNaN(createdDate.getTime())) {
                monthCounts[createdDate.getMonth()]++;
            }
        } catch (error) {
            console.warn("Invalid date in application:", app.createdAt);
        }
    });

    return monthCounts;
}

/**
 * Transform applications into status buckets
 * Safely handles missing/invalid statuses
 */
function buildStatusData(applications) {
    const statusMap = { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 };

    applications.forEach((app) => {
        if (app.status && statusMap.hasOwnProperty(app.status)) {
            statusMap[app.status]++;
        }
    });

    return statusMap;
}

/**
 * Calculate resume score based on engagement metrics
 * Base 30 + weighted contributions from saved jobs and applications
 */
function calculateResumeScore(savedJobsCount, applicationsCount, offersCount) {
    const baseScore = 30;
    const savedJobsScore = Math.min(savedJobsCount * 4, 25);
    const applicationsScore = Math.min(applicationsCount * 6, 30);
    const offersScore = offersCount * 15;

    return Math.min(100, baseScore + savedJobsScore + applicationsScore + offersScore);
}

/**
 * Filter jobs by type (internship) with fallback logic
 */
function countInternships(jobs) {
    return jobs.filter((job) => {
        const type = job.type?.toLowerCase() || "";
        const title = job.title?.toLowerCase() || "";
        return type.includes("intern") || title.includes("intern");
    }).length;
}

const SERVICE_COMPANIES = [
    "tata consultancy services", "tcs", "infosys", "wipro", "hcl", "hcltech", 
    "tech mahindra", "cognizant", "capgemini", "accenture", "ltimindtree", 
    "persistent systems", "oracle", "ibm", "deloitte", "pwc", "ey", "kpmg", 
    "ntt data", "mphasis", "hexaware", "birlasoft", "coforge"
];

function sortPriorityCompaniesFirst(jobs) {
    return [...jobs].sort((a, b) => {
        const aCompany = (a.company || "").toLowerCase();
        const bCompany = (b.company || "").toLowerCase();
        const aIsPriority = SERVICE_COMPANIES.some(c => aCompany.includes(c));
        const bIsPriority = SERVICE_COMPANIES.some(c => bCompany.includes(c));
        if (aIsPriority && !bIsPriority) return -1;
        if (!aIsPriority && bIsPriority) return 1;
        
        // fallback to normal matchScore or date sorting if both are priority or both are not
        const aScore = a.matchScore || 0;
        const bScore = b.matchScore || 0;
        if (aScore !== bScore) return bScore - aScore;
        return new Date(b.postedAt || 0) - new Date(a.postedAt || 0);
    });
}

// ============================================
// STAT CARD COMPONENT (Memoized)
// ============================================

const StatCard = ({ title, value, icon, color, trend, loading }) => (
    <div className="card p-5 flex items-center gap-4" role="region" aria-label={`${title}: ${value}`}>
        <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: color + "15", color }}
            aria-hidden="true"
        >
            {icon}
        </div>
        <div className="flex-1 min-w-0">
            <p
                className="text-sm font-semibold uppercase tracking-wider mb-0.5"
                style={{ color: "var(--text-secondary)" }}
            >
                {title}
            </p>
            <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                    {loading ? (
                        <span className="inline-block w-8 h-8 bg-slate-300 rounded animate-pulse" aria-label="Loading" />
                    ) : (
                        value === "-" ? "—" : value
                    )}
                </p>
                {trend && !loading && (
                    <span
                        className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded"
                        aria-label={`Trend: ${trend}`}
                    >
                        {trend}
                    </span>
                )}
            </div>
        </div>
    </div>
);

// ============================================
// JOB LISTING SECTION (Memoized)
// ============================================

const JobsList = ({ jobs, loading }) => {
    if (loading) {
        return (
            <div className="space-y-3" role="status" aria-label="Loading jobs">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="skeleton h-14 rounded-lg" />
                ))}
            </div>
        );
    }

    if (jobs.length === 0) {
        return (
            <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>
                No jobs available yet
            </p>
        );
    }

    return (
        <div className="space-y-1" role="list">
            {jobs.map((job) => (
                <Link
                    key={job._id || job.applyUrl}
                    to={`/jobs/${job._id}`}
                    className="flex items-center gap-4 py-3.5 px-3 rounded-xl hover:bg-[var(--bg-hover)] transition-colors group"
                    style={{ borderBottom: "1px solid var(--border)" }}
                    role="listitem"
                >
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                        style={{ background: "#2563eb" }}
                        aria-hidden="true"
                    >
                        {(job.company || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate group-hover:underline" style={{ color: "var(--text-primary)" }}>
                            {decodeHtml(job.title || "Untitled")}
                        </p>
                        <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                            {job.company || "Unknown"}
                        </p>
                    </div>
                    {job.source && (
                        <span
                            className={`ml-auto badge source-${job.source.toLowerCase().replace(/\s/g, "")}`}
                            aria-label={`Source: ${job.source}`}
                        >
                            {job.source}
                        </span>
                    )}
                </Link>
            ))}
        </div>
    );
};

// ============================================
// APPLICATIONS LISTING SECTION (Memoized)
// ============================================

const ApplicationsList = ({ applications, loading }) => {
    if (loading) {
        return (
            <div className="space-y-3" role="status" aria-label="Loading applications">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="skeleton h-14 rounded-lg" />
                ))}
            </div>
        );
    }

    if (applications.length === 0) {
        return (
            <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>
                No applications yet
            </p>
        );
    }

    return (
        <div className="space-y-1" role="list">
            {applications.slice(0, 6).map((app) => (
                <Link
                    key={app._id}
                    to={`/applications/${app._id}`}
                    className="flex items-center gap-4 py-3.5 px-3 rounded-xl hover:bg-[var(--bg-hover)] transition-colors group"
                    style={{ borderBottom: "1px solid var(--border)" }}
                    role="listitem"
                >
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate group-hover:underline" style={{ color: "var(--text-primary)" }}>
                            {decodeHtml(app.jobId?.title || "Tracked application")}
                        </p>
                        <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                            {app.jobId?.company || "Company unavailable"}
                        </p>
                    </div>
                    <span
                        className={`badge badge-${app.status?.toLowerCase()} flex-shrink-0`}
                        aria-label={`Status: ${app.status}`}
                    >
                        {app.status}
                    </span>
                </Link>
            ))}
        </div>
    );
};

// ============================================
// CHART CONFIGURATION FACTORY
// ============================================

/**
 * Create consistent chart styling based on theme
 */
function createChartConfig(dark) {
    const gridColor = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
    const tickColor = dark ? "#475569" : "#94a3b8";
    const tooltipBg = dark ? "#1a1a1a" : "#ffffff";
    const tooltipBorder = dark ? "#333" : "#e2e8f0";

    return {
        gridColor,
        tickColor,
        tooltipBg,
        tooltipBorder,
    };
}

function createChartOptions(config, isDoughnut = false) {
    const { gridColor, tickColor, tooltipBg, tooltipBorder } = config;

    const baseOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                backgroundColor: tooltipBg,
                borderColor: tooltipBorder,
                borderWidth: 1,
                titleColor: "#f1f5f9",
                bodyColor: "#94a3b8",
                padding: 10,
                boxPadding: 6,
            },
        },
    };

    if (isDoughnut) {
        return {
            ...baseOptions,
            cutout: "68%",
            plugins: {
                ...baseOptions.plugins,
                legend: {
                    position: "bottom",
                    labels: {
                        color: tickColor,
                        padding: 14,
                        font: { size: 11, weight: 500 },
                    },
                },
            },
        };
    }

    return {
        ...baseOptions,
        plugins: {
            ...baseOptions.plugins,
            legend: { display: false },
        },
        scales: {
            x: {
                grid: { color: gridColor },
                ticks: { color: tickColor, font: { size: 11 } },
            },
            y: {
                grid: { color: gridColor },
                ticks: { color: tickColor, font: { size: 11 } },
                beginAtZero: true,
            },
        },
    };
}

// ============================================
// QUICK LINKS SECTION
// ============================================

const QuickLinks = () => {
    const links = [
        {
            to: "/ai-match",
            label: "AI Job Match",
            desc: "Compare resume to active roles",
            icon: "🎯",
            color: "#2563eb",
        },
        {
            to: "/ai-coach",
            label: "AI Coach",
            desc: "Get feedback from your career advisor",
            icon: "🤖",
            color: "#0891b2",
        },
        {
            to: "/interview-prep",
            label: "Interview Prep",
            desc: "Practice role-specific mock questions",
            icon: "🎙️",
            color: "#16a34a",
        },
        {
            to: "/roadmaps",
            label: "Roadmaps",
            desc: "View step-by-step career path roadmaps",
            icon: "🗺️",
            color: "#d97706",
        },
    ];

    return (
        <nav className="mt-8">
            <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                Quick Links & AI Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {links.map((link) => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className="card-hover p-5 flex flex-col gap-2 rounded-lg hover:shadow-md transition-all"
                        style={{ textDecoration: "none" }}
                    >
                        <div className="text-2xl mb-1" aria-hidden="true">
                            {link.icon}
                        </div>
                        <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                            {link.label}
                        </p>
                        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                            {link.desc}
                        </p>
                    </Link>
                ))}
            </div>
        </nav>
    );
};

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================

export default function Dashboard() {
    const { dark } = useTheme();
    const [stats, setStats] = useState({
        totalJobs: 0,
        savedJobs: 0,
        applications: 0,
        interviews: 0,
        internships: 0,
        resumeScore: 0,
    });
    const [recentJobs, setRecentJobs] = useState([]);
    const [recentInternships, setRecentInternships] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ============================================
    // DATA FETCHING EFFECT
    // ============================================

    useEffect(() => {
        let isMounted = true;

        (async () => {
            try {
                setLoading(true);
                setError("");

                const [jobsRes, aggRes, savedRes, appRes] = await Promise.all([
                    getRecommendedJobs().catch(() => ({ data: { jobs: [] } })),
                    getAggregatedJobs({ limit: 50 }).catch(() => ({ data: { jobs: [] } })),
                    getSavedJobs().catch(() => ({ data: [] })),
                    getApplications().catch(() => ({ data: [] })),
                ]);

                if (!isMounted) return;

                const savedJobs = savedRes?.data || [];
                const apps = appRes?.data || [];
                
                const aiJobs = jobsRes?.data?.jobs || [];
                const allRecent = aggRes?.data?.jobs || [];
                
                // Deduplicate pool
                const seenKeys = new Set();
                const combinedPool = [...aiJobs, ...allRecent].filter(j => {
                    const key = `${j.title}-${j.company}`;
                    if (seenKeys.has(key)) return false;
                    seenKeys.add(key);
                    return true;
                });

                const internshipsPool = combinedPool.filter(job => {
                    const type = job.type?.toLowerCase() || "";
                    const title = job.title?.toLowerCase() || "";
                    return type.includes("intern") || title.includes("intern");
                });

                const fulltimePool = combinedPool.filter(job => {
                    const type = job.type?.toLowerCase() || "";
                    const title = job.title?.toLowerCase() || "";
                    return !type.includes("intern") && !title.includes("intern");
                });

                const interviews = apps.filter((a) => a.status === "Interview").length;
                const offers = apps.filter((a) => a.status === "Offer").length;
                const internships = countInternships(combinedPool);
                const totalJobs = combinedPool.length;

                const resumeScore = calculateResumeScore(
                    savedJobs.length,
                    apps.length,
                    offers
                );

                setStats({
                    totalJobs,
                    savedJobs: savedJobs.length,
                    applications: apps.length,
                    interviews,
                    internships,
                    resumeScore,
                });

                setRecentJobs(sortPriorityCompaniesFirst(fulltimePool).slice(0, 6));
                setRecentInternships(sortPriorityCompaniesFirst(internshipsPool).slice(0, 6));
                setApplications(apps);
            } catch (err) {
                if (isMounted) {
                    setError(
                        getErrorMessage(err, "Unable to load dashboard data. Please refresh the page.")
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    // ============================================
    // MEMOIZED CHART DATA & CALCULATIONS
    // ============================================

    const monthlyData = useMemo(() => buildMonthlyData(applications), [applications]);
    const statusData = useMemo(() => buildStatusData(applications), [applications]);

    const last6Months = useMemo(() => {
        const now = new Date();
        return Array.from({ length: 6 }, (_, i) =>
            new Date(now.getFullYear(), now.getMonth() - 5 + i, 1).getMonth()
        );
    }, []);

    const chartConfig = useMemo(() => createChartConfig(dark), [dark]);

    const barChartData = useMemo(
        () => ({
            labels: last6Months.map((m) => MONTHS[m]),
            datasets: [
                {
                    label: "Applications",
                    data: last6Months.map((m) => monthlyData[m]),
                    backgroundColor: "#2563eb",
                    borderRadius: 5,
                    borderSkipped: false,
                },
            ],
        }),
        [last6Months, monthlyData]
    );

    const doughnutChartData = useMemo(
        () => ({
            labels: ["Applied", "Interview", "Offer", "Rejected"],
            datasets: [
                {
                    data: [
                        statusData.Applied,
                        statusData.Interview,
                        statusData.Offer,
                        statusData.Rejected,
                    ],
                    backgroundColor: ["#2563eb", "#d97706", "#16a34a", "#dc2626"],
                    borderWidth: 0,
                },
            ],
        }),
        [statusData]
    );

    const barChartOptions = useMemo(() => createChartOptions(chartConfig, false), [chartConfig]);
    const doughnutChartOptions = useMemo(() => createChartOptions(chartConfig, true), [chartConfig]);

    // ============================================
    // STAT CARDS DATA
    // ============================================

    const statCards = useMemo(
        () => [
            {
                title: "Total Jobs",
                value: stats.totalJobs,
                color: "#2563eb",
                trend: "+32 this week",
                icon: (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="2" y="7" width="20" height="14" rx="2" />
                        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                    </svg>
                ),
            },
            {
                title: "Internships",
                value: stats.internships,
                color: "#8b5cf6",
                icon: (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                ),
            },
            {
                title: "Saved Jobs",
                value: stats.savedJobs,
                color: "#d97706",
                icon: (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                ),
            },
            {
                title: "Applications",
                value: stats.applications,
                color: "#0891b2",
                icon: (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                    </svg>
                ),
            },
            {
                title: "Interviews",
                value: stats.interviews,
                color: "#16a34a",
                icon: (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="9" y="2" width="6" height="12" rx="3" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    </svg>
                ),
            },
        ],
        [stats]
    );

    // ============================================
    // GREETING LOGIC
    // ============================================

    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

    // ============================================
    // RENDER
    // ============================================

    return (
        <div>
            {/* Header Section */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                <div>
                    <h1
                        className="text-4xl font-bold"
                        style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
                    >
                        👋 {greeting}, Nishad
                    </h1>
                    <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
                        Track jobs, applications, interviews and career growth from one place.
                    </p>
                </div>
                <Link
                    to="/jobs"
                    className="btn btn-primary px-5 py-2.5"
                    id="dashboard-browse-jobs"
                    aria-label="Browse all available jobs"
                >
                    Browse Jobs
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </Link>
            </header>

            {/* Error Alert */}
            {error && (
                <div
                    className="mb-5 px-4 py-3 rounded-lg text-sm badge-red border"
                    style={{ borderColor: "#fecaca" }}
                    role="alert"
                    aria-live="polite"
                >
                    {error}
                </div>
            )}

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
                {statCards.map((card) => (
                    <StatCard key={card.title} {...card} loading={loading} />
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                {/* Bar Chart */}
                <div className="lg:col-span-8 card p-6">
                    <h2
                        className="text-xl font-semibold mb-0.5"
                        style={{ color: "var(--text-primary)" }}
                    >
                        Applications by Month
                    </h2>
                    <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
                        Last 6 months activity
                    </p>
                    <div style={{ height: 290 }}>
                        {applications.length > 0 ? (
                            <Bar data={barChartData} options={barChartOptions} />
                        ) : (
                            <div
                                className="flex items-center justify-center h-full text-sm"
                                style={{ color: "var(--text-muted)" }}
                            >
                                No application data yet
                            </div>
                        )}
                    </div>
                </div>

                {/* Doughnut Chart */}
                <div className="lg:col-span-4 card p-6">
                    <h2
                        className="text-xl font-semibold mb-0.5"
                        style={{ color: "var(--text-primary)" }}
                    >
                        Application Funnel
                    </h2>
                    <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
                        Current stages
                    </p>
                    <div style={{ height: 290 }}>
                        {applications.length > 0 ? (
                            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
                        ) : (
                            <div
                                className="flex items-center justify-center h-full text-sm"
                                style={{ color: "var(--text-muted)" }}
                            >
                                No applications yet
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Jobs & Applications Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                {/* Latest Jobs */}
                <div className="lg:col-span-6 card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2
                            className="text-xl font-semibold"
                            style={{ color: "var(--text-primary)" }}
                        >
                            Top Full-Time Jobs
                        </h2>
                        <Link
                            to="/ai-match"
                            className="text-sm font-medium"
                            style={{ color: "#2563eb" }}
                            aria-label="View all recommended jobs"
                        >
                            View all
                        </Link>
                    </div>
                    <JobsList jobs={recentJobs} loading={loading} />
                </div>

                {/* Top Internships */}
                <div className="lg:col-span-6 card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2
                            className="text-xl font-semibold"
                            style={{ color: "var(--text-primary)" }}
                        >
                            Top Internships
                        </h2>
                        <Link
                            to="/jobs"
                            className="text-sm font-medium"
                            style={{ color: "#2563eb" }}
                            aria-label="View all internships"
                        >
                            View all
                        </Link>
                    </div>
                    <JobsList jobs={recentInternships} loading={loading} />
                </div>
            </div>

            {/* Quick Links */}
            <QuickLinks />
        </div>
    );
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Decode common HTML entities
 * Handles &amp;, &lt;, &gt;, &quot;, &#039;
 */
function decodeHtml(str) {
    if (!str || typeof str !== "string") return str;

    const htmlMap = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&#039;": "'",
    };

    return str.replace(/&[^;]+;/g, (match) => htmlMap[match] || match);
}