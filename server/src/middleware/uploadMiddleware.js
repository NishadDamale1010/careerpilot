const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(
            /[^a-zA-Z0-9._-]/g,
            "_"
        );

        cb(
            null,
            Date.now() + "-" + safeName
        );
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const isPdf =
            file.mimetype === "application/pdf" ||
            path.extname(file.originalname).toLowerCase() === ".pdf";

        if (!isPdf) {
            return cb(new Error("Only PDF files are allowed"));
        }

        cb(null, true);
    },
});

module.exports = upload;
