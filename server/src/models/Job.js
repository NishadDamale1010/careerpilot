const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        company: {
            type: String,
            required: true,
        },

        location: {
            type: String,
            default: "Remote",
        },

        type: {
            type: String,
            enum: ["Internship", "Full-Time"],
            default: "Internship",
        },

        skills: [String],

        salary: String,

        description: String,

        applyLink: String,

        source: String,

        postedDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Job", jobSchema);