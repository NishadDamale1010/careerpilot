import api from "./api";

export const sendChatMessage = (message, systemPrompt, history = []) =>
    api.post("/ai/coach", { message, systemPrompt, history });

export const generateInterviewQuestions = (role, type = "both") =>
    api.post("/ai/interview-questions", { role, type });

export const getLearningRecommendations = () =>
    api.get("/ai/learning-recommendations");
