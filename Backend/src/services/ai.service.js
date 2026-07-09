const { GoogleGenAI } = require("@google/genai");
const { model } = require("mongoose");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY
});


async function invokeGeminiAi(params) {


  const responese = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Hello Gemini, what is interview?",
  })

  console.log(responese.text);

}

module.exports = invokeGeminiAi;