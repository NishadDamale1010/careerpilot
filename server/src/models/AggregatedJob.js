const mongoose = require("mongoose");

const aggregatedJobSchema = new mongoose.Schema(
    {
        title: String,
        company: String,
        location: String,
        source: String,
        applyUrl: String,
        postedAt: Date,
        type: String,

        uniqueKey: {
            type: String,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "AggregatedJob",
    aggregatedJobSchema
);