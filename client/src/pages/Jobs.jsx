import { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "../components/JobCard";

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const fetchJobs = async () => {
        try {
            setLoading(true);

            const { data } = await axios.get(
                `http://localhost:5000/api/jobs/aggregate?page=${page}&search=${search}`
            );

            setJobs(data.jobs);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [page, search]);

    const handleSearch = () => {
        setPage(1);
        fetchJobs();
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">
                Jobs
            </h1>

            <div className="flex gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Search jobs..."
                    className="border p-2 flex-1 rounded"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <button
                    onClick={handleSearch}
                    className="bg-black text-white px-4 py-2 rounded"
                >
                    Search
                </button>
            </div>

            {loading ? (
                <p>Loading jobs...</p>
            ) : jobs.length === 0 ? (
                <p>No jobs found.</p>
            ) : (
                <div className="grid gap-4">
                    {jobs.map((job) => (
                        <JobCard
                            key={job.applyUrl}
                            job={job}
                        />
                    ))}
                </div>
            )}

            <div className="flex items-center gap-3 mt-8">
                <button
                    onClick={() =>
                        setPage((prev) =>
                            Math.max(prev - 1, 1)
                        )
                    }
                    disabled={page === 1}
                    className="border px-4 py-2 rounded disabled:opacity-50"
                >
                    Prev
                </button>

                <span className="px-4 py-2">
                    Page {page}
                </span>

                <button
                    onClick={() =>
                        setPage((prev) => prev + 1)
                    }
                    className="border px-4 py-2 rounded"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Jobs;