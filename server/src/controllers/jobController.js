const Job = require('../models/Job');

const getJobs = async (req, res) => {
    try {
        const query = {};

        // Search by title
        if (req.query.keyword) {
            query.title = {
                $regex: req.query.keyword,
                $options: 'i',
            };
        }

        // Filter by location
        if (req.query.location) {
            query.location = req.query.location;
        }

        // Filter by job type
        if (req.query.type) {
            query.type = req.query.type;
        }

        const jobs = await Job.find(query);

        res.status(200).json(jobs);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    getJobs,
};