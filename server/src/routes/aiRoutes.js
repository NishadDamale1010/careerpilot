const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { coachChat, generateInterviewQuestions, getLearningRecommendations } = require("../controllers/aiController");

// POST /api/ai/coach — AI career coach chat
router.post("/coach", auth, coachChat);

// POST /api/ai/interview-questions — generate interview questions
router.post("/interview-questions", auth, generateInterviewQuestions);

// GET /api/ai/learning-recommendations — skill-based learning
router.get("/learning-recommendations", auth, getLearningRecommendations);

module.exports = router;
