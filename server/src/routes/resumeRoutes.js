const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { uploadResume, recommendJobsForResume } = require('../controllers/resumeController');

// Multer error handler wrapper
const handleResumeUpload = (req, res, next) => {
    upload.single('resume')(req, res, (error) => {
        if (error) {
            return res.status(400).json({ message: error.message });
        }
        next();
    });
};

// POST /api/resume/upload  — upload + analyse PDF, extract skills via AI
router.post('/upload', protect, handleResumeUpload, uploadResume);

// GET /api/resume/recommend-jobs — real jobs matched to user's extracted skills
router.get('/recommend-jobs', protect, recommendJobsForResume);

module.exports = router;
