const statusColors = {
    Applied:
        "bg-blue-100 text-blue-700",

    Interview:
        "bg-yellow-100 text-yellow-700",

    Accepted:
        "bg-green-100 text-green-700",

    Rejected:
        "bg-red-100 text-red-700",
};

function ApplicationCard({ application }) {
    return (
        <div className="bg-white shadow rounded-lg p-5">
            <h2 className="text-xl font-semibold">
                {application.jobId?.title || "Job Title"}
            </h2>

            <p className="text-gray-600">
                {application.jobId?.company || "Company"}
            </p>

            <div className="mt-3 flex items-center gap-4">
                <span
                    className={`px-3 py-1 rounded-full font-medium ${statusColors[
                        application.status
                        ] ||
                        "bg-gray-100 text-gray-700"
                        }`}
                >
                    {application.status}
                </span>

                <span className="text-gray-500">
                    {new Date(
                        application.createdAt
                    ).toLocaleDateString()}
                </span>
            </div>
        </div>
    );
}

export default ApplicationCard;