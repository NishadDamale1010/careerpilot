function JobCard({ job }) {
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

            <a
                href={job.applyUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded"
            >
                Apply
            </a>
        </div>
    );
}

export default JobCard;