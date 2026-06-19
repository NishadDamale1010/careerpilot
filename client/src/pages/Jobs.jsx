import { useEffect, useState } from "react";
import { getErrorMessage } from "../services/api";
import { getAggregatedJobs } from "../services/jobService";
import JobCard from "../components/JobCard";
import { motion, AnimatePresence } from "framer-motion";

const SOURCES = ["All", "remoteok", "wellfound", "remotive", "themuse", "jsearch", "internshala"];
const TYPES = ["All", "Remote", "Full-time", "Part-time", "Internship", "Contract"];
const SORT_OPTIONS = [
    { value: "latest", label: "Latest First" },
    { value: "oldest", label: "Oldest First" },
];

const SERVICE_COMPANIES = [
    "tata consultancy services", "tcs", "infosys", "wipro", "hcl", "hcltech", 
    "tech mahindra", "cognizant", "capgemini", "accenture", "ltimindtree", 
    "persistent systems", "oracle", "ibm", "deloitte", "pwc", "ey", "kpmg", 
    "ntt data", "mphasis", "hexaware", "birlasoft", "coforge", "virtusa",
    "cyient", "kpit", "zensar", "sonata software", "nagarro", "globallogic",
    "quest global", "l&t technology services", "larsen & toubro infotech", "amdocs",
    "genpact", "wns", "concentrix", "teleperformance", "sutherland", "foundever",
    "exl", "firstsource", "hgs", "ttec", "brillio", "publicis sapient", 
    "epam", "thoughtworks", "rackspace", "fujitsu", "dxc", "cgi"
];

function sortPriorityCompaniesFirst(jobs, sortBy = "latest") {
    return [...jobs].sort((a, b) => {
        const aCompany = (a.company || "").toLowerCase();
        const bCompany = (b.company || "").toLowerCase();
        const aIsPriority = SERVICE_COMPANIES.some(c => aCompany.includes(c));
        const bIsPriority = SERVICE_COMPANIES.some(c => bCompany.includes(c));
        if (aIsPriority && !bIsPriority) return -1;
        if (!aIsPriority && bIsPriority) return 1;
        
        // Both are priority or both are not - fallback to sortBy
        const aTime = new Date(a.postedAt || 0).getTime();
        const bTime = new Date(b.postedAt || 0).getTime();
        
        if (sortBy === "oldest") return aTime - bTime;
        return bTime - aTime;
    });
}

function SkeletonCard() {
    return (
        <div className="glass-card p-6 space-y-4">
            <div className="skeleton h-5 rounded-lg w-3/4" />
            <div className="skeleton h-4 rounded-lg w-1/2" />
            <div className="flex gap-2 mt-3">
                <div className="skeleton h-6 w-16 rounded-full" />
                <div className="skeleton h-6 w-20 rounded-full" />
            </div>
        </div>
    );
}

export default function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [query, setQuery] = useState("");
    const [meta, setMeta] = useState({ totalJobs: 0, totalPages: 1 });
    const [selectedSource, setSelectedSource] = useState("All");
    const [selectedType, setSelectedType] = useState("All");
    const [sortBy, setSortBy] = useState("latest");
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        let ignore = false;
        setLoading(true);

        const loadJobs = async () => {
            try {
                const params = { page, limit: 12 };
                if (query) params.search = query;
                if (selectedSource !== "All") params.source = selectedSource;
                if (selectedType !== "All") params.type = selectedType;

                const { data } = await getAggregatedJobs(params);
                if (ignore) return;

                let jobList = data.jobs || [];
                jobList = sortPriorityCompaniesFirst(jobList, sortBy);

                setJobs(jobList);
                setMeta({ totalJobs: data.totalJobs || 0, totalPages: Math.max(data.totalPages || 1, 1) });
                setError("");
            } catch (e) {
                if (!ignore) {
                    setJobs([]);
                    setError(getErrorMessage(e, "Unable to load jobs"));
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        loadJobs();
        return () => { ignore = true; };
    }, [page, query, selectedSource, selectedType, sortBy]);

    const handleSearch = (e) => {
        e.preventDefault();
        const next = searchInput.trim();
        if (page === 1 && query === next) return;
        setPage(1);
        setQuery(next);
    };

    const handleClear = () => {
        setSearchInput("");
        setQuery("");
        setSelectedSource("All");
        setSelectedType("All");
        setPage(1);
    };

    const activeFilters = (query ? 1 : 0) + (selectedSource !== "All" ? 1 : 0) + (selectedType !== "All" ? 1 : 0);

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">Aggregated from 5+ sources</p>
                    <h1 className="text-3xl font-black" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Browse Jobs</h1>
                    <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                        {loading ? "Loading..." : `${meta.totalJobs.toLocaleString()} roles available`}
                    </p>
                </div>
                <button
                    id="toggle-filters"
                    onClick={() => setShowFilters((f) => !f)}
                    className="btn btn-secondary flex items-center gap-2"
                    style={{ border: "1px solid var(--border)" }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                    </svg>
                    Filters {activeFilters > 0 && <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">{activeFilters}</span>}
                </button>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-3 mb-4">
                <div className="flex-1 relative">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2"
                        style={{ color: "var(--text-muted)" }}
                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    >
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        id="job-search-input"
                        type="search"
                        placeholder="Search title, company, skill, or source..."
                        className="input pl-10"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </div>
                <button id="job-search-submit" type="submit" className="btn btn-primary px-6">
                    Search
                </button>
                {(query || searchInput || activeFilters > 0) && (
                    <button type="button" onClick={handleClear} className="btn btn-secondary px-4">
                        Clear
                    </button>
                )}
            </form>

            {/* Filter Panel */}
            {showFilters && (
                <div className="flex flex-wrap items-center gap-3 mb-8 animate-scale-in">
                    {/* Source Toolbar */}
                    <div className="flex items-center gap-1 border border-[var(--border)] rounded-lg p-1 bg-[var(--bg-card)] shadow-sm">
                        <span className="px-3 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest border-r border-[var(--border)] mr-1">Source</span>
                        {SOURCES.map(s => (
                             <button
                                 key={s}
                                 id={`source-filter-${s}`}
                                 type="button"
                                 onClick={() => { setSelectedSource(s); setPage(1); }}
                                 className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${selectedSource === s ? "bg-[var(--bg-hover)] text-[var(--text-primary)] shadow-sm" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
                             >
                                 {s}
                             </button>
                        ))}
                    </div>

                    {/* Type Toolbar */}
                    <div className="flex items-center gap-1 border border-[var(--border)] rounded-lg p-1 bg-[var(--bg-card)] shadow-sm">
                        <span className="px-3 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest border-r border-[var(--border)] mr-1">Type</span>
                        {TYPES.map(t => (
                             <button
                                 key={t}
                                 id={`type-filter-${t}`}
                                 type="button"
                                 onClick={() => { setSelectedType(t); setPage(1); }}
                                 className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${selectedType === t ? "bg-[var(--bg-hover)] text-[var(--text-primary)] shadow-sm" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
                             >
                                 {t}
                             </button>
                        ))}
                    </div>

                    {/* Sort Toolbar */}
                    <div className="flex items-center gap-1 border border-[var(--border)] rounded-lg p-1 bg-[var(--bg-card)] shadow-sm">
                        <span className="px-3 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest border-r border-[var(--border)] mr-1">Sort</span>
                        {SORT_OPTIONS.map(opt => (
                             <button
                                 key={opt.value}
                                 id={`sort-${opt.value}`}
                                 type="button"
                                 onClick={() => setSortBy(opt.value)}
                                 className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${sortBy === opt.value ? "bg-[var(--bg-hover)] text-[var(--text-primary)] shadow-sm" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
                             >
                                 {opt.label}
                             </button>
                        ))}
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-6 px-4 py-3 rounded-xl text-sm badge-red border" style={{ borderColor: "#fecaca" }}>
                    {error}
                </div>
            )}

            {/* Jobs Grid */}
            <motion.div 
                className="grid gap-8 lg:grid-cols-2 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.08 }}
            >
                <AnimatePresence mode="popLayout">
                    {loading
                        ? Array.from({ length: 12 }).map((_, i) => (
                              <motion.div key={`skeleton-${i}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
                                  <SkeletonCard />
                              </motion.div>
                          ))
                        : jobs.length === 0
                            ? (
                                <motion.div key="empty" className="col-span-2 text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "var(--text-muted)" }}>
                                    <div className="text-4xl mb-3">🔍</div>
                                    <p className="font-semibold">No jobs found.</p>
                                    <p className="text-sm mt-1">Try a different search or clear your filters.</p>
                                </motion.div>
                            )
                            : jobs.map((job) => (
                                <motion.div 
                                    key={job._id || job.applyUrl || `${job.title}-${job.company}`}
                                    layout
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                >
                                    <JobCard job={job} />
                                </motion.div>
                            ))}
                </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {!loading && meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4">
                    <button
                        id="jobs-prev-page"
                        type="button"
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="btn btn-secondary px-5 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        ← Previous
                    </button>
                    <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
                        Page <span style={{ color: "var(--text-primary)" }}>{page}</span> of <span style={{ color: "var(--text-primary)" }}>{meta.totalPages}</span>
                    </span>
                    <button
                        id="jobs-next-page"
                        type="button"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page >= meta.totalPages}
                        className="btn btn-secondary px-5 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
}
