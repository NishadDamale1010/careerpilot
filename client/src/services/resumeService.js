import api from "./api";

// Upload a PDF resume — returns skills, matchScore, wordCount
export const uploadResume = (formData) =>
    api.post("/resume/upload", formData);

// Get real-time job recommendations based on the user's saved skills
export const getRecommendedJobs = () =>
    api.get("/resume/recommend-jobs");
