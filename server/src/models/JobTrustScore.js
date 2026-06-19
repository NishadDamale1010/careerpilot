const mongoose = require("mongoose");

const flagSchema = new mongoose.Schema({
    flag: String,
    severity: { type: String, enum: ["high", "medium", "low"] },
    points: Number
}, { _id: false });

const jobTrustScoreSchema = new mongoose.Schema({
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: "AggregatedJob", required: true },
    
    // Scores
    trust_score: { type: Number, min: 0, max: 100, default: 100 },
    company_score: { type: Number, min: 0, max: 100 },
    job_quality_score: { type: Number, min: 0, max: 100 },
    recruiter_score: { type: Number, min: 0, max: 100 },
    email_authenticity: { type: Number, min: 0, max: 100 },
    
    // Verification
    company_verified: { type: Boolean, default: false },
    domain_verified: { type: Boolean, default: false },
    
    // Flags
    scam_flags: [flagSchema],
    red_flags_count: { type: Number, default: 0 },
    
    // AI Scam Analysis
    scam_probability: { type: Number, min: 0, max: 1, default: 0 },
    scam_type: { type: String, default: null },
    ai_explanation: { type: String, default: null },
    
    // Meta
    confidence: { type: Number, min: 0, max: 1, default: 0.8 },
    checked_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("JobTrustScore", jobTrustScoreSchema);
