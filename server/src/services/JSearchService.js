const axios = require("axios");

// ── Generic JSearch query ─────────────────────────────────────────────────────
const fetchJSearchJobs = async (query = "software engineer india") => {
    try {
        const response = await axios.get(
            "https://jsearch.p.rapidapi.com/search",
            {
                params: {
                    query,
                    page: "1",
                    num_pages: "1",
                    date_posted: "month",
                },
                headers: {
                    "X-RapidAPI-Key": process.env.RAPID_API_KEY,
                    "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
                },
                timeout: 10000,
            }
        );

        return normalizeJSearchResults(response.data?.data || []);
    } catch (error) {
        console.error("JSearch Error:", error.response?.data || error.message);
        return [];
    }
};

// ── Skill-based JSearch query (used for resume recommendations) ───────────────
const fetchJSearchJobsBySkills = async (skillsQuery = "software developer") => {
    if (!process.env.RAPID_API_KEY) {
        console.warn("[JSearch] RAPID_API_KEY not set — skipping JSearch.");
        return [];
    }

    try {
        const response = await axios.get(
            "https://jsearch.p.rapidapi.com/search",
            {
                params: {
                    query: skillsQuery,
                    page: "1",
                    num_pages: "2",       // 2 pages = up to 20 fresh jobs
                    date_posted: "month", // only jobs posted in the last month
                },
                headers: {
                    "X-RapidAPI-Key": process.env.RAPID_API_KEY,
                    "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
                },
                timeout: 12000,
            }
        );

        const jobs = normalizeJSearchResults(response.data?.data || []);
        console.log(`[JSearch] Fetched ${jobs.length} jobs for query: "${skillsQuery}"`);
        return jobs;
    } catch (error) {
        console.error(
            "[JSearch Skill Search Error]:",
            error.response?.data?.message || error.message
        );
        return [];
    }
};

// ── Shared normalizer ─────────────────────────────────────────────────────────
const normalizeJSearchResults = (data) =>
    data.map((job) => ({
        title: job.job_title,
        company: job.employer_name,
        location: job.job_city
            ? `${job.job_city}${job.job_country ? ", " + job.job_country : ""}`
            : job.job_country || "Remote",
        description: (job.job_description || "").slice(0, 500),
        applyUrl: job.job_apply_link,
        source: "JSearch",
        type: job.job_employment_type || "Full-time",
        postedAt: job.job_posted_at_datetime_utc,
        salary:
            job.job_min_salary && job.job_max_salary
                ? `${job.job_min_salary} – ${job.job_max_salary} ${job.job_salary_currency || "USD"}`
                : job.job_salary_period
                ? `${job.job_salary_period} basis`
                : null,
        companyLogo: job.employer_logo || null,
        isRemote: job.job_is_remote || false,
    }));

module.exports = fetchJSearchJobs;
module.exports.fetchJSearchJobsBySkills = fetchJSearchJobsBySkills;