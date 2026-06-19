import { useState } from "react";
import api, { getErrorMessage } from "../services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function SubmitJob() {
    const [jobLink, setJobLink] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/jobs/submit", { jobLink, companyName, notes });
            toast.success("Opportunity submitted! Pending verification.");
            setJobLink("");
            setCompanyName("");
            setNotes("");
        } catch (err) {
            toast.error(getErrorMessage(err, "Failed to submit job."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto py-8"
        >
            <div className="mb-8">
                <h1 className="text-3xl font-black text-[var(--text-primary)] mb-2 tracking-tight">
                    Submit an Opportunity
                </h1>
                <p className="text-[var(--text-secondary)]">
                    Found an off-campus drive, hiring challenge, or internship? Share the link below to help the community. All submissions are verified before publishing.
                </p>
            </div>

            <div className="glass-card p-6 border border-[var(--primary-light)]">
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
        </motion.div>
    );
}
