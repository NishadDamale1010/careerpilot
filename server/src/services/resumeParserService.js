const { getGroqResponse } = require("./aiService");

const parseResumeWithGroq = async (resumeText) => {
    const prompt = `
    Parse this resume and extract the following structured data. You MUST return ONLY a valid JSON object matching this exact schema:
    {
      "name": "string",
      "email": "string",
      "phone": "string",
      "location": "string",
      "experience": [
        {"company": "string", "role": "string", "duration": "string", "description": "string", "key_achievements": ["string"]}
      ],
      "education": [
        {"school": "string", "degree": "bachelors|masters|phd|diploma|high_school", "field": "string", "year": "string"}
      ],
      "skills": [
        {"skill": "string", "proficiency_level": "expert|intermediate|beginner", "years": "number"}
      ],
      "total_years_experience": "number"
    }

    Resume text:
    ${resumeText}
    `;

    try {
        const jsonResponse = await getGroqResponse(prompt, true);
        return JSON.parse(jsonResponse);
    } catch (e) {
        console.error("Failed to parse resume with Groq", e);
        return null;
    }
};

module.exports = { parseResumeWithGroq };
