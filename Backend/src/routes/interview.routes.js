const express = require("express");
const authMiddleware = require("../middlewares/auth.middlewaree");
const interviewController = require("../controllers/interview.controllers")

const interviewRouter = express.Router();


/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description, resume pdf and job description
 * @access private
 */

interviewRouter.post("/", authMiddleware.authUser, interviewController.generateInterviewReportController);


module.exports = interviewRouter;