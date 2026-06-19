const AggregatedJob = require("../models/AggregatedJob");
const JobTrustScore = require("../models/JobTrustScore");
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
            
            // Generate Trust Score records
            const uniqueKeys = operations.map(op => op.updateOne.filter.uniqueKey);
            const savedJobs = await AggregatedJob.find({ uniqueKey: { $in: uniqueKeys } }, '_id uniqueKey').lean();
            
            const keyToId = {};
            savedJobs.forEach(j => keyToId[j.uniqueKey] = j._id);
            
            const trustOperations = jobs.map(job => {
                const uniqueKey = [job.title, job.company, job.applyUrl].filter(Boolean).join("-").toLowerCase();
                const job_id = keyToId[uniqueKey];
                if (!job_id || !job._trustData) return null;
                
                return {
                    updateOne: {
                        filter: { job_id },
                        update: { $set: { job_id, ...job._trustData } },
                        upsert: true
                    }
                };
            }).filter(Boolean);
            
            if (trustOperations.length > 0) {
                await JobTrustScore.bulkWrite(trustOperations);
            }
        }

        console.log(`Cached ${jobs.length} jobs`);
    } catch (error) {
        console.error("Error refreshing cache:", error.message);
    }
};

module.exports = refreshJobCache;
