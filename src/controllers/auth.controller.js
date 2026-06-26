const userModel = require("../models/user.model");

/**
 * @name registerUserController
 * @route POST /api/auth/register
 * @description registers new user and expects username, email and password in the request body
 * @access Public
 */

async function registerUserController(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid username, email, password",
    });
  }

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{}, {}],
  });
}

module.exports = {
  registerUserController,
};
