const SCAM_PATTERNS = [
    { text: "click link urgently", flag: "Phishing", points: 55, severity: "high" },
    { text: "verify account immediately", flag: "Phishing", points: 55, severity: "high" },
    { text: "unusual activity detected", flag: "Phishing", points: 55, severity: "high" },
    { text: "instant hiring", flag: "Advance Fee Scam", points: 50, severity: "high" },
    { text: "no interview needed", flag: "Advance Fee Scam", points: 50, severity: "high" },
    { text: "get hired in 24 hours", flag: "Advance Fee Scam", points: 50, severity: "high" },
    { text: "training fee", flag: "Advance Fee Scam", points: 50, severity: "high" },
    { text: "deposit required", flag: "Advance Fee Scam", points: 50, severity: "high" },
    { text: "pyramid scheme", flag: "MLM Scam", points: 60, severity: "high" },
    { text: "multi-level marketing", flag: "MLM Scam", points: 60, severity: "high" },
    { text: "wire transfer", flag: "Advance Fee Scam", points: 50, severity: "high" },
    { text: "crypto investment", flag: "MLM Scam", points: 40, severity: "medium" },
    { text: "earn $500 a day", flag: "MLM Scam", points: 45, severity: "high" },
    { text: "limited time offer", flag: "Suspicious urgency", points: 20, severity: "medium" }
];

const SUSPICIOUS_COMPANIES = ["confidential", "undisclosed"];

/**
 * Calculates the full trust profile without hitting an LLM (saves rate limits).
 * Mocks out the Recruiter and Email components since standard job boards don't provide them.
 */
const calculateAdvancedTrustScore = (job) => {
    let scam_flags = [];
    let red_flags_count = 0;
    
    const titleText = (job.title || "").toLowerCase();
    const companyText = (job.company || "").toLowerCase();
    const descText = (job.description || "").toLowerCase();
    const fullText = `${titleText} ${descText}`;

    // --- 1. Company Score (Synthesized from available data) ---
    // If we had a Clearbit API, we'd check domain age. We will infer based on missing data.
    let company_score = 100;
    let company_verified = true;
    if (SUSPICIOUS_COMPANIES.includes(companyText) || !companyText) {
        company_score -= 40;
        company_verified = false;
        scam_flags.push({ flag: "Hidden Company Name", severity: "high", points: 40 });
        red_flags_count++;
    }

    // --- 2. Job Quality Score ---
    let job_quality_score = 100;
    
    // Clarity
    if (descText.split(" ").length < 50) {
        job_quality_score -= 10;
        scam_flags.push({ flag: "Extremely short description", severity: "low", points: 10 });
    }
    
    // Completeness
    if (!job.location) job_quality_score -= 5;
    if (!job.type) job_quality_score -= 5;
    
    // Red Flags (Scam patterns)
    for (const pattern of SCAM_PATTERNS) {
        if (fullText.includes(pattern.text)) {
            job_quality_score -= (pattern.points / 2); // Map out of 100
            scam_flags.push({ flag: pattern.flag, severity: pattern.severity, points: pattern.points });
            red_flags_count++;
        }
    }

    // --- 3. Recruiter Score & Email Authenticity ---
    // Defaulting to high since job APIs (LinkedIn, Internshala) pre-vet recruiters.
    const recruiter_score = 90; 
    const email_authenticity = 90;

    // --- Final Weighted Score ---
    // Weights: Company 25%, Job Quality 30%, Recruiter 20%, Email 15%, Platform Trust 10%
    let trust_score = (company_score * 0.25) + (job_quality_score * 0.30) + (recruiter_score * 0.20) + (email_authenticity * 0.15) + (100 * 0.10);
    
    // Hard cap if severe flags
    if (red_flags_count >= 2) {
        trust_score = Math.min(trust_score, 45); // Automatically suspicious
    }

    return {
        trust_score: Math.max(0, Math.round(trust_score)),
        company_score: Math.max(0, Math.round(company_score)),
        job_quality_score: Math.max(0, Math.round(job_quality_score)),
        recruiter_score,
        email_authenticity,
        company_verified,
        domain_verified: true,
        scam_flags,
        red_flags_count
    };
};

module.exports = { calculateAdvancedTrustScore, SCAM_PATTERNS };
