const express = require("express");
const authMiddleware = require("../middlewares/auth.middlewaree");
const interviewController = require("../controllers/interview.controllers")
const upload = require("../middlewares/file.middleware");

const interviewRouter = express.Router();


/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description, resume pdf and job description
 * @access private
 */

interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportController);

/**
 * @route Get /api/interview/report/:interviewId
 * @description get interview report by interview report id
 * @access private
 */

interviewRouter.get("/report/:interviewId", authMiddleware.authUser, getInterviewReportByIdController)



module.exports = interviewRouter;