const UserSubmission = require("../models/UserSubmission");

const submitJob = async (req, res) => {
    try {
        const { jobLink, companyName, notes } = req.body;

        if (!jobLink) {
            return res.status(400).json({ message: "Job link is required" });
        }

        const submission = new UserSubmission({
            user: req.user._id,
            jobLink,
            companyName,
            notes,
            isVerified: false,
        });

        await submission.save();

        res.status(201).json({
            success: true,
            message: "Job submitted successfully and is pending verification.",
            submission,
        });
    } catch (error) {
        console.error("Submit Job Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to submit job. Please try again.",
        });
    }
};

module.exports = {
    submitJob,
};
