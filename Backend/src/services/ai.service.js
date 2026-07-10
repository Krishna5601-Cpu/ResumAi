const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// Defining the sub-schemas for readability
const questionItemSchema = z.object({
  question: z.string().description("The interview question that can be asked."),
  intention: z.string().description("The intention behind why this question is being asked."),
  answer: z.string().description("How to answer this question, what points to cover, and how to approach it."),
});

const interviewReportSchema = z.object({
  matchScore: z.number().min(0).max(100).description("A score between 0 and 100 indicating how well the candidate matches the job."),

  technicalQuestions: z.array(questionItemSchema).description("Technical questions tailored to the candidate and job."),

  behavioralQuestions: z.array(questionItemSchema).description("Behavioral questions tailored to the candidate and job."),

  skillGaps: z.array(
    z.object({
      skill: z.string().description("The specific skill the candidate is lacking."),
      severity: z.enum(["low", "medium", "high"]).description("The impact level of this missing skill."),
    })
  ).description("List of skill gaps identified between the candidate and the job description."),

  preparationPlan: z.array(
    z.object({
      day: z.number().description("The day number in the preparation plan, starting from day 1."),
      focus: z.string().description("The main focus of this day (e.g., Data Structures, System Design)."),
      tasks: z.array(z.string()).description("Specific actionable tasks for this day."),
    })
  ).description("A day-by-day preparation plan to bridge gaps and get ready."),
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  // Convert Zod schema to JSON schema format required by Google Gen AI SDK
  const jsonSchema = zodToJsonSchema(interviewReportSchema);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash", // Using the standard recommended text model
    contents: `
      You are an expert technical interviewer and career coach. 
      Analyze the following candidate data against the job description and generate a detailed interview report.
      
      JOB DESCRIPTION:
      ${jobDescription}

      CANDIDATE RESUME:
      ${resume}

      CANDIDATE SELF DESCRIPTION:
      ${selfDescription}
    `,
    config: {
      // These configurations force Gemini to respond strictly in your Zod schema format
      responseMimeType: "application/json",
      responseSchema: jsonSchema,
    },
  });

  // The response text is guaranteed to be a JSON string matching your schema
  return JSON.parse(response.text);
}

module.exports = generateInterviewReport;