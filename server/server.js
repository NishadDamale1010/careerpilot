require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const connectDB = require('./src/config/db');
const startJobRefreshCron = require("./src/jobs/jobRefreshCron");

// Trust the reverse proxy (Render) so rate limiting can read the correct IP
app.set('trust proxy', 1);

// ── CONNECT DB & CRONS ────────────────────────────────────────────────────────
connectDB();
startJobRefreshCron();

// ── SECURITY MIDDLEWARE ───────────────────────────────────────────────────────
// 1. Set Security HTTP Headers (with cross-origin allowed for the API)
app.use(helmet({
    crossOriginResourcePolicy: false,
}));

// 2. Prevent NoSQL Injection
app.use(
    mongoSanitize({
        replaceWith: "_",
    })
);

app.use(cors({
    origin: true, // Reflects the incoming origin (allows cross-origin with credentials)
    credentials: true
}));

// 4. Rate Limiting (Global)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per `window`
    message: "Too many requests from this IP, please try again after 15 minutes.",
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', globalLimiter);

// 5. XML Attack Prevention (Strict Content-Type Check)
app.use((req, res, next) => {
    const contentType = req.headers['content-type'];
    if (contentType && (contentType.includes('xml') || contentType.includes('text/xml'))) {
        return res.status(415).json({ message: "XML format is not supported." });
    }
    next();
});

// ── BODY PARSERS ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── ROUTES ────────────────────────────────────────────────────────────────────
// Strict Rate Limiting for Auth
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15, // Limit each IP to 15 auth requests per window
    message: "Too many authentication attempts, please try again later."
});

const userRoutes = require('./src/routes/authRoutes');
const getuserRoutes = require('./src/routes/userRoutes');
const jobsRoutes = require('./src/routes/jobRoutes');
const savedJobRoutes = require('./src/routes/savedJobRoutes');
const applicationRoutes = require('./src/routes/applicationRoutes');
const resumeRoutes = require('./src/routes/resumeRoutes');
const matchRoutes = require('./src/routes/matchScoreRoutes');
const aggregatedJobsRoutes = require('./src/routes/aggregateRoutes');
const cacheRoutes = require("./src/routes/cacheRoutes");
const aiRoutes = require('./src/routes/aiRoutes');

app.use('/api/auth', authLimiter, userRoutes); // Auth limiter applied here
app.use('/api/users', getuserRoutes);
app.use('/api/jobs/aggregate', aggregatedJobsRoutes);
app.use('/api/jobs/saved', savedJobRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/saved-jobs', savedJobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/application', applicationRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/match', matchRoutes);
app.use("/api/cache", cacheRoutes);
app.use("/api/ai", aiRoutes);

// Health check route
app.get('/', (req, res) => {
    res.send('API is running properly. Secure & Deployment Ready.');
});

// ── GLOBAL ERROR HANDLER ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error(`[Error] ${err.message}`);

    // Hide stack trace in production
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[Server] listening on port ${PORT}`);
    console.log(`[Security] Helmet, Rate Limiting, and Mongo-Sanitize enabled.`);
});
