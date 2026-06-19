const axios = require("axios");

const fetchWellfoundJobs = async () => {
    try {
        // Wellfound blocks direct scraping — return empty gracefully
        // Replace this with an official API or Apify actor if needed
        return [];
    } catch (err) {
        console.error("Wellfound fetch error:", err.message);
        return [];
    }
};

module.exports = fetchWellfoundJobs;