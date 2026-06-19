const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        // ── Auth ──────────────────────────────────────────────────────────────
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },

        // ── Career Profile ────────────────────────────────────────────────────
        jobTitle: { type: String, default: "" },             // "Full Stack Developer"
        bio: { type: String, default: "" },                  // short intro
        location: { type: String, default: "" },             // "Pune, India"
        experienceLevel: {
            type: String,
            enum: ["Student", "Entry Level", "Mid Level", "Senior Level", "Lead / Manager"],
            default: "Student",
        },
        preferredJobType: {
            type: String,
            enum: ["Any", "Full-time", "Part-time", "Internship", "Remote", "Contract"],
            default: "Any",
        },
        preferredSalary: { type: String, default: "" },      // "10 LPA – 15 LPA"
        openToWork: { type: Boolean, default: true },

        // ── Skills ────────────────────────────────────────────────────────────
        skills: [String],

        // ── Education & Experience (legacy text fields) ───────────────────────
        education: { type: String, default: "" },
        experience: { type: String, default: "" },

        // ── Social Links ──────────────────────────────────────────────────────
        linkedIn: { type: String, default: "" },
        github: { type: String, default: "" },
        portfolio: { type: String, default: "" },

        // ── Resume ────────────────────────────────────────────────────────────
        resumeUrl: String,
        resumeText: String,

        // ── Saved Jobs ────────────────────────────────────────────────────────
        savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);