const mongoose = require("mongoose");

const userJobMatchSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: "AggregatedJob", required: true },
    
    // Scores
    overall_match: { type: Number, min: 0, max: 100, required: true },
    skill_match: { type: Number, min: 0, max: 100, default: 0 },
    experience_match: { type: Number, min: 0, max: 100, default: 0 },
    education_match: { type: Number, min: 0, max: 100, default: 0 },
    location_match: { type: Number, min: 0, max: 100, default: 0 },
    salary_match: { type: Number, min: 0, max: 100, default: 0 },
    
    // Details
    matched_skills: [String],
    missing_skills: [String],
    
    // AI Recommendations
    improvement_suggestions: [{
        skill: String,
        priority: { type: String, enum: ["high", "medium", "low"] },
        timeToLearn: String
    }],
    
    // Meta
    match_confidence: { type: Number, min: 0, max: 1, default: 0.9 },
    calculated_at: { type: Date, default: Date.now }
});

// Ensure a user has only one match record per job
userJobMatchSchema.index({ user_id: 1, job_id: 1 }, { unique: true });

module.exports = mongoose.model("UserJobMatch", userJobMatchSchema);
