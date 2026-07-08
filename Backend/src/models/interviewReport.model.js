const mongoose = require("mongoose");


/**
 * - job description schema : string
 * - resume text : string
 * - self description : string
 * 
 * matchScore: number
 * 
 * technical questions : [{
 * 
 * question: "",
 * intention: "",
 * answer: ""
 * 
 * }]
 * 
 * behavioural questions : [{
 * 
 * question: "",
 * intention: "",
 * answer: ""
 * 
 * }]
 * 
 * skill gaps : [{
 * skills: "",
 * sevirity: {
 * type: string
 * enum: ["Low", "Medium", "High"]
 * }
 * }]
 * preparation plan : [{
 * day : number
 * focus: string
 * tasks: string
 * }]
 */

const interviewReportModel = new mongoose.Schema(

)



module.exports = interviewReportModel;