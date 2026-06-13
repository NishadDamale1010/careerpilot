const fs = require("fs/promises");
const { PDFParse } = require("pdf-parse");
const User = require("../models/User");

const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a resume",
            });
        }

        const buffer = await fs.readFile(req.file.path);

        const parser = new PDFParse({ data: buffer });
        let data;

        try {
            data = await parser.getText();
        } finally {
            await parser.destroy();
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                resumeUrl: req.file.path,
                resumeText: data.text,
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json({
            message: "Resume uploaded successfully",
            resumeUrl: updatedUser.resumeUrl,
            extractedText: data.text || "",
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    uploadResume,
};
