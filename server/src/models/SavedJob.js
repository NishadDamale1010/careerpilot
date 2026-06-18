const mongoose = require("mongoose");

const savedJobSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: String,
        company: String,
        location: String,
        source: String,
        applyUrl: String,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "SavedJob",
    savedJobSchema
);