const mongoose = require("mongoose");
require("dotenv").config();
const AggregatedJob = require("./src/models/AggregatedJob");
const SearchCache = require("./src/models/SearchCache");

async function purge() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB.");

        const jobRes = await AggregatedJob.deleteMany({});
        console.log(`Purged ${jobRes.deletedCount} jobs.`);

        const cacheRes = await SearchCache.deleteMany({});
        console.log(`Purged ${cacheRes.deletedCount} cache entries.`);

        console.log("Purge complete.");
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

purge();
