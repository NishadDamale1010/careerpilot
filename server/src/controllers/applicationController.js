const Application = require('../models/Application');
const Job = require('../models/Job');
const mongoose = require('mongoose');

const applyToJob = async (req, res) => {
    try {
        const { jobId } = req.body;

        if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                message: "Valid jobId is required",
            });
        }

        const jobExists = await Job.exists({ _id: jobId });

        if (!jobExists) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        const alreadyApplied =
            await Application.findOne({
                userId: req.user._id,
                jobId,
            });

        if (alreadyApplied) {
            return res.status(400).json({
                message: "Already applied",
            });
        }

        const application =
            await Application.create({
                userId: req.user._id,
                jobId,
            });

        res.status(201).json(application);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
const getApplications = async (req, res) => {
    try {

        const applications =
            await Application.find({
                userId: req.user._id,
            }).populate("jobId");

        res.json(applications);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
const updateApplicationStatus = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Valid application id is required",
            });
        }

        const application = await Application.findById(
            req.params.id
        );

        if (!application) {
            return res.status(404).json({
                message: "Application not found",
            });
        }

        if (
            application.userId.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "Unauthorized",
            });
        }

        const { status } = req.body;

        const allowedStatuses = [
            "Applied",
            "Interview",
            "Rejected",
            "Offer",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status",
            });
        }

        application.status = status;

        await application.save();

        res.json(application);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    applyToJob,
    getApplications,
    updateApplicationStatus,
};
