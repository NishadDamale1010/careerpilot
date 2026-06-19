const fs = require("fs/promises");
const { PDFParse } = require("pdf-parse");
const axios = require("axios");
const User = require("../models/User");

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

// Always use a current, non-decommissioned model
// llama-3.1-70b-versatile is decommissioned — use 3.3 instead
const GROQ_MODEL = "llama-3.3-70b-versatile";

// ── pdf-parse v2 helper ───────────────────────────────────────────────────────
// v2 API: new PDFParse({ data: buffer, verbosity: 0 }) → p.load() → p.getText()
// getText() returns { pages: [{ text: "..." }, ...] } — NOT { text: "..." }
const extractTextFromPdf = async (buffer) => {
    const parser = new PDFParse({ data: buffer, verbosity: 0 });
    await parser.load();
    const result = await parser.getText();

    // Flatten all pages into one text string
    if (result && result.pages && Array.isArray(result.pages)) {
        return result.pages.map((p) => p.text || "").join("\n");
    }
    // Fallback: result might just be a string in some edge cases
    if (typeof result === "string") return result;
    return "";
};

// ── Groq AI skill extraction ──────────────────────────────────────────────────
const extractSkillsWithAI = async (resumeText) => {
    const prompt = `You are a technical recruiter. Extract ALL technical and professional skills from this resume text.

Include: programming languages, frameworks, libraries, databases, cloud platforms, tools, methodologies, soft skills relevant to tech roles, certifications.

Resume text:
"""
${resumeText.slice(0, 6000)}
"""

Return ONLY a valid JSON array of skill strings. No markdown, no explanation. Example: ["React", "Node.js", "AWS", "Agile"]`;

    try {
        const response = await axios.post(
            `${GROQ_BASE_URL}/chat/completions`,
            {
                model: GROQ_MODEL,
                messages: [
                    {
                        role: "system",
                        content: "You are a precise skill extractor. Always return valid JSON arrays only.",
                    },
                    { role: "user", content: prompt },
                ],
                max_tokens: 1024,
                temperature: 0.2,
            },
            {
                headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json",
                },
                timeout: 20000,
            }
        );

        const raw = response.data?.choices?.[0]?.message?.content || "[]";
        const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const skills = JSON.parse(cleaned);
        if (Array.isArray(skills)) {
            return skills.map((s) => String(s).trim()).filter(Boolean);
        }
        return [];
    } catch (err) {
        console.error("[AI Skill Extraction failed]:", err.response?.data?.error?.message || err.message);
        return extractSkillsKeyword(resumeText); // fallback to keyword scan
    }
};

// ── Fallback keyword-based skill extraction ───────────────────────────────────
const KNOWN_SKILLS = [
    "JavaScript", "TypeScript", "React", "Redux", "Next.js", "Vue", "Angular",
    "Node.js", "Express", "NestJS", "Fastify",
    "MongoDB", "Mongoose", "PostgreSQL", "MySQL", "SQLite", "Redis", "Firebase",
    "HTML", "CSS", "Tailwind", "SCSS", "Sass",
    "Python", "Django", "Flask", "FastAPI",
    "Java", "Spring", "C++", "C#", ".NET", "Go", "Rust", "PHP", "Laravel",
    "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Terraform",
    "Git", "GitHub", "GitLab", "CI/CD", "Jenkins",
    "REST", "GraphQL", "WebSockets", "gRPC",
    "Machine Learning", "TensorFlow", "PyTorch", "LangChain", "OpenAI",
    "Data Analysis", "Pandas", "NumPy", "Excel", "Tableau", "Power BI",
    "Figma", "Photoshop", "Adobe XD", "Agile", "Scrum", "Jira",
    "Linux", "Bash", "PowerShell",
];

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const extractSkillsKeyword = (text) => {
    const normalized = text.toLowerCase().replace(/[^a-z0-9+#.\s]/g, " ");
    return KNOWN_SKILLS.filter((skill) => {
        const pattern = new RegExp(
            `(^|\\s)${escapeRegex(skill.toLowerCase())}(\\s|$)`
        );
        return pattern.test(normalized);
    });
};

const getWordCount = (text) => (text.match(/\S+/g) || []).length;

// ── POST /api/resume/upload ────────────────────────────────────────────────────
const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload a resume" });
        }

        const buffer = await fs.readFile(req.file.path);

        // Parse PDF using the correct pdf-parse v2 API
        let extractedText = "";
        try {
            extractedText = await extractTextFromPdf(buffer);
        } catch (parseErr) {
            console.error("[PDF Parse Error]:", parseErr.message);
            return res.status(422).json({
                message:
                    "Could not read the PDF. Please ensure it is a valid, text-based PDF resume (not a scanned image).",
            });
        }

        if (!extractedText || extractedText.trim().length < 50) {
            return res.status(422).json({
                message:
                    "The PDF appears to be image-based or empty. Please upload a text-based PDF resume.",
            });
        }

        const wordCount = getWordCount(extractedText);

        // Use Groq AI to perform structured resume parsing
        const { parseResumeWithGroq } = require("../services/resumeParserService");
        let parsedResume = null;
        let skills = [];

        if (GROQ_API_KEY) {
            parsedResume = await parseResumeWithGroq(extractedText);
            if (parsedResume && parsedResume.skills) {
                // Map structured skills back to simple array for backward compatibility
                skills = parsedResume.skills.map(s => s.skill || s);
            }
        } else {
            skills = extractSkillsKeyword(extractedText);
        }

        const matchScore = Math.min(100, Math.round((skills.length / 15) * 100));

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { resumeUrl: req.file.path, resumeText: extractedText, skills, parsedResume },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Resume uploaded and analysed successfully",
            resumeUrl: updatedUser.resumeUrl,
            extractedText,
            skills,
            wordCount,
            matchScore,
        });
    } catch (error) {
        console.error("[Resume Upload Error]:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// ── GET /api/resume/recommend-jobs ────────────────────────────────────────────
const recommendJobsForResume = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select("skills jobTitle experienceLevel preferredJobType location");
        const skills = user?.skills || [];

        // Use profile jobTitle as a strong role signal if set
        const profileTitle = user?.jobTitle || "";

        if (skills.length === 0) {
            return res.status(200).json({
                jobs: [],
                message: "Upload your resume first to get personalised job recommendations.",
                skills: [],
            });
        }

        // ── Detect the user's primary role from their skills ─────────────────
        const skillsLower = skills.map((s) => s.toLowerCase());

        const ROLE_SIGNALS = [
            { keywords: ["machine learning", "tensorflow", "pytorch", "langchain", "keras"], role: "Machine Learning Engineer" },
            { keywords: ["docker", "kubernetes", "terraform", "ci/cd", "jenkins"],          role: "DevOps Engineer" },
            { keywords: ["figma", "adobe xd", "ui", "ux", "wireframe"],                    role: "UI UX Designer" },
            { keywords: ["pandas", "numpy", "tableau", "power bi", "data analysis"],        role: "Data Analyst" },
            { keywords: ["react", "node.js", "express", "mongodb"],                         role: "Full Stack Developer" },
            { keywords: ["react", "next.js", "vue", "angular", "html", "css"],              role: "Frontend Developer" },
            { keywords: ["node.js", "express", "nestjs", "fastapi", "django", "flask"],     role: "Backend Developer" },
            { keywords: ["java", "spring", "c#", ".net", "hibernate"],                      role: "Java Developer" },
            { keywords: ["python", "django", "flask", "fastapi"],                           role: "Python Developer" },
        ];

        let detectedRole = "Software Developer";
        let bestMatchCount = 0;
        for (const { keywords, role } of ROLE_SIGNALS) {
            const matchCount = keywords.filter((k) => skillsLower.includes(k)).length;
            if (matchCount > bestMatchCount) {
                bestMatchCount = matchCount;
                detectedRole = role;
            }
        }

        // Profile jobTitle overrides auto-detected role (user set it explicitly)
        const finalRole = profileTitle || detectedRole;

        // Use meaningful skills (min 3 chars) to build a targeted query
        const meaningfulSkills = skills
            .filter((s) => s.length >= 3)
            .slice(0, 4)
            .join(" ");

        // Factor in preferred job type (e.g., "Internship", "Remote") if not "Any"
        const jobTypeHint = user?.preferredJobType && user.preferredJobType !== "Any"
            ? user.preferredJobType
            : "";

        const searchQuery = `${finalRole} ${meaningfulSkills} ${jobTypeHint}`.trim();

        console.log(`[Recommend Jobs] Role: "${finalRole}" | Type: "${jobTypeHint}" | Query: "${searchQuery}"`);

        // ── Try JSearch (RapidAPI) first for live, real-time jobs ─────────────
        let jobs = [];
        try {
            const { fetchJSearchJobsBySkills } = require("../services/JSearchService");
            jobs = await fetchJSearchJobsBySkills(searchQuery);
        } catch (err) {
            console.error("[JSearch skill search failed]:", err.message);
        }

        // ── Fallback: smarter MongoDB cached search by role + tech skills ─────
        if (!jobs || jobs.length === 0) {
            const AggregatedJob = require("../models/AggregatedJob");

            // Match on role keywords AND meaningful tech skills in job title
            const roleWords = detectedRole.split(" ").filter((w) => w.length > 3);
            const techWords = skills.filter((s) => s.length >= 4).slice(0, 6);
            const allSearchTerms = [...new Set([...roleWords, ...techWords])];
            const titleRegexes = allSearchTerms.map((w) => new RegExp(escapeRegex(w), "i"));

            jobs = await AggregatedJob.find({ title: { $in: titleRegexes } })
                .sort({ postedAt: -1, createdAt: -1 })
                .limit(20)
                .lean();
        }

        // ── 4. Use the new Advanced Algorithmic Matching Engine ──
        const { calculateJobMatch } = require("../services/matchingEngine");
        
        const jobsWithMatch = jobs.map((job) => {
            // We use simple job parsing here to avoid LLM rate limits on 20 jobs.
            // If we wanted to hit Groq, we'd do it async and cache it.
            const syntheticParsedJob = {
                required_skills: (skills || []).map(s => ({ skill: s, level: "intermediate", importance: "nice_to_have" })),
                experience_required: { years: 0 },
                education_required: "bachelors"
            };

            // Calculate exact Match Score based on the user's parsed resume
            const matchData = calculateJobMatch(user.parsedResume || { skills: user.skills.map(s => ({skill: s, proficiency_level: "intermediate"})) }, syntheticParsedJob, user.location, job.location);
            
            // Override with standard text match if AI parsedResume isn't available yet
            let matchScore = matchData?.overall_match || 0;
            let matchedSkills = matchData?.matched_skills || [];
            let missingSkills = matchData?.missing_skills || [];
            
            // Simple text fallback for skills if synthetic didn't catch it
            const jobText = `${job.title || ""} ${job.description || ""}`.toLowerCase();
            const textMatched = skills.filter(s => jobText.includes(s.toLowerCase()));
            if (textMatched.length > matchedSkills.length) {
                matchedSkills = textMatched;
                matchScore = Math.max(matchScore, Math.round((textMatched.length / Math.max(skills.length, 1)) * 100));
            }

            return { 
                ...job, 
                matchScore, 
                matchedSkills,
                missingSkills
            };
        });

        // Sort by Match Score (desc)
        jobsWithMatch.sort((a, b) => {
            const diff = (b.matchScore || 0) - (a.matchScore || 0);
            if (diff !== 0) return diff;
            return new Date(b.postedAt || 0) - new Date(a.postedAt || 0);
        });

        res.status(200).json({
            jobs: jobsWithMatch.slice(0, 12),
            skills,
            detectedRole,
            message: `Found ${jobsWithMatch.length} ${detectedRole} jobs matching your profile`,
        });
    } catch (error) {
        console.error("[Recommend Jobs Error]:", error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { uploadResume, recommendJobsForResume };
