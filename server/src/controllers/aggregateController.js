const AggregatedJob = require("../models/AggregatedJob");

const escapeRegex = (value) =>
    String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const toPositiveNumber = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0
        ? Math.floor(parsed)
        : fallback;
};

const getAggregatedJobs = async (req, res) => {
    try {
        const { search, location } = req.query;
        const filters = [];

        if (search) {
            const regex = new RegExp(escapeRegex(search), "i");
            filters.push({
                $or: [
                    { title: regex },
                    { company: regex },
                    { location: regex },
                    { source: regex },
                    { type: regex },
                ],
            });
        }

        if (location) {
            filters.push({
                location: new RegExp(escapeRegex(location), "i"),
            });
        }

        const query = filters.length ? { $and: filters } : {};
        const page = toPositiveNumber(req.query.page, 1);
        const limit = Math.min(
            toPositiveNumber(req.query.limit, 20),
            50
        );
        const skip = (page - 1) * limit;

        const [totalJobs, jobs] = await Promise.all([
            AggregatedJob.countDocuments(query),
            AggregatedJob.find(query)
                .sort({ postedAt: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
        ]);

        res.status(200).json({
            success: true,
            page,
            limit,
            totalJobs,
            totalPages: Math.max(
                Math.ceil(totalJobs / limit),
                1
            ),
            jobs,
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
