const express = require('express');
const { getAggregatedJobs, getJobById } = require('../controllers/aggregateController');
const router = express.Router();

router.get('/', getAggregatedJobs);
router.get('/:id', getJobById);
module.exports = router;
