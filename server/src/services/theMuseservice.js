const axios = require("axios");

const fetchMuseJobs = async () => {
    try {
        const { data } = await axios.get(
            "https://www.themuse.com/api/public/jobs?page=1"
        );

        return (data.results || []).map((job) => ({
            title: job.name,
            company: job.company?.name || "Unknown",
            location: job.locations?.[0]?.name || "Remote",
            applyUrl: job.refs?.landing_page,
            source: "The Muse",
            postedAt: new Date(job.publication_date),
        }));
    } catch (err) {
        console.error("The Muse fetch error:", err.message);
        return [];
    }
};

module.exports = fetchMuseJobs;