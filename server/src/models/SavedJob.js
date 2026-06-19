const mongoose = require("mongoose");

const savedJobSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
        },

        externalJobId: String,

        title: String,
        company: String,
        location: String,
        source: String,
        applyUrl: String,
        type: String,
        postedAt: Date,
        uniqueKey: String,
    },
    {
        timestamps: true,
    }
);

savedJobSchema.index(
    { userId: 1, uniqueKey: 1 },
    {
        unique: true,
        partialFilterExpression: {
            uniqueKey: { $type: "string" },
        },
    }
);

module.exports = mongoose.model(
    "SavedJob",
    savedJobSchema
);
