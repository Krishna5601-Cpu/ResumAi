const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

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

/**
 * @route GET /api/auth/get-me 
 * @description get the current logged in user details 
 * @access private
 */

authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController);

module.exports = authRouter;
