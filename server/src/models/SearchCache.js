const mongoose = require("mongoose");

const SearchCacheSchema = new mongoose.Schema(
    {
        query: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        lastFetchedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("SearchCache", SearchCacheSchema);
