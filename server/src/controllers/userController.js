const User = require("../models/User");

const getProfile = async (req, res) => {
    res.json(req.User);
}
const updateProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    user.skills =
        req.body.skills || user.skills;

    user.education =
        req.body.education || user.education;

    user.experience =
        req.body.experience || user.experience;

    await user.save();

    res.json(user);
};
module.exports = {
    getProfile,
    updateProfile
};
