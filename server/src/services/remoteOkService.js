const axios = require("axios");

const fetchRemoteOkJobs = async () => {
    try {
        const { data } = await axios.get(
            "https://remoteok.com/api",
            {
                headers: {
                    "User-Agent": "Mozilla/5.0",
                },
            }
        );

        // First element is metadata
        const jobs = data.slice(1);

        return jobs.map((job) => ({
            title: job.position,
            company: job.company,
            location: job.location || "Remote",
            source: "RemoteOK",
            applyUrl: job.url,
            postedAt: job.date,
            type: "Remote",
        }));
    } catch (error) {
        console.error("RemoteOK Error:", error.message);
        return [];
    }
};

module.exports = fetchRemoteOkJobs;