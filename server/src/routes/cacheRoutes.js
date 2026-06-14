const express = require("express");
const router = express.Router();

const refreshJobCache = require("../services/jobCacheService");

router.post("/refresh", async (req, res) => {
    await refreshJobCache();

    res.json({
        success: true,
        message: "Cache refreshed",
    });
});

module.exports = router;