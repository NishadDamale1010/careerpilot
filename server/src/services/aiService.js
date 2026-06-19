const axios = require("axios");

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const getGroqResponse = async (prompt, jsonMode = false) => {
    if (!GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is not configured.");
    }

    const payload = {
        model: GROQ_MODEL,
        messages: [
            {
                role: "system",
                content: jsonMode 
                    ? "You are a precise data extractor. Always return valid JSON only. No markdown, no conversational text."
                    : "You are a helpful assistant."
            },
            { role: "user", content: prompt }
        ],
        temperature: 0.2,
    };

    if (jsonMode) {
        payload.response_format = { type: "json_object" };
    }

    const response = await axios.post(
        `${GROQ_BASE_URL}/chat/completions`,
        payload,
        {
            headers: {
                Authorization: `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
            timeout: 30000,
        }
    );

    const rawContent = response.data?.choices?.[0]?.message?.content || "{}";
    
    // Fallback cleanup if the model still wrapped it in markdown code blocks
    return rawContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
};

module.exports = { getGroqResponse };
