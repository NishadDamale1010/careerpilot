import api from "./api";

export const getAggregatedJobs = (params = {}) =>
    api.get("/jobs/aggregate", { params });

export const getSavedJobs = () =>
    api.get("/saved-jobs");

export const saveJob = (job) =>
    api.post("/saved-jobs", {
        jobId: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        source: job.source,
        applyUrl: job.applyUrl || job.applyLink,
        type: job.type,
        postedAt: job.postedAt || job.postedDate,
    });

export const removeSavedJob = (savedJobId) =>
    api.delete(`/saved-jobs/${savedJobId}`);

export const getMatchedJobs = (params = {}) =>
    api.get("/jobs/aggregate", { params: { ...params, limit: 50 } });
