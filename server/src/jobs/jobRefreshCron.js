const cron = require("node-cron");
const refreshJobCache = require("../services/jobCacheService");

const startJobRefreshCron = () => {
    refreshJobCache();
    cron.schedule("*/30 * * * *", async () => {
        console.log("Refreshing job cache...");

        try {
            await refreshJobCache();
            console.log("Job cache refreshed");
        } catch (error) {
            console.error(error.message);
        }
    });
};

module.exports = startJobRefreshCron;