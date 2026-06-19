import { useState } from "react";
import api, { getErrorMessage } from "../services/api";

export default function SubmitJob() {
    const [jobLink, setJobLink] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            await api.post("/jobs/submit", { jobLink, companyName, notes });
            setSuccess(true);
            setJobLink("");
            setCompanyName("");
            setNotes("");
        } catch (err) {
            setError(getErrorMessage(err, "Failed to submit job."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-[var(--text-primary)] mb-2 tracking-tight">
                    Submit an Opportunity
                </h1>
                <p className="text-[var(--text-secondary)]">
                    Found an off-campus drive, hiring challenge, or internship? Share the link below to help the community. All submissions are verified before publishing.
                </p>
            </div>

            <div className="card p-6">
                {success && (
                    <div className="mb-6 p-4 rounded-lg badge-green border border-green-200">
                        <p className="font-semibold">Thank you for contributing!</p>
                        <p className="text-sm mt-1">Your submission has been sent for verification.</p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 rounded-lg badge-red border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">
                            Job or Drive Link *
                        </label>
                        <input
                            type="url"
                            required
                            className="input w-full"
                            placeholder="https://careers.infosys.com/..."
                            value={jobLink}
                            onChange={(e) => setJobLink(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">
                            Company Name (Optional)
                        </label>
                        <input
                            type="text"
                            className="input w-full"
                            placeholder="e.g., TCS, Wipro"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">
                            Notes / Details (Optional)
                        </label>
                        <textarea
                            className="input w-full min-h-[100px] resize-y"
                            placeholder="e.g., Only for 2024 passouts. Hiring challenge link."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !jobLink}
                        className="btn btn-primary w-full py-3 mt-4"
                    >
                        {loading ? "Submitting..." : "Submit Opportunity"}
                    </button>
                </form>
            </div>
        </div>
    );
}
