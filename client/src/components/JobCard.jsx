import axios from "axios";

function JobCard({ job }) {
    const saveJob = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("Please login first");
                return;
            }

            await axios.post(
                `http://localhost:5000/api/jobs/${job._id}/save`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Job saved successfully!");
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to save job"
            );
        }
    };

    return (
        <div className="bg-white p-5 rounded shadow">
            <h2 className="text-xl font-semibold">
                {job.title}
            </h2>

            <p>{job.company}</p>

            <p>{job.location}</p>

            <p className="text-sm text-gray-500">
                {job.source}
            </p>

            <div className="flex gap-3 mt-3">
                <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Apply
                </a>

                <button
                    onClick={saveJob}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    Save
                </button>
            </div>
        </div>
    );
}

export default JobCard;