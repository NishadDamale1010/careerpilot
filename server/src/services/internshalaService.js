const axios = require("axios");
const cheerio = require("cheerio");

const fetchInternshalaJobs = async () => {
    try {
        const { data } = await axios.get("https://internshala.com/internships/", {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5"
            },
            timeout: 8000
        });

        const $ = cheerio.load(data);
        const internships = [];

        $(".individual_internship").each((_, el) => {
            const title = $(el).find(".job-title-href").text().trim() || $(el).find(".heading_4_5.profile").text().trim();
            const company = $(el).find(".company_name").text().trim();
            const location = $(el).find(".location_link").text().trim() || "Remote";
            
            let applyUrl = $(el).attr("data-href") || $(el).find(".job-title-href").attr("href");
            if (applyUrl && !applyUrl.startsWith("http")) {
                applyUrl = `https://internshala.com${applyUrl}`;
            }

            if (title && company) {
                internships.push({
                    title,
                    company,
                    location,
                    type: "Internship",
                    source: "Internshala",
                    applyUrl,
                    postedAt: new Date().toISOString()
                });
            }
        });

        return internships;
    } catch (e) {
        console.error("[Internshala Fetch Error]:", e.message);
        return [];
    }
};

module.exports = fetchInternshalaJobs;
