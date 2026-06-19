const User = require("../models/User");

const ALLOWED_FIELDS = [
    "name", "jobTitle", "bio", "location",
    "experienceLevel", "preferredJobType", "preferredSalary",
    "openToWork", "education", "experience",
    "linkedIn", "github", "portfolio",
];

const safeUser = (user) => {
    const obj = user.toObject ? user.toObject() : { ...user };
    delete obj.password;
    delete obj.resumeText; // too large for profile responses
    return obj;
};

// GET /api/users/profile  — return authenticated user's profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password -resumeText");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/users/profile  — update profile fields
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Update simple text / boolean fields
        for (const field of ALLOWED_FIELDS) {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        }

        // Skills — accept array or comma-separated string
        if (req.body.skills !== undefined) {
            user.skills = Array.isArray(req.body.skills)
                ? req.body.skills.map((s) => String(s).trim()).filter(Boolean)
                : String(req.body.skills)
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean);
        }

        await user.save();
        res.json(safeUser(user));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getProfile, updateProfile };
