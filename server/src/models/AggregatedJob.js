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
        description: String,
        salary: String,
        companyLogo: String,
        isRemote: { type: Boolean, default: false },

        uniqueKey: {
            type: String,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("AggregatedJob", aggregatedJobSchema);