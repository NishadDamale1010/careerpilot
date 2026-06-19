import { useState } from "react";

const ROADMAPS = [
    {
        id: "frontend",
        title: "Frontend Developer",
        icon: "🎨",
        color: "#06b6d4",
        bg: "rgba(6,182,212,0.1)",
        border: "rgba(6,182,212,0.2)",
        desc: "Build beautiful, interactive web interfaces",
        steps: [
            { title: "HTML & CSS Basics", desc: "Learn semantic HTML5, CSS3, Flexbox, Grid, and responsive design.", resources: ["MDN Web Docs", "freeCodeCamp", "CSS-Tricks"] },
            { title: "JavaScript Fundamentals", desc: "Variables, functions, DOM manipulation, ES6+, async/await.", resources: ["javascript.info", "Eloquent JavaScript", "freeCodeCamp"] },
            { title: "React.js", desc: "Components, hooks, state management, React Router, Context API.", resources: ["React Docs", "Scrimba React Course", "Net Ninja YouTube"] },
            { title: "TypeScript", desc: "Types, interfaces, generics, and TypeScript with React.", resources: ["TypeScript Docs", "Matt Pocock's Total TypeScript"] },
            { title: "State Management", desc: "Redux Toolkit, Zustand, or Jotai for complex app state.", resources: ["Redux Docs", "Zustand GitHub"] },
            { title: "Build Tools & Testing", desc: "Vite, Webpack, Jest, React Testing Library, Playwright.", resources: ["Vite Docs", "Testing Library Docs"] },
            { title: "Performance & Accessibility", desc: "Core Web Vitals, Lighthouse, WCAG standards, lazy loading.", resources: ["web.dev", "a11y Project"] },
            { title: "Portfolio & Job Search", desc: "Build 3 projects, create GitHub profile, apply to jobs.", resources: ["CareerPilot Jobs →"] },
        ],
    },
    {
        id: "backend",
        title: "Backend Developer",
        icon: "⚙️",
        color: "#10b981",
        bg: "rgba(16,185,129,0.1)",
        border: "rgba(16,185,129,0.2)",
        desc: "Build scalable APIs and server-side applications",
        steps: [
            { title: "Programming Fundamentals", desc: "Choose Node.js, Python, or Java. Learn OOP, data structures, algorithms.", resources: ["CS50", "freeCodeCamp", "LeetCode"] },
            { title: "Node.js & Express", desc: "HTTP, REST APIs, middleware, routing, error handling.", resources: ["Node.js Docs", "Express Docs", "Net Ninja"] },
            { title: "Databases", desc: "SQL (PostgreSQL), NoSQL (MongoDB), ORM/ODM (Prisma, Mongoose).", resources: ["PostgreSQL Tutorial", "MongoDB University"] },
            { title: "Authentication & Security", desc: "JWT, OAuth2, bcrypt, CORS, rate limiting, OWASP.", resources: ["Auth0 Blog", "OWASP Guide"] },
            { title: "API Design", desc: "RESTful principles, GraphQL, OpenAPI/Swagger documentation.", resources: ["REST API Tutorial", "GraphQL Docs"] },
            { title: "Caching & Performance", desc: "Redis, database indexing, query optimization, load balancing.", resources: ["Redis Docs", "High Scalability Blog"] },
            { title: "Cloud & Deployment", desc: "AWS/GCP/Azure, Docker, CI/CD pipelines, monitoring.", resources: ["AWS Free Tier", "Docker Docs"] },
            { title: "System Design", desc: "Microservices, message queues, event-driven architecture.", resources: ["System Design Primer", "ByteByteGo"] },
        ],
    },
    {
        id: "fullstack",
        title: "Full Stack Developer",
        icon: "🔥",
        color: "#2563eb",
        bg: "rgba(37,99,235,0.1)",
        border: "rgba(37,99,235,0.2)",
        desc: "Master both frontend and backend development",
        steps: [
            { title: "HTML, CSS & JavaScript", desc: "The holy trinity of the web. Master all three deeply.", resources: ["MDN", "javascript.info"] },
            { title: "React & Node.js", desc: "Learn the MERN stack: MongoDB, Express, React, Node.", resources: ["Traversy Media", "Academind"] },
            { title: "Databases (SQL + NoSQL)", desc: "PostgreSQL for relational, MongoDB for document stores.", resources: ["PostgreSQL Docs", "MongoDB University"] },
            { title: "TypeScript Full Stack", desc: "Type-safe frontend + backend with shared types.", resources: ["Total TypeScript", "tRPC Docs"] },
            { title: "Authentication", desc: "Sessions, JWT, OAuth, NextAuth, Passport.js.", resources: ["Auth0 Docs", "Passport.js"] },
            { title: "Deployment & DevOps", desc: "Vercel, Railway, Docker, GitHub Actions CI/CD.", resources: ["Vercel Docs", "Railway"] },
            { title: "Build Full Projects", desc: "Create a SaaS product or clone of a real app.", resources: ["shadcn/ui", "Vercel Templates"] },
            { title: "System Design Basics", desc: "Caching, load balancing, database scaling basics.", resources: ["System Design Primer"] },
        ],
    },
    {
        id: "ai",
        title: "AI Engineer",
        icon: "🧠",
        color: "#f59e0b",
        bg: "rgba(245,158,11,0.1)",
        border: "rgba(245,158,11,0.2)",
        desc: "Build intelligent applications and AI systems",
        steps: [
            { title: "Python Programming", desc: "Core Python, NumPy, Pandas, Matplotlib, Jupyter.", resources: ["Python Docs", "freeCodeCamp", "Kaggle"] },
            { title: "Mathematics", desc: "Linear algebra, calculus, statistics, and probability.", resources: ["3Blue1Brown", "Khan Academy", "StatQuest"] },
            { title: "Machine Learning", desc: "Supervised/unsupervised learning, scikit-learn, model evaluation.", resources: ["Coursera ML Specialization", "fast.ai"] },
            { title: "Deep Learning", desc: "Neural networks, CNNs, RNNs, transformers, PyTorch/TensorFlow.", resources: ["Deep Learning Book", "fast.ai", "Andrej Karpathy"] },
            { title: "NLP & LLMs", desc: "Hugging Face, fine-tuning, prompt engineering, RAG, LangChain.", resources: ["Hugging Face Course", "LangChain Docs"] },
            { title: "MLOps", desc: "Model deployment, monitoring, MLflow, Docker, cloud services.", resources: ["MLOps Community", "Weights & Biases"] },
            { title: "AI APIs & Integration", desc: "OpenAI API, Gemini, Groq, building AI-powered applications.", resources: ["OpenAI Docs", "Groq Docs"] },
            { title: "AI Projects Portfolio", desc: "Build 3 projects: chatbot, image classifier, recommendation system.", resources: ["Papers With Code", "ArXiv"] },
        ],
    },
    {
        id: "datascience",
        title: "Data Scientist",
        icon: "📊",
        color: "#1d4ed8",
        bg: "rgba(29,78,216,0.1)",
        border: "rgba(29,78,216,0.2)",
        desc: "Extract insights from data with statistical methods",
        steps: [
            { title: "Python & Data Libraries", desc: "Python, NumPy, Pandas, Matplotlib, Seaborn, Jupyter.", resources: ["freeCodeCamp", "Kaggle Python Course"] },
            { title: "Statistics & Probability", desc: "Descriptive stats, hypothesis testing, distributions, Bayesian.", resources: ["StatQuest", "Khan Academy", "Think Stats"] },
            { title: "Data Wrangling & EDA", desc: "Cleaning, transforming, and exploring datasets effectively.", resources: ["Kaggle Datasets", "Pandas Docs"] },
            { title: "Machine Learning", desc: "Regression, classification, clustering, scikit-learn pipeline.", resources: ["Coursera ML", "Hands-On ML book"] },
            { title: "SQL & Databases", desc: "SQL queries, window functions, PostgreSQL, data warehousing.", resources: ["Mode Analytics SQL", "SQLZoo"] },
            { title: "Data Visualization", desc: "Matplotlib, Plotly, Tableau, storytelling with data.", resources: ["Plotly Docs", "Storytelling with Data"] },
            { title: "Big Data & Cloud", desc: "Spark, Hadoop, AWS S3/Redshift, BigQuery basics.", resources: ["Databricks", "Google Cloud"] },
            { title: "Projects & Kaggle", desc: "Participate in Kaggle competitions, build a data portfolio.", resources: ["Kaggle Competitions", "DataTalks.Club"] },
        ],
    },
    {
        id: "devops",
        title: "DevOps Engineer",
        icon: "🚀",
        color: "#f43f5e",
        bg: "rgba(244,63,94,0.1)",
        border: "rgba(244,63,94,0.2)",
        desc: "Build and maintain infrastructure and deployment pipelines",
        steps: [
            { title: "Linux & Shell Scripting", desc: "Linux commands, bash scripting, file permissions, networking.", resources: ["The Linux Command Line", "explainshell.com"] },
            { title: "Version Control & Git", desc: "Git workflows, branching strategies, GitHub/GitLab.", resources: ["Pro Git Book", "Atlassian Git Tutorial"] },
            { title: "Docker & Containers", desc: "Dockerfile, docker-compose, container registries, networking.", resources: ["Docker Docs", "Play with Docker"] },
            { title: "CI/CD Pipelines", desc: "GitHub Actions, Jenkins, GitLab CI, automated testing & deployment.", resources: ["GitHub Actions Docs", "Jenkins Docs"] },
            { title: "Kubernetes", desc: "Pods, deployments, services, Helm charts, cluster management.", resources: ["Kubernetes Docs", "KodeKloud"] },
            { title: "Cloud Platforms", desc: "AWS (EC2, S3, RDS, Lambda), or GCP/Azure equivalents.", resources: ["AWS Free Tier", "A Cloud Guru"] },
            { title: "Monitoring & Observability", desc: "Prometheus, Grafana, ELK Stack, alerting, SLOs/SLAs.", resources: ["Prometheus Docs", "Grafana Labs"] },
            { title: "Infrastructure as Code", desc: "Terraform, Ansible, CloudFormation for infra automation.", resources: ["Terraform Docs", "Ansible Docs"] },
        ],
    },
];

export default function Roadmaps() {
    const [selected, setSelected] = useState(null);
    const [completed, setCompleted] = useState(() => {
        try { return JSON.parse(localStorage.getItem("roadmap_progress") || "{}"); } catch { return {}; }
    });

    const toggleStep = (roadmapId, stepIdx) => {
        const key = `${roadmapId}_${stepIdx}`;
        setCompleted(prev => {
            const next = { ...prev, [key]: !prev[key] };
            localStorage.setItem("roadmap_progress", JSON.stringify(next));
            return next;
        });
    };

    const getProgress = (roadmap) => {
        const done = roadmap.steps.filter((_, i) => completed[`${roadmap.id}_${i}`]).length;
        return Math.round((done / roadmap.steps.length) * 100);
    };

    const roadmap = selected ? ROADMAPS.find(r => r.id === selected) : null;

    return (
        <div>
            <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">Structured Learning</p>
                <h1 className="text-3xl font-black" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Career Roadmaps</h1>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Step-by-step learning paths to master your chosen career track.</p>
            </div>

            {!roadmap ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ROADMAPS.map(r => {
                        const progress = getProgress(r);
                        return (
                            <button
                                key={r.id}
                                id={`roadmap-${r.id}`}
                                type="button"
                                onClick={() => setSelected(r.id)}
                                className="glass-card-hover p-6 text-left"
                                style={{ borderColor: r.border }}
                            >
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                                    style={{ background: r.bg, border: `1px solid ${r.border}` }}
                                >
                                    {r.icon}
                                </div>
                                <h3 className="font-bold mb-1" style={{ color: "var(--text-primary)" }}>{r.title}</h3>
                                <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>{r.desc}</p>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 progress-bar">
                                        <div className="progress-fill" style={{ width: `${progress}%`, background: `linear-gradient(90deg,${r.color},${r.color}99)` }} />
                                    </div>
                                    <span className="text-xs font-bold" style={{ color: r.color }}>{progress}%</span>
                                </div>
                                <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>{r.steps.length} steps</p>
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div>
                    <button
                        onClick={() => setSelected(null)}
                        className="btn btn-ghost text-sm flex items-center gap-2 hover:bg-[var(--bg-hover)] mb-6"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Roadmaps
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                            style={{ background: roadmap.bg, border: `1px solid ${roadmap.border}` }}
                        >
                            {roadmap.icon}
                        </div>
                        <div>
                            <h2 className="text-xl font-black" style={{ color: "var(--text-primary)" }}>{roadmap.title}</h2>
                            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{roadmap.desc}</p>
                        </div>
                        <div className="ml-auto text-right">
                            <p className="text-2xl font-black" style={{ color: roadmap.color }}>{getProgress(roadmap)}%</p>
                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Complete</p>
                        </div>
                    </div>

                    <div className="progress-bar mb-8">
                        <div className="progress-fill" style={{ width: `${getProgress(roadmap)}%`, background: `linear-gradient(90deg,${roadmap.color},${roadmap.color}99)` }} />
                    </div>

                    <div className="space-y-1">
                        {roadmap.steps.map((step, i) => {
                            const key = `${roadmap.id}_${i}`;
                            const done = !!completed[key];
                            return (
                                <div key={i} className="roadmap-node flex gap-4 pb-5">
                                    <button
                                        id={`step-${roadmap.id}-${i}`}
                                        type="button"
                                        onClick={() => toggleStep(roadmap.id, i)}
                                        className={`node-dot flex-shrink-0 transition-all hover:scale-110 ${done ? "completed" : ""}`}
                                        title={done ? "Mark incomplete" : "Mark complete"}
                                    >
                                        {done ? (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        ) : (
                                            <span className="text-xs font-bold" style={{ color: roadmap.color }}>{i + 1}</span>
                                        )}
                                    </button>
                                    <div
                                        className="flex-1 glass-card p-6 transition-all"
                                        style={{
                                            borderColor: done ? roadmap.border : "var(--border)",
                                            opacity: done ? 0.75 : 1,
                                        }}
                                    >
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <h3 className={`font-bold text-sm ${done ? "line-through text-slate-400 dark:text-slate-500" : ""}`} style={{ color: done ? undefined : "var(--text-primary)" }}>
                                                {step.title}
                                            </h3>
                                            {done && <span className="text-emerald-500 text-xs font-semibold">✓ Done</span>}
                                        </div>
                                        <p className="text-sm mb-3 leading-relaxed" style={{ color: "var(--text-secondary)" }}>{step.desc}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {step.resources.map(res => (
                                                <span
                                                    key={res}
                                                    className="badge badge-slate"
                                                >
                                                    📖 {res}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
