const mongoose = require("mongoose");
const AggregatedJob = require("../models/AggregatedJob");
const Job = require("../models/Job");
const SavedJob = require("../models/SavedJob");

const clean = (value) =>
    typeof value === "string" ? value.trim() : value;

const normalizeUniqueKey = (job) =>
    [
        job.applyUrl,
        job.title,
        job.company,
        job.location,
    ]
        .filter(Boolean)
        .map((value) => String(value).trim().toLowerCase())
        .join("|");

const buildSavedJob = (sourceJob, body) => ({
    title: clean(body.title) || clean(sourceJob?.title),
    company: clean(body.company) || clean(sourceJob?.company),
    location:
        clean(body.location) ||
        clean(sourceJob?.location) ||
        "Remote",
    source: clean(body.source) || clean(sourceJob?.source),
    applyUrl:
        clean(body.applyUrl) ||
        clean(body.applyLink) ||
        clean(sourceJob?.applyUrl) ||
        clean(sourceJob?.applyLink),
    type: clean(body.type) || clean(sourceJob?.type),
    postedAt:
        body.postedAt ||
        body.postedDate ||
        sourceJob?.postedAt ||
        sourceJob?.postedDate,
});

const findSourceJob = async (jobId) => {
    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
        return null;
    }

    const aggregatedJob = await AggregatedJob.findById(jobId).lean();

    if (aggregatedJob) {
        return {
            job: aggregatedJob,
            isLocalJob: false,
        };
    }

    const localJob = await Job.findById(jobId).lean();

    if (localJob) {
        return {
            job: localJob,
            isLocalJob: true,
        };
    }

    return null;
};

const saveJob = async (req, res) => {
    try {
        const requestedJobId = req.params.jobId || req.body.jobId;
        const source = await findSourceJob(requestedJobId);
        const savedJobData = buildSavedJob(source?.job, req.body || {});

        if (!savedJobData.title || !savedJobData.company) {
            return res.status(400).json({
                message: "Job title and company are required",
            });
        }

        savedJobData.uniqueKey = normalizeUniqueKey(savedJobData);

        if (!savedJobData.uniqueKey) {
            return res.status(400).json({
                message: "Unable to identify job",
            });
        }

        if (source?.isLocalJob) {
            savedJobData.jobId = requestedJobId;
        } else if (requestedJobId) {
            savedJobData.externalJobId = requestedJobId;
        }

        const exists = await SavedJob.findOne({
            userId: req.user._id,
            uniqueKey: savedJobData.uniqueKey,
        });

        if (exists) {
            return res.status(400).json({
                message: "Already saved",
            });
        }

        const savedJob = await SavedJob.create({
            userId: req.user._id,
            ...savedJobData,
        });

        res.status(201).json(savedJob);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Already saved",
            });
        }

        res.status(500).json({
            message: error.message,
        });
    }
};

const getSavedJobs = async (req, res) => {
    try {
        const savedJobs = await SavedJob.find({
            userId: req.user._id,
        })
            .populate("jobId")
            .sort({ createdAt: -1 })
            .lean();

        res.json(savedJobs);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const removeSavedJob = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Valid saved job id is required" });
        }

        const savedJob = await SavedJob.findById(id);

        if (!savedJob) {
            return res.status(404).json({ message: "Saved job not found" });
        }

        if (savedJob.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await SavedJob.findByIdAndDelete(id);
        res.status(200).json({ message: "Job removed from saved list" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    saveJob,
    getSavedJobs,
    removeSavedJob,
};
