const { getGroqResponse } = require("./aiService");

const parseJobWithGroq = async (jobTitle, jobDescription) => {
    const prompt = `
    Parse this job posting and extract the following structured data. You MUST return ONLY a valid JSON object matching this exact schema:
    {
      "required_skills": [
        {"skill": "string", "level": "expert|intermediate|beginner", "importance": "must_have|nice_to_have"}
      ],
      "experience_required": {
        "years": "number",
        "field": "string"
      },
      "education_required": "bachelors|masters|phd|diploma|high_school",
      "level": "entry|mid|senior"
    }

    Job Title: ${jobTitle}
    Job Description:
    ${jobDescription}
    `;

    try {
        const jsonResponse = await getGroqResponse(prompt, true);
        return JSON.parse(jsonResponse);
    } catch (e) {
        console.error("Failed to parse job with Groq", e);
        return null;
    }
};

module.exports = { parseJobWithGroq };
