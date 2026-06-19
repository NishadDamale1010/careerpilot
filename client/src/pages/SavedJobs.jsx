import { useEffect, useState } from "react";
import { getErrorMessage } from "../services/api";
import { getSavedJobs, removeSavedJob } from "../services/jobService";
import JobCard from "../components/JobCard";

export default function SavedJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;
        (async () => {
            try {
                const { data } = await getSavedJobs();
                if (!ignore) setJobs(data || []);
            } catch (e) {
                if (!ignore) setError(getErrorMessage(e, "Unable to load saved jobs"));
            } finally {
                if (!ignore) setLoading(false);
            }
        })();
        return () => { ignore = true; };
    }, []);

    const handleUnsave = async (savedJobId) => {
        try {
            await removeSavedJob(savedJobId);
            setJobs((prev) => prev.filter((j) => j._id !== savedJobId));
        } catch (e) {
            setError(getErrorMessage(e, "Failed to remove job"));
        }
    };

    return (
        <div>
            <div className="flex items-end justify-between mb-8">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">Your shortlist</p>
                    <h1 className="text-3xl font-black" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Saved Jobs</h1>
                    <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Revisit roles you want to compare or apply to later.</p>
                </div>
                <div
                    className="px-4 py-2 rounded-xl text-sm font-bold badge badge-blue flex items-center justify-center"
                >
                    {loading ? "—" : jobs.length} saved
                </div>
            </div>

            {error && (
                <div className="mb-6 px-4 py-3 rounded-xl text-sm badge-red border" style={{ borderColor: "#fecaca" }}>
                    {error}
                </div>
            )}

            {loading ? (
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="glass-card p-6 space-y-4">
                            <div className="skeleton h-5 rounded-lg w-3/4" />
                            <div className="skeleton h-4 rounded-lg w-1/2" />
                            <div className="flex gap-2"><div className="skeleton h-6 w-16 rounded-full" /><div className="skeleton h-6 w-20 rounded-full" /></div>
                        </div>
                    ))}
                </div>
            ) : jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="text-6xl mb-4">🔖</div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>No saved jobs yet</h3>
                    <p className="text-sm max-w-sm" style={{ color: "var(--text-secondary)" }}>
                        Browse jobs and save roles you're interested in — they'll appear here.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                    {jobs.map((savedJob) => {
                        const job = savedJob.jobId || savedJob;
                        return (
                            <JobCard
                                key={savedJob._id || job._id}
                                job={job}
                                onUnsave={() => handleUnsave(savedJob._id)}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
