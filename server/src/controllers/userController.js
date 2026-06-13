const User = require("../models/User");

const getProfile = async (req, res) => {
    res.json(req.user);
};

const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (req.body.skills !== undefined) {
            user.skills = Array.isArray(req.body.skills)
                ? req.body.skills
                : String(req.body.skills)
                    .split(",")
                    .map(skill => skill.trim())
                    .filter(Boolean);
        }

        if (req.body.education !== undefined) {
            user.education = req.body.education;
        }

        if (req.body.experience !== undefined) {
            user.experience = req.body.experience;
        }

        await user.save();

        const safeUser = user.toObject();
        delete safeUser.password;

        res.json(safeUser);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
module.exports = {
    getProfile,
    updateProfile
};
