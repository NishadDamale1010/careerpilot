const AggregatedJob = require("../models/AggregatedJob");
const aggregateJobs = require("./aggregatorService");

const refreshJobCache = async () => {
    try {
        const jobs = await aggregateJobs();

        const operations = jobs
            .filter((job) => job.title && job.company)
            .map((job) => {
                const uniqueKey = [
                    job.title,
                    job.company,
                    job.applyUrl,
                ]
                    .filter(Boolean)
                    .join("-")
                    .toLowerCase();

                return {
                    updateOne: {
                        filter: { uniqueKey },
                        update: {
                            $set: {
                                ...job,
                                uniqueKey,
                            },
                        },
                        upsert: true,
                    },
                };
            });

        if (operations.length > 0) {
            await AggregatedJob.bulkWrite(operations);
        }

        console.log(`Cached ${jobs.length} jobs`);
    } catch (error) {
        console.error("Error refreshing cache:", error.message);
    }
};

module.exports = refreshJobCache;
