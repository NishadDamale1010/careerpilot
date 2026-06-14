const fetchRemotiveJobs = require("./remotiveService");
const fetchRemoteOkJobs = require("./remoteOkService");
const fetchWellfoundJobs = require("./wellfoundService");

const aggregateJobs = async () => {
    const [remotiveJobs, remoteOkJobs,wellfoundJobs,] = await Promise.all([
        fetchRemotiveJobs(),
        fetchRemoteOkJobs(),
        fetchWellfoundJobs(),
        
    ]);

    const allJobs = [
        ...remotiveJobs,
        ...remoteOkJobs,
    ];

    const uniqueJobs = [];
    const seen = new Set();

    for (const job of allJobs) {
        const key = `${job.title?.toLowerCase().trim()}-${job.company?.toLowerCase().trim()}`;

        if (!seen.has(key)) {
            seen.add(key);
            uniqueJobs.push(job);
        }
    }

    // Sort newest jobs first
    uniqueJobs.sort(
        (a, b) =>
            new Date(b.postedAt || 0) -
            new Date(a.postedAt || 0)
    );

    return uniqueJobs;
};

module.exports = aggregateJobs;