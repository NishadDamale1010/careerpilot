const Job = require("../models/Job");
const User = require("../models/User");
const mongoose = require("mongoose");

const normalizeSkills = skills =>
    Array.isArray(skills)
        ? skills
            .map(skill => String(skill).trim().toLowerCase())
            .filter(Boolean)
        : [];

const getMatchScore = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.jobId)) {
            return res.status(400).json({
                message: "Valid jobId is required",
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        const userSkills = normalizeSkills(user.skills);

        const jobSkills = normalizeSkills(job.skills);

        const matchedSkills = jobSkills.filter(skill =>
            userSkills.includes(skill)
        );

        const missingSkills = jobSkills.filter(skill =>
            !userSkills.includes(skill)
        );

        const score =
            jobSkills.length === 0
                ? 0
                : Math.round(
                    (matchedSkills.length /
                        jobSkills.length) *
                    100
                );

        res.status(200).json({
            score,
            matchedSkills,
            missingSkills,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    getMatchScore,
};
