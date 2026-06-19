const express = require('express');
const router = express.Router();
const { getJobs } = require('../controllers/jobController');
const { saveJob } = require('../controllers/savedJobController');
const protect = require('../middleware/authMiddleware');

router.get('/', getJobs);
router.post('/:jobId/save', protect, saveJob);

module.exports = router;
