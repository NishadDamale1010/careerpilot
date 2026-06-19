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
        trustScore: { type: Number, default: 100 },
        suspicious: { type: Boolean, default: false },
        suspiciousReasons: [String],

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