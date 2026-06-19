const axios = require("axios");

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

// Currently supported Groq models (llama-3.1-70b-versatile is DECOMMISSIONED)
const SUPPORTED_MODELS = [
    "llama-3.3-70b-versatile",  // recommended replacement for 3.1
    "llama3-70b-8192",
    "llama3-8b-8192",
    "gemma2-9b-it",
];
const DECOMMISSIONED = ["llama-3.1-70b-versatile", "mixtral-8x7b-32768"];

// Use env var only if it's NOT a decommissioned model
const envModel = process.env.GROQ_STREAM_MODEL;
const MODEL = (envModel && !DECOMMISSIONED.includes(envModel))
    ? envModel
    : SUPPORTED_MODELS[0];

// POST /api/ai/coach
const coachChat = async (req, res) => {
    try {
        const { message, systemPrompt, history = [] } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ message: "Message is required" });
        }

        const messages = [
            {
                role: "system",
                content: systemPrompt || "You are CareerPilot AI, an expert career coach. Give actionable, specific, and encouraging advice.",
            },
            ...history.slice(-6).map(({ role, content }) => ({ role, content })),
            { role: "user", content: message.trim() },
        ];

        const response = await axios.post(
            `${GROQ_BASE_URL}/chat/completions`,
            {
                model: MODEL,
                messages,
                max_tokens: 1024,
                temperature: 0.7,
            },
            {
                headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json",
                },
                timeout: 30000,
            }
        );

        const reply = response.data?.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";
        res.status(200).json({ reply, model: MODEL });
    } catch (error) {
        console.error("AI Coach error:", error.response?.data || error.message);
        res.status(500).json({
            message: error.response?.data?.error?.message || "AI service temporarily unavailable. Please try again.",
        });
    }
};

// POST /api/ai/interview-questions
const generateInterviewQuestions = async (req, res) => {
    try {
        const { role, type = "both" } = req.body;

        if (!role || !role.trim()) {
            return res.status(400).json({ message: "Role is required" });
        }

        const typeInstructions = {
            technical: "Generate 10 technical interview questions only.",
            hr: "Generate 10 HR and behavioral interview questions only.",
            both: "Generate 10 interview questions: 6 technical and 4 HR/behavioral.",
        };

        const prompt = `${typeInstructions[type] || typeInstructions.both}

Role: ${role.trim()}

Return a JSON array of question objects. Each object must have:
- "question": string (the interview question)
- "type": "technical" or "hr" 
- "hint": string (a brief 1-2 sentence tip for answering this question)

Return ONLY valid JSON, no markdown, no extra text.`;

        const response = await axios.post(
            `${GROQ_BASE_URL}/chat/completions`,
            {
                model: MODEL,
                messages: [
                    { role: "system", content: "You are an expert interview coach. Always respond with valid JSON only, no markdown." },
                    { role: "user", content: prompt },
                ],
                max_tokens: 2048,
                temperature: 0.6,
            },
            {
                headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json",
                },
                timeout: 30000,
            }
        );

        const rawContent = response.data?.choices?.[0]?.message?.content || "[]";

        let questions;
        try {
            const cleaned = rawContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            questions = JSON.parse(cleaned);
        } catch {
            // Fallback questions if parsing fails
            questions = [
                { question: `Tell me about yourself and why you're interested in ${role}.`, type: "hr", hint: "Structure your answer: past experience, current skills, and why this role." },
                { question: `What's your greatest technical strength as a ${role}?`, type: "technical", hint: "Use a specific example with measurable impact." },
                { question: `Describe a challenging project you worked on and how you solved it.`, type: "hr", hint: "Use the STAR method: Situation, Task, Action, Result." },
                { question: `How do you stay updated with the latest technologies in your field?`, type: "hr", hint: "Mention specific resources: blogs, courses, conferences, open source." },
                { question: `Walk me through how you would design a scalable system.`, type: "technical", hint: "Start with requirements, discuss components, mention trade-offs." },
                { question: `How do you handle code reviews and feedback?`, type: "hr", hint: "Show openness to feedback and growth mindset." },
                { question: `Explain the concept of clean code and how you apply it.`, type: "technical", hint: "Mention readability, DRY principle, meaningful naming, comments." },
                { question: `Where do you see yourself in 5 years?`, type: "hr", hint: "Align your answer with the company's growth and your career goals." },
                { question: `How do you prioritize tasks when working on multiple projects?`, type: "hr", hint: "Discuss frameworks like Eisenhower matrix or Agile prioritization." },
                { question: `What's a recent technology or tool you learned and how did you use it?`, type: "technical", hint: "Be specific, describe the context and outcome." },
            ];
        }

        res.status(200).json({ questions, role, type });
    } catch (error) {
        console.error("Interview questions error:", error.response?.data || error.message);
        res.status(500).json({
            message: error.response?.data?.error?.message || "Failed to generate questions. Please try again.",
        });
    }
};

// GET /api/ai/learning-recommendations
const getLearningRecommendations = async (req, res) => {
    try {
        const User = require("../models/User");
        const user = await User.findById(req.user._id).select("skills");
        const userSkills = (user?.skills || []).map(s => s.toLowerCase());

        const allSkills = [
            "react", "node.js", "javascript", "typescript", "python", "mongodb",
            "sql", "docker", "aws", "git", "graphql", "machine learning",
        ];

        const missingSkills = allSkills.filter(s => !userSkills.some(u => u.includes(s) || s.includes(u)));

        res.status(200).json({
            userSkills: user?.skills || [],
            missingSkills: missingSkills.slice(0, 8),
            message: "Skill recommendations based on your profile",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { coachChat, generateInterviewQuestions, getLearningRecommendations };
