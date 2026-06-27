const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

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
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExists) {
    return res.status(400).json({
      success: false,
      message: "user already exists with this username or email",
    });
  }

  const hash = bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hash,
  })

  const token = jwt.sign({ id: user._id, user: username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" });



  res.cookie("token", token);

  res.status(201).json({
    message: "New User Registered Successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    }
  })


}

/**
 * @name loginUserController
 * @route POST /api/auth/login
 * @description logins the user, expecting username or email and password in the request body 
 */

async function loginUserController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({
    email
  });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password"
    })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or password"
    })
  };

  const token = jwt.sign(
    { id: user._id, user: username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" })


  res.cookie("token", token);

  res.status(200).json({
    message: "User loggedIn Successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    }
  })

}


/**
 * @name logoutUserController
 * @route GET /api/auth/logout
 * @description logs out the user by removing the token from user side and adds the token in token blacklist, expects token
 */

async function logoutUserController(req, res) {

  const token = req.cookie.token;

  if (token) {
    await tokenBlacklistModel.create({ token })
  }

  res.clearCookie("token");

  res.status(200).json({
    message: "User logged out successfully"
  })
}

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
};
