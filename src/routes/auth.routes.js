const express = require("express");
const authController = require("../controllers/auth.controller");

const authRouter = express.Router();

/**
 * @route POST /api/auth/register
 * @description register a new user
 * @access public
 */

authRouter.post("/register", authController.registerUserController);


/**
 * @route POST /api/auth/login
 * @description logins a user 
 * @access public
 */

authRouter.post("/login", authController.loginUserController);

/**
 * @route POST /api/auth/logout
 * @description removes the cokkie from user side and adds token to blacklist 
 * @access public 
 */

authRouter.get("/logout", authController.logoutUserController);

module.exports = authRouter;
