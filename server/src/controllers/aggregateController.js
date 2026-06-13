const aggregateJobs = require("../services/aggregatorService");

const getAggregatedJobs = async (req, res) => {
    try {
        let jobs = await aggregateJobs();

        const { search, location } = req.query;

        if (search) {
            jobs = jobs.filter((job) =>
                job.title?.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (location) {
            jobs = jobs.filter((job) =>
                job.location?.toLowerCase().includes(location.toLowerCase())
            );
        }

        // Pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedJobs = jobs.slice(startIndex, endIndex);

        res.status(200).json({
            success: true,
            page,
            limit,
            totalJobs: jobs.length,
            totalPages: Math.ceil(jobs.length / limit),
            jobs: paginatedJobs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getAggregatedJobs,
};