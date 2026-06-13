const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { uploadResume } = require('../controllers/resumeController');

const handleResumeUpload = (req, res, next) => {
    upload.single('resume')(req, res, error => {
        if (error) {
            return res.status(400).json({
                message: error.message,
            });
        }

        next();
    });
};

router.post('/upload',protect,handleResumeUpload,uploadResume);
module.exports=router;
