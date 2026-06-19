const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { applyToJob, getApplications, updateApplicationStatus } = require('../controllers/applicationController');

router.post('/', protect, applyToJob);
router.get('/', protect, getApplications);
router.put('/:id', protect, updateApplicationStatus);
router.patch('/:id/status', protect, updateApplicationStatus);

module.exports = router;
