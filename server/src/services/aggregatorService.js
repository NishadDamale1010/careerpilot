const fetchRemotiveJobs = require("./remotiveService");

const aggregateJobs = async () => {
    const remotiveJobs = await fetchRemotiveJobs();

    return [...remotiveJobs];
};

module.exports = aggregateJobs;