const SavedJob = require("../models/SavedJob");

const saveJob = async (req, res) => {
    try {
        const { jobId } = req.body;

        const exists = await SavedJob.findOne({
            userId: req.user._id,
            jobId,
        });

        if (exists) {
            return res.status(400).json({
                message: "Already saved",
            });
        }

        const savedJob = await SavedJob.create({
            userId: req.user._id,
            jobId,
        });

        res.status(201).json(savedJob);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getSavedJobs = async (req, res) => {
    try {
        const savedJobs = await SavedJob.find({
            userId: req.user._id,
        }).populate("jobId");

        res.json(savedJobs);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    saveJob,
    getSavedJobs,
};