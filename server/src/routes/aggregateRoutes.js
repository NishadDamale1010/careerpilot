const express = require('express');
const { getAggregatedJobs } = require('../controllers/aggregateController');
const router = express.Router();

router.get('/',getAggregatedJobs);
module.exports=router;
