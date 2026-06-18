import { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "../components/JobCard";

function SavedJobs() {
    const [jobs, setJobs] = useState([]);

    const fetchSavedJobs = async () => {
        try {
            const token = localStorage.getItem("token");

            const { data } = await axios.get(
                "http://localhost:5000/api/jobs/saved",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setJobs(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">
                Saved Jobs
            </h1>

            {jobs.length === 0 ? (
                <p>No saved jobs yet.</p>
            ) : (
                <div className="grid gap-4">
                    {jobs.map((job) => (
                        <JobCard
                            key={job._id}
                            job={job}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default SavedJobs;