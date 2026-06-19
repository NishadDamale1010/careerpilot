const statusColors = {
    Applied: "bg-blue-50 text-blue-700 border-blue-100",
    Interview: "bg-amber-50 text-amber-700 border-amber-100",
    Offer: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Rejected: "bg-rose-50 text-rose-700 border-rose-100",
};

function ApplicationCard({ application }) {
    const createdAt = application.createdAt
        ? new Date(application.createdAt).toLocaleDateString()
        : "Date unavailable";
    const statusClass =
        statusColors[application.status] ||
        "border-slate-200 bg-slate-100 text-slate-700";

    return (
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                    <h2 className="text-xl font-semibold text-slate-950">
                        {application.jobId?.title || "Job title unavailable"}
                    </h2>

                    <p className="mt-1 text-slate-600">
                        {application.jobId?.company ||
                            "Company unavailable"}
                    </p>
                </div>

                <span
                    className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${statusClass}`}
                >
                    {application.status || "Applied"}
                </span>
            </div>

            <p className="mt-4 text-sm text-slate-500">
                Created {createdAt}
            </p>
        </article>
    );
}

export default ApplicationCard;

