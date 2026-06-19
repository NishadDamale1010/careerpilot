const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { saveJob, getSavedJobs, removeSavedJob } = require("../controllers/savedJobController");

router.post("/", protect, saveJob);
router.get("/", protect, getSavedJobs);
router.delete("/:id", protect, removeSavedJob);

module.exports = router;