const { GoogleGenAI, Behavior } = require("@google/genai");
const { model, default: mongoose } = require("mongoose");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const { _enum } = require("zod/v4/core");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});


const interviewReportSchema = z.object({
  matchScore: z.number().description("a score between 0 and 100 indicating how well the candidate's profile matches the job"),


  technicalQuestions: z.array(z.object({
    question: z.string().description("the interview questions that can be asked in the interview "),
    intention: z.string().description("the intention behind the question asked in interview "),
    answer: z.string().description("how to answer this question, what points to cover, how to approach"),
  })).description("the technical questions that can be asked in the interview with their intention"),
})

behavioralQuestions: z.object({
  technicalQuestions: z.array(z.object({
    question: z.string().description("the interview questions that can be asked in the interview "),
    intention: z.string().description("the intention behind the question asked in interview "),
    answer: z.string().description("how to answer this question, what points to cover, how to approach"),
  })).description("Behavioural questions that can be asked in the interview along with their intention"),
})

skillGaps: z.object({
  skill: z.string().description("The skills that candidate is lacking "),
  severity: z.enum("low", "medium", "high")
}).description("the list of skills gap in the candidate's profile along with their inttention"),
  preparationPlan : z.array(z.object({
    days: z.number().description("the day number n the preparation plan, starting from day 1."),
    focus: z.string().description('the main focus of this day in the preparation plan e.g data strucutre, system design, mock interviews '),
    tasks: z.array(z.string).description("a daywise preparation plan for the candidate to follow in order to crack the job")
  }))

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

}



module.exports = invokeGeminiAi;
