const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// Define the schema as a plain JSON Schema object
const interviewReportSchema = {
  type: "OBJECT",
  properties: {
    matchScore: {
      type: "INTEGER",
      description: "A score between 0 and 100 indicating how well the candidate matches the job.",
    },
    technicalQuestions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          question: { type: "STRING", description: "The interview question that can be asked." },
          intention: { type: "STRING", description: "The intention behind why this question is being asked." },
          answer: { type: "STRING", description: "How to answer this question, what points to cover, and how to approach it." },
        },
        required: ["question", "intention", "answer"],
      },
      description: "Technical questions tailored to the candidate and job.",
    },
    behavioralQuestions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          question: { type: "STRING", description: "The interview question that can be asked." },
          intention: { type: "STRING", description: "The intention behind why this question is being asked." },
          answer: { type: "STRING", description: "How to answer this question, what points to cover, and how to approach it." },
        },
        required: ["question", "intention", "answer"],
      },
      description: "Behavioral questions tailored to the candidate and job.",
    },
    skillGaps: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          skill: { type: "STRING", description: "The specific skill the candidate is lacking." },
          severity: { 
            type: "STRING", 
            enum: ["low", "medium", "high"], 
            description: "The impact level of this missing skill." 
          },
        },
        required: ["skill", "severity"],
      },
      description: "List of skill gaps identified between the candidate and the job description.",
    },
    preparationPlan: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          day: { type: "INTEGER", description: "The day number in the preparation plan, starting from day 1." },
          focus: { type: "STRING", description: "The main focus of this day (e.g., Data Structures, System Design)." },
          tasks: { 
            type: "ARRAY", 
            items: { type: "STRING" }, 
            description: "Specific actionable tasks for this day." 
          },
        },
        required: ["day", "focus", "tasks"],
      },
      description: "A day-by-day preparation plan to bridge gaps and get ready.",
    },
  },
  required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"],
};

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  const prompt = `
      You are an expert technical interviewer and career coach. 
      Analyze the following candidate data against the job description and generate a detailed interview report.
      
      JOB DESCRIPTION:
      ${jobDescription}

      CANDIDATE RESUME:
      ${resume}

      CANDIDATE SELF DESCRIPTION:
      ${selfDescription}
    `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: interviewReportSchema,
      },
    });

    // Parse and return the guaranteed structured JSON
    const reportData = JSON.parse(response.text);
    console.log(reportData);
    return reportData;

  } catch (error) {
    console.error("Failed to generate or parse interview report:", error);
    throw error;
  }
}

module.exports = generateInterviewReport;