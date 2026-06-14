require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./src/config/db');
const startJobRefreshCron = require("./src/jobs/jobRefreshCron");
connectDB();
startJobRefreshCron();
const userRoutes = require('./src/routes/authRoutes');
const getuserRoutes = require('./src/routes/userRoutes');
const jobsRoutes = require('./src/routes/jobRoutes');
const savedJobRoutes = require('./src/routes/savedJobRoutes');
const applicationRoutes = require('./src/routes/applicationRoutes');
const resumeRoutes = require('./src/routes/resumeRoutes');
const matchRoutes = require('./src/routes/matchScoreRoutes');
const aggregatedJobsRoutes=require('./src/routes/aggregateRoutes');
const cacheRoutes = require("./src/routes/cacheRoutes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', userRoutes);
app.use('/api/users', getuserRoutes);
app.use('/api/jobs/aggregate',aggregatedJobsRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/saved-jobs',savedJobRoutes); 
app.use('/api/application',applicationRoutes);
app.use('/api/resume',resumeRoutes);
app.use('/api/match',matchRoutes);
app.use("/api/cache", cacheRoutes);

app.get('/', (req, res) => {
    res.send('Api is working');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
});
