const SCAM_KEYWORDS = [
    "training fee",
    "deposit required",
    "pay for training",
    "investment required",
    "pyramid scheme",
    "mlm",
    "multi-level marketing",
    "wire transfer",
    "send money",
    "cash app",
    "crypto investment",
    "no interview required",
    "hired immediately",
    "start making thousands",
    "earn $500 a day",
    "guaranteed income"
];

const SUSPICIOUS_COMPANIES = [
    "confidential",
    "undisclosed"
];

const detectFakeJob = (job) => {
    const reasons = [];
    let score = 0;

    const titleText = (job.title || "").toLowerCase();
    const companyText = (job.company || "").toLowerCase();
    const descText = (job.description || "").toLowerCase();

    const fullText = `${titleText} ${descText}`;

    for (const keyword of SCAM_KEYWORDS) {
        if (fullText.includes(keyword)) {
            reasons.push(`Contains suspicious phrase: "${keyword}"`);
            score += 50;
        }
    }

    if (SUSPICIOUS_COMPANIES.includes(companyText)) {
        reasons.push("Hidden or undisclosed company name");
        score += 30;
    }

    if (titleText.includes("data entry") && titleText.includes("$") && titleText.match(/\d{2,}/)) {
        reasons.push("Unrealistic compensation for data entry");
        score += 40;
    }

    if (!job.company || job.company.trim() === "") {
        reasons.push("No company specified");
        score += 20;
    }

    return {
        isSuspicious: score >= 50,
        reasons,
        score
    };
};

module.exports = { detectFakeJob };
