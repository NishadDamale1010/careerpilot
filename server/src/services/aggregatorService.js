const fetchRemotiveJobs = require("./remotiveService");
const fetchRemoteOkJobs = require("./remoteOkService");
const fetchWellfoundJobs = require("./wellfoundService");
const fetchJSearchJobs = require("./JSearchService");
const fetchMuseJobs = require("./theMuseservice");
const fetchInternshalaJobs = require("./internshalaService");
const { detectFakeJob } = require("../utils/fakeJobDetector");

const normalizeJob = (job) => {
    const norm = {
        ...job,
        title: job.title?.trim(),
        company: job.company?.trim(),
        location: job.location?.trim() || "Remote",
        applyUrl: job.applyUrl || job.applyLink,
        postedAt: job.postedAt || job.postedDate,
    };

    const fakeCheck = detectFakeJob(norm);
    
    // Convert penalty score to a 0-100 Trust Score
    norm.trustScore = Math.max(0, 100 - fakeCheck.score);
    norm.suspicious = fakeCheck.isSuspicious;
    if (fakeCheck.reasons.length > 0) {
        norm.suspiciousReasons = fakeCheck.reasons;
    }

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

    // Flatten all results, skip failed sources gracefully
    const allJobs = results
        .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
        .map(normalizeJob)
        .filter((job) => job.title && job.company);

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
