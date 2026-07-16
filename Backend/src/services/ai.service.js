// -- FOR GEMINI --

const { GoogleGenAI } = require("@google/genai");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// 1. Plain JSON Schema for Interview Report
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
    title: {
      type: "STRING",
      description: "The title of the job for which the interview report is generated."
    }
  },
  required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan", "title"],
};

// 2. Plain JSON Schema for Resume Generation
const resumePdfSchema = {
  type: "OBJECT",
  properties: {
    html: {
      type: "STRING",
      description: "The HTML content of the resume which can be converted to PDF using any library like puppeteer."
    }
  },
  required: ["html"]
};

// Helper function to generate PDF using Puppeteer
async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm"
    }
  });

  await browser.close();
  return pdfBuffer;
}

// Generates structured JSON Interview Report
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
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: interviewReportSchema,
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Failed to generate or parse interview report:", error);
    throw error;
  }
}

// Generates styled PDF Resume tailored to the Job Description
async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const prompt = `
      Generate a resume for a candidate with the following details:
      Resume: ${resume}
      Self Description: ${selfDescription}
      Job Description: ${jobDescription}

      The response should be a JSON object with a single field "html" which contains the HTML content of the resume.
      The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. 
      The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
      The content of the resume should not sound like it's generated by AI and should be as close as possible to a real human-written resume.
      You can highlight the content using some subtle colors or different font styles but the overall design should be simple and professional.
      The content should be ATS friendly, i.e., easily parsable by ATS systems without losing important information.
      The resume should not be too lengthy; it should ideally be 1 to 2 pages long when converted to PDF. 
      Focus on quality rather than quantity and make sure to include all relevant details.
    `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: resumePdfSchema,
      },
    });

    const jsonContent = JSON.parse(response.text);
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

    return pdfBuffer;
  } catch (error) {
    console.error("Failed to generate resume or convert to PDF:", error);
    throw error;
  }
}

module.exports = { generateInterviewReport, generateResumePdf };


// -- FOR OPENAI --
// const OpenAI = require("openai");

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
//   baseURL: "http://72.61.240.7:8000/v1",
// });

// // OpenAI requires standard JSON Schema (lowercase types)
// const interviewReportSchema = {
//   type: "object",
//   additionalProperties: false,

//   properties: {
//     matchScore: {
//       type: "integer",
//       description:
//         "A score between 0 and 100 indicating how well the candidate matches the job.",
//     },

//     technicalQuestions: {
//       type: "array",
//       description:
//         "Technical questions tailored to the candidate and job.",
//       items: {
//         type: "object",
//         additionalProperties: false,
//         properties: {
//           question: {
//             type: "string",
//           },
//           intention: {
//             type: "string",
//           },
//           answer: {
//             type: "string",
//           },
//         },
//         required: [
//           "question",
//           "intention",
//           "answer",
//         ],
//       },
//     },

//     behavioralQuestions: {
//       type: "array",
//       description:
//         "Behavioral questions tailored to the candidate and job.",
//       items: {
//         type: "object",
//         additionalProperties: false,
//         properties: {
//           question: {
//             type: "string",
//           },
//           intention: {
//             type: "string",
//           },
//           answer: {
//             type: "string",
//           },
//         },
//         required: [
//           "question",
//           "intention",
//           "answer",
//         ],
//       },
//     },

//     skillGaps: {
//       type: "array",
//       description:
//         "List of skill gaps identified between the candidate and the job description.",
//       items: {
//         type: "object",
//         additionalProperties: false,
//         properties: {
//           skill: {
//             type: "string",
//           },
//           severity: {
//             type: "string",
//             enum: ["low", "medium", "high"],
//           },
//         },
//         required: [
//           "skill",
//           "severity",
//         ],
//       },
//     },

//     preparationPlan: {
//       type: "array",
//       description:
//         "A day-by-day preparation plan to bridge gaps and get ready.",
//       items: {
//         type: "object",
//         additionalProperties: false,
//         properties: {
//           day: {
//             type: "integer",
//           },
//           focus: {
//             type: "string",
//           },
//           tasks: {
//             type: "array",
//             items: {
//               type: "string",
//             },
//           },
//         },
//         required: [
//           "day",
//           "focus",
//           "tasks",
//         ],
//       },
//     },
//   },

//   required: [
//     "matchScore",
//     "technicalQuestions",
//     "behavioralQuestions",
//     "skillGaps",
//     "preparationPlan",
//   ],
// };
// async function generateInterviewReport({
//   resume,
//   selfDescription,
//   jobDescription,
// }) {

//   const prompt = `
// You are an expert technical interviewer and career coach.

// Analyze the candidate against the job description.

// IMPORTANT RULES:

// - Return ONLY valid JSON.
// - Do NOT write explanations.
// - Do NOT use markdown.
// - Do NOT wrap the JSON in \`\`\`.
// - Do NOT write any text before or after the JSON.
// - Every required field must exist.
// - The output MUST exactly follow this JSON schema.

// SCHEMA:

// ${JSON.stringify(interviewReportSchema, null, 2)}

// ----------------------------------------------------

// JOB DESCRIPTION

// ${jobDescription}

// ----------------------------------------------------

// RESUME

// ${resume}

// ----------------------------------------------------

// SELF DESCRIPTION

// ${selfDescription}
// `;

//   try {

//     const response = await client.chat.completions.create({
//       model: "sharanga",

//       temperature: 0.3,

//       messages: [
//         {
//           role: "system",
//           content: `
// You are an expert technical interviewer.

// You ONLY output raw JSON.

// Never explain.

// Never apologize.

// Never use markdown.

// Never wrap JSON inside triple backticks.

// If information is missing, make reasonable assumptions but ALWAYS return valid JSON.
// `
//         },
//         {
//           role: "user",
//           content: prompt
//         }
//       ]
//     });

//     const content = response.choices[0].message.content.trim();

//     console.log("\n========== MODEL OUTPUT ==========\n");
//     console.log(content);
//     console.log("\n==================================\n");

//     // Remove markdown if model accidentally returns it
//     const cleaned = content
//       .replace(/^```json/i, "")
//       .replace(/^```/i, "")
//       .replace(/```$/i, "")
//       .trim();

//     return JSON.parse(cleaned);

//   } catch (error) {

//     console.error("Failed to generate interview report:");

//     if (error.response) {
//       console.error(error.response.data);
//     }

//     console.error(error);

//     throw error;
//   }
// }

// module.exports = generateInterviewReport;