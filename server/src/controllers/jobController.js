const Job = require("../models/Job");

const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({
            postedDate: -1,
            createdAt: -1,
        });

        res.json(jobs);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    getJobs,
};
