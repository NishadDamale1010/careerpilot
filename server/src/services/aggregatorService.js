const fetchRemotiveJobs = require("./remotiveService");
const fetchRemoteOkJobs = require("./remoteOkService");
const fetchWellfoundJobs = require("./wellfoundService");
const fetchJSearchJobs = require("./JSearchService");
const fetchMuseJobs = require("./theMuseservice");
const fetchInternshalaJobs = require("./internshalaService");
const { calculateAdvancedTrustScore } = require("../utils/advancedTrustDetector");
const JobTrustScore = require("../models/JobTrustScore");

const normalizeJob = (job) => {
    const norm = {
        ...job,
        title: job.title?.trim(),
        company: job.company?.trim(),
        location: job.location?.trim() || "Remote",
        applyUrl: job.applyUrl || job.applyLink,
        postedAt: job.postedAt || job.postedDate,
    };

    const trustData = calculateAdvancedTrustScore(norm);
    
    norm.trustScore = trustData.trust_score;
    norm.suspicious = trustData.trust_score < 50;
    
    if (trustData.scam_flags.length > 0) {
        norm.suspiciousReasons = trustData.scam_flags.map(f => f.flag);
    }
    
    // Attach trustData temporarily to save it to the DB later
    norm._trustData = trustData;

    return norm;
};

const aggregateJobs = async () => {
    const results = await Promise.allSettled([
        fetchRemotiveJobs(),
        fetchRemoteOkJobs(),
        fetchWellfoundJobs(),
        fetchJSearchJobs(),
        fetchMuseJobs(),
        fetchInternshalaJobs(),
    ]);

    const SERVICE_COMPANIES = [
        "tata consultancy services", "tcs", "infosys", "wipro", "hcl", "hcltech", 
        "tech mahindra", "cognizant", "capgemini", "accenture", "ltimindtree", 
        "persistent systems", "oracle", "ibm", "deloitte", "pwc", "ey", "kpmg", 
        "ntt data", "mphasis", "hexaware", "birlasoft", "coforge", "virtusa",
        "cyient", "kpit", "zensar", "sonata software", "nagarro", "globallogic",
        "quest global", "l&t technology services", "larsen & toubro infotech", "amdocs",
        "genpact", "wns", "concentrix", "teleperformance", "sutherland", "foundever",
        "exl", "firstsource", "hgs", "ttec", "brillio", "publicis sapient", 
        "epam", "thoughtworks", "rackspace", "fujitsu", "dxc", "cgi"
    ];

    // Flatten all results, skip failed sources gracefully
    const allJobs = results
        .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
        .map(normalizeJob)
        .filter((job) => job.title && job.company)
        .filter((job) => {
            const companyLower = job.company.toLowerCase();
            // Strict Mode: Only allow Tier-1/Tier-2 service companies
            return SERVICE_COMPANIES.some(c => companyLower.includes(c));
        });

    // Deduplicate by title + company + applyUrl
    const uniqueJobs = [];
    const seen = new Set();

    for (const job of allJobs) {
        const key = [job.title, job.company, job.applyUrl]
            .filter(Boolean)
            .join("-")
            .toLowerCase();

        if (!seen.has(key)) {
            seen.add(key);
            uniqueJobs.push(job);
        }
    }

    // Newest first
    uniqueJobs.sort(
        (a, b) => new Date(b.postedAt || 0) - new Date(a.postedAt || 0)
    );

    return uniqueJobs;
};

module.exports = aggregateJobs;
