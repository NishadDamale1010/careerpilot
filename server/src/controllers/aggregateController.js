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
        const { search, location, source, type } = req.query;
        const filters = [];

        if (search) {
            const SearchCache = require("../models/SearchCache");
            const { fetchJSearchJobsBySkills } = require("../services/JSearchService");
            const { calculateAdvancedTrustScore } = require("../utils/advancedTrustDetector");

            const normalizedQuery = search.toLowerCase().trim();
            const cacheEntry = await SearchCache.findOne({ query: normalizedQuery });
            
            // Check if older than 6 hours (6 * 60 * 60 * 1000)
            const SIX_HOURS = 6 * 60 * 60 * 1000;
            const isStale = !cacheEntry || (Date.now() - new Date(cacheEntry.lastFetchedAt).getTime() > SIX_HOURS);

            if (isStale) {
                console.log(`[Cache Miss] Fetching live jobs for: "${normalizedQuery}"`);
                try {
                    // Fetch live jobs
                    const liveJobs = await fetchJSearchJobsBySkills(normalizedQuery);
                    
                    if (liveJobs && liveJobs.length > 0) {
                        // Normalize and prepare for upsert
                        const bulkOps = liveJobs.map(job => {
                            const trustData = calculateAdvancedTrustScore(job);
                            return {
                                updateOne: {
                                    filter: { 
                                        title: job.title?.trim(), 
                                        company: job.company?.trim(), 
                                        applyUrl: job.applyUrl || job.applyLink 
                                    },
                                    update: {
                                        $set: {
                                            uniqueKey: [job.title, job.company, job.applyUrl || job.applyLink].filter(Boolean).join("-").toLowerCase(),
                                            title: job.title?.trim(),
                                            company: job.company?.trim(),
                                            location: job.location?.trim() || "Remote",
                                            description: job.description,
                                            applyUrl: job.applyUrl || job.applyLink,
                                            source: job.source,
                                            type: job.type || "Full-time",
                                            postedAt: job.postedAt || new Date(),
                                            salary: job.salary,
                                            companyLogo: job.companyLogo,
                                            isRemote: job.isRemote,
                                            trustScore: trustData.trust_score,
                                            suspicious: trustData.trust_score < 50,
                                            suspiciousReasons: trustData.scam_flags.length > 0 ? trustData.scam_flags.map(f => f.flag) : undefined
                                        }
                                    },
                                    upsert: true
                                }
                            };
                        });
                        
                        await AggregatedJob.bulkWrite(bulkOps, { ordered: false });
                    }

                    // Update or create cache entry
                    if (cacheEntry) {
                        cacheEntry.lastFetchedAt = Date.now();
                        await cacheEntry.save();
                    } else {
                        await SearchCache.create({ query: normalizedQuery });
                    }
                } catch (fetchErr) {
                    console.error("[Live Fetch Error during Search]:", fetchErr.message);
                }
            } else {
                console.log(`[Cache Hit] Using cached jobs for: "${normalizedQuery}"`);
            }

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

        if (source && source.toLowerCase() !== "all") {
            filters.push({
                source: new RegExp(`^${escapeRegex(source)}$`, "i"),
            });
        }

        if (type && type.toLowerCase() !== "all") {
            if (type.toLowerCase() === "remote") {
                filters.push({
                    $or: [
                        { isRemote: true },
                        { location: new RegExp("remote", "i") },
                    ],
                });
            } else {
                const typeRegex = new RegExp(escapeRegex(type), "i");
                filters.push({
                    $or: [
                        { type: typeRegex },
                        { title: typeRegex },
                    ],
                });
            }
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

const getJobById = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await AggregatedJob.findById(id).lean();
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }
        res.status(200).json({ success: true, job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAggregatedJobs,
    getJobById
};
