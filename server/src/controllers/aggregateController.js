const aggregateJobs = require("../services/aggregatorService");

const getAggregatedJobs = async (req, res) => {
    try {
        const jobs = await aggregateJobs();

        res.json({
            count: jobs.length,
            jobs,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    getAggregatedJobs,
};