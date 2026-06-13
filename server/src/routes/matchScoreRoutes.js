const express = require("express");
const router = express.Router();

const { getMatchScore } =
    require("../controllers/matchScoreController");

const protect =
    require("../middleware/authMiddleware");

router.get(
    "/:jobId",
    protect,
    getMatchScore
);

module.exports = router;
