const express = require("express");
const router = express.Router();
const { submitJob } = require("../controllers/userSubmissionController");
const authMiddleware = require("../middlewares/authMiddleware");

// All submissions require authentication
router.post("/submit", authMiddleware, submitJob);

module.exports = router;
