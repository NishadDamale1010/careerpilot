const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    saveJob,
    getSavedJobs,
} = require("../controllers/savedJobController");

router.post("/", protect, saveJob);

router.get("/", protect, getSavedJobs);

module.exports = router;