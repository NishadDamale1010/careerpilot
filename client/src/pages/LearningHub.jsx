import { useState } from "react";

const SKILL_COURSES = {
    react: [
        { title: "React - The Complete Guide", platform: "Udemy", type: "course", icon: "🎓", url: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/", desc: "Comprehensive React course covering hooks, Redux, and more.", level: "Beginner → Advanced" },
        { title: "React Official Docs", platform: "Docs", type: "docs", icon: "📚", url: "https://react.dev", desc: "Official React documentation with interactive examples.", level: "All Levels" },
        { title: "Scrimba React Course", platform: "Scrimba", type: "course", icon: "🎮", url: "https://scrimba.com/learn/learnreact", desc: "Interactive React course with hands-on coding.", level: "Beginner" },
        { title: "Bob Ziroll React Tutorial", platform: "YouTube", type: "video", icon: "▶️", url: "https://www.youtube.com/watch?v=bMknfKXIFA8", desc: "Free 12-hour React course on YouTube.", level: "Beginner" },
    ],
    javascript: [
        { title: "JavaScript.info", platform: "Website", type: "docs", icon: "📚", url: "https://javascript.info", desc: "The Modern JavaScript Tutorial — most comprehensive free resource.", level: "All Levels" },
        { title: "Eloquent JavaScript", platform: "Book", type: "book", icon: "📖", url: "https://eloquentjavascript.net", desc: "Free online book on JavaScript programming.", level: "Intermediate" },
        { title: "freeCodeCamp JS", platform: "freeCodeCamp", type: "course", icon: "🎓", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures", desc: "Free JavaScript certification course.", level: "Beginner" },
        { title: "30 Days of JavaScript", platform: "GitHub", type: "practice", icon: "💪", url: "https://github.com/Asabeneh/30-Days-Of-JavaScript", desc: "30-day challenge covering all JavaScript concepts.", level: "All Levels" },
    ],
    typescript: [
        { title: "Total TypeScript", platform: "Matt Pocock", type: "course", icon: "🎓", url: "https://www.totaltypescript.com", desc: "Best TypeScript course by Matt Pocock — free and paid tiers.", level: "Intermediate" },
        { title: "TypeScript Docs", platform: "Docs", type: "docs", icon: "📚", url: "https://www.typescriptlang.org/docs", desc: "Official TypeScript handbook and reference.", level: "All Levels" },
        { title: "Execute Program", platform: "Execute Program", type: "practice", icon: "💪", url: "https://www.executeprogram.com", desc: "Spaced repetition TypeScript learning.", level: "Intermediate" },
    ],
    nodejs: [
        { title: "The Odin Project", platform: "TOP", type: "course", icon: "🎓", url: "https://www.theodinproject.com/paths/full-stack-javascript", desc: "Free full-stack JavaScript + Node.js curriculum.", level: "Beginner" },
        { title: "Node.js Docs", platform: "Docs", type: "docs", icon: "📚", url: "https://nodejs.org/en/docs", desc: "Official Node.js documentation.", level: "All Levels" },
        { title: "Net Ninja Node.js", platform: "YouTube", type: "video", icon: "▶️", url: "https://www.youtube.com/watch?v=w-7RQ46RgxU", desc: "Net Ninja's Node.js crash course series.", level: "Beginner" },
    ],
    python: [
        { title: "CS50P", platform: "Harvard", type: "course", icon: "🎓", url: "https://cs50.harvard.edu/python", desc: "Harvard's free Python programming course.", level: "Beginner" },
        { title: "Automate the Boring Stuff", platform: "Book", type: "book", icon: "📖", url: "https://automatetheboringstuff.com", desc: "Free book: practical Python automation.", level: "Beginner" },
        { title: "Python Docs", platform: "Docs", type: "docs", icon: "📚", url: "https://docs.python.org/3/tutorial", desc: "Official Python tutorial and reference.", level: "All Levels" },
        { title: "Kaggle Python", platform: "Kaggle", type: "course", icon: "🎮", url: "https://www.kaggle.com/learn/python", desc: "Free Python for data science course.", level: "Beginner" },
    ],
    sql: [
        { title: "Mode SQL Tutorial", platform: "Mode", type: "practice", icon: "💪", url: "https://mode.com/sql-tutorial", desc: "Hands-on SQL tutorial with real databases.", level: "Beginner → Advanced" },
        { title: "SQLZoo", platform: "SQLZoo", type: "practice", icon: "💪", url: "https://sqlzoo.net", desc: "Interactive SQL exercises and tutorials.", level: "Beginner" },
        { title: "PostgreSQL Tutorial", platform: "Website", type: "docs", icon: "📚", url: "https://www.postgresqltutorial.com", desc: "Comprehensive PostgreSQL reference guide.", level: "All Levels" },
    ],
    docker: [
        { title: "Docker Docs", platform: "Docs", type: "docs", icon: "📚", url: "https://docs.docker.com/get-started", desc: "Official Docker getting started guide.", level: "Beginner" },
        { title: "TechWorld with Nana Docker", platform: "YouTube", type: "video", icon: "▶️", url: "https://www.youtube.com/watch?v=3c-iBn73dDE", desc: "Best Docker crash course on YouTube.", level: "Beginner" },
        { title: "Play with Docker", platform: "Practice", type: "practice", icon: "💪", url: "https://labs.play-with-docker.com", desc: "Free browser-based Docker playground.", level: "Beginner" },
    ],
    aws: [
        { title: "AWS Free Tier", platform: "AWS", type: "practice", icon: "☁️", url: "https://aws.amazon.com/free", desc: "Free AWS account with hands-on labs.", level: "All Levels" },
        { title: "A Cloud Guru AWS", platform: "Course", type: "course", icon: "🎓", url: "https://acloudguru.com", desc: "Best AWS certification preparation courses.", level: "Beginner → Advanced" },
        { title: "AWS Skill Builder", platform: "AWS", type: "course", icon: "🎓", url: "https://explore.skillbuilder.aws", desc: "Free official AWS training platform.", level: "All Levels" },
    ],
    git: [
        { title: "Pro Git Book", platform: "Book", type: "book", icon: "📖", url: "https://git-scm.com/book/en/v2", desc: "Free comprehensive Git book, official resource.", level: "All Levels" },
        { title: "GitHub Skills", platform: "GitHub", type: "course", icon: "🎮", url: "https://skills.github.com", desc: "Interactive Git and GitHub courses.", level: "Beginner" },
        { title: "Learn Git Branching", platform: "Practice", type: "practice", icon: "💪", url: "https://learngitbranching.js.org", desc: "Visual, interactive Git branching tutorial.", level: "Beginner → Intermediate" },
    ],
    "machine learning": [
        { title: "Coursera ML Specialization", platform: "Coursera", type: "course", icon: "🎓", url: "https://www.coursera.org/specializations/machine-learning-introduction", desc: "Andrew Ng's ML Specialization — gold standard.", level: "Beginner → Intermediate" },
        { title: "fast.ai", platform: "fast.ai", type: "course", icon: "🎓", url: "https://www.fast.ai", desc: "Practical deep learning for coders.", level: "Intermediate" },
        { title: "Kaggle ML", platform: "Kaggle", type: "course", icon: "🎮", url: "https://www.kaggle.com/learn", desc: "Free, hands-on ML micro-courses.", level: "Beginner" },
    ],
    graphql: [
        { title: "GraphQL Docs", platform: "Docs", type: "docs", icon: "📚", url: "https://graphql.org/learn", desc: "Official GraphQL learning guide.", level: "All Levels" },
        { title: "Apollo GraphQL Tutorials", platform: "Apollo", type: "course", icon: "🎓", url: "https://www.apollographql.com/tutorials", desc: "Free interactive GraphQL tutorials.", level: "Beginner" },
    ],
    mongodb: [
        { title: "MongoDB University", platform: "MongoDB", type: "course", icon: "🎓", url: "https://learn.mongodb.com", desc: "Free official MongoDB courses and certifications.", level: "All Levels" },
        { title: "Mongoose Docs", platform: "Docs", type: "docs", icon: "📚", url: "https://mongoosejs.com/docs", desc: "Official Mongoose ODM documentation.", level: "All Levels" },
    ],
};

const ALL_SKILLS = Object.keys(SKILL_COURSES);

const PLATFORM_COLORS = {
    Udemy: "badge-blue",
    YouTube: "badge-red",
    Docs: "badge-blue",
    freeCodeCamp: "badge-green",
    Kaggle: "badge-blue",
    GitHub: "badge-slate",
    Harvard: "badge-red",
    Book: "badge-amber",
    Practice: "badge-blue",
    default: "badge-slate",
};

const TYPE_ICONS = { course: "🎓", docs: "📚", video: "▶️", book: "📖", practice: "💪" };

export default function LearningHub() {
    const [selectedSkill, setSelectedSkill] = useState("");
    const [search, setSearch] = useState("");

    const filteredSkills = ALL_SKILLS.filter(s =>
        !search || s.toLowerCase().includes(search.toLowerCase())
    );

    const courses = selectedSkill ? (SKILL_COURSES[selectedSkill] || []) : [];

    return (
        <div>
            <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">Curated Resources</p>
                <h1 className="text-3xl font-black" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Skill Learning Hub</h1>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Curated courses, docs, and videos for every tech skill — hand-picked for quality.</p>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
                {/* Skill Selector */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-6 sticky top-24">
                        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-secondary)" }}>Choose a Skill</p>
                        <input
                            id="skill-search-input"
                            type="text"
                            className="input text-sm mb-3"
                            placeholder="Search skills..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <div className="space-y-1">
                            {filteredSkills.map(skill => (
                                <button
                                    key={skill}
                                    id={`skill-${skill.replace(/\s+/g, "-")}`}
                                    type="button"
                                    onClick={() => setSelectedSkill(skill)}
                                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all border ${
                                        selectedSkill === skill
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--bg-hover)]"
                                    }`}
                                >
                                    <span className="mr-2">{TYPE_ICONS.course}</span>
                                    {skill.charAt(0).toUpperCase() + skill.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Course Grid */}
                <div className="lg:col-span-3">
                    {!selectedSkill ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="text-6xl mb-4">📚</div>
                            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Select a skill to explore resources</h3>
                            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Choose from {ALL_SKILLS.length} skills on the left to see curated learning resources.</p>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <h2 className="text-xl font-bold capitalize" style={{ color: "var(--text-primary)" }}>
                                    {selectedSkill} Resources
                                </h2>
                                <span className="badge badge-blue">
                                    {courses.length} resources
                                </span>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                {courses.map((c, i) => (
                                    <a
                                        key={i}
                                        href={c.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="glass-card-hover p-6 flex flex-col gap-4 no-underline"
                                        style={{ textDecoration: "none" }}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="font-bold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{c.title}</p>
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`badge ${PLATFORM_COLORS[c.platform] || PLATFORM_COLORS.default}`}
                                                    >
                                                        {c.platform}
                                                    </span>
                                                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{c.level}</span>
                                                </div>
                                            </div>
                                            <span className="text-xl flex-shrink-0">{c.icon}</span>
                                        </div>
                                        <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{c.desc}</p>
                                        <div className="flex items-center gap-1.5 text-xs font-semibold mt-auto" style={{ color: "var(--primary)" }}>
                                            {TYPE_ICONS[c.type]} {c.type.charAt(0).toUpperCase() + c.type.slice(1)}
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="ml-auto">
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                                            </svg>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
