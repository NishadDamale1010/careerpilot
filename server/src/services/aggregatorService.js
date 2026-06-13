const fetchRemotiveJobs = require("./remotiveService");
const fetchRemoteOkJobs = require("./remoteOkService");

const aggregateJobs = async () => {
    const [remotiveJobs, remoteOkJobs] = await Promise.all([
        fetchRemotiveJobs(),
        fetchRemoteOkJobs(),
    ]);

    return [
        ...remotiveJobs,
        ...remoteOkJobs,
    ];
};

module.exports = aggregateJobs;