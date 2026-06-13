const axios = require("axios");

const fetchRemotiveJobs = async () => {
    try {
        const response = await axios.get(
            "https://remotive.com/api/remote-jobs",
            { timeout: 8000 }
        );

        return response.data.jobs.map(job => ({
            title: job.title,
            company: job.company_name,
            location: job.candidate_required_location,
            source: "Remotive",
            applyLink: job.url,
            postedDate: job.publication_date,
            type: job.job_type,
        }));
    } catch (error) {
        console.log(error.message);
        return [];
    }
};

module.exports = fetchRemotiveJobs;
