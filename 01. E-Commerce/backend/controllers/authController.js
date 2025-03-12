const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound, Unauthorized } = require("../errors");
const asyncWrapper = require("../middlewares/asyncWrapper");
const registerValidate = require("../validations/authValidations/registerValidation");
const loginValidate = require("../validations/authValidations/loginValidation");
const resetPasswordValidation = require("../validations/authValidations/resetPasswordValidation");
const User = require("../models/User");
const Token = require("../models/Token");
const crypto = require("crypto");
const sendResetPassword = require("../helpers/nodemailer/resetPassword");
const {
  attachCookiesToResponse,
  createJWT,
  verifyJWT,
} = require("../helpers/jwt");
const createTokenUser = require("../helpers/createTokenUser");

const registerUser = asyncWrapper(async (req, res) => {
  const { username, email, password } = req.body;
  const errors = registerValidate(req.body);
  if (Object.keys(errors).length > 0) {
    throw new BadRequest(JSON.stringify(errors));
  }

  const firstUser = (await User.countDocuments({})) === 0;
  const role = firstUser ? "admin" : "user";

  await User.create({
    username,
    email,
    password,
    role,
  });

  res.status(StatusCodes.CREATED).json({ msg: "user successfully created" });
});

const loginUser = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const errors = loginValidate(req.body);
  if (Object.keys(errors).length > 0) {
    throw new BadRequest(JSON.stringify(errors));
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Unauthorized("invalid credentials");
  }
  const passMatch = await user.comparePasswords(password);
  if (!passMatch) {
    throw new Unauthorized("invalid credentials");
  }

  const ip = req.ip;
  const userAgent = req.headers["user-agent"];
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  const refreshToken = crypto.randomBytes(64).toString("hex");

  await Token.findOneAndUpdate(
    { user: user.id },
    { refreshToken, isValid: true, ipAddress: ip, userAgent, expiresAt },
    { new: true, upsert: true }
  );

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({
    msg: `welcome, ${user.username}!`,
    user: {
      username: user.username,
    },
  });
});

const verifyEmail = asyncWrapper(async (req, res) => {
  const { token, email } = req.body;

  if (!token || !email) {
    throw new NotFound("invalid token");
  }

  const user = await User.findOne({ email });
  const currentDate = new Date(Date.now());

  if (!user) {
    throw new NotFound("user now found");
  }
  if (user.verificationToken !== token) {
    throw new BadRequest("token doesn't match");
  }
  if (user.verificationTokenExpirationDate < currentDate) {
    user.verificationToken = null;
    user.verificationTokenExpirationDate = null;
    await user.save();
    throw new BadRequest("verification link has expired");
  }
  user.verified = true;
  user.verificationToken = null;
  user.verificationTokenExpirationDate = null;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "email verified" });
});

const forgotPassword = asyncWrapper(async (req, res) => {
  const { email } = req.body;
  const errors = {};

  if (!email) {
    errors.email = "email is required";
    throw new BadRequest(JSON.stringify(errors));
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Please provide a valid email";
    throw new BadRequest(JSON.stringify(errors));
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFound("email doesn't exists");
  }
  const fifteenMins = 1000 * 60 * 15;
  const passwordToken = crypto.randomBytes(40).toString("hex");
  const passwordTokenExpDate = Date.now() + fifteenMins;
  sendResetPassword({ email, token: passwordToken });

  user.passwordToken = passwordToken;
  user.passwordTokenExpirationDate = passwordTokenExpDate;
  await user.save();

  res
    .status(StatusCodes.OK)
    .json({ msg: "reset password link has been sent to your email" });
});

const resetPassword = asyncWrapper(async (req, res) => {
  const { token, email, newPassword, repeatPassword } = req.body;
  const errors = resetPasswordValidation(req.body);
  if (Object.keys(errors).length > 0) {
    throw new BadRequest(JSON.stringify(errors));
  }

  if (/\s/.test(newPassword)) {
    throw new BadRequest("password cannot contain whitespaces");
  }
  if (newPassword !== repeatPassword) {
    throw new BadRequest("new password and repeat password don't match");
  }
  if (!token || !email) {
    throw new BadRequest("token is invalid");
  }

  const user = await User.findOne({ email });
  const currentDate = new Date(Date.now());

  if (!user) {
    throw new NotFound("user not found");
  }
  if (user.passwordToken !== token) {
    throw new BadRequest("token doesn't match");
  }
  if (user.passwordTokenExpirationDate < currentDate) {
    user.passwordToken = null;
    user.passwordTokenExpirationDate = null;
    await user.save();
    throw new BadRequest("reset password link has expired");
  }

  const passMatch = await user.comparePasswords(newPassword);
  if (passMatch) {
    throw new BadRequest("cannot change new password to current password");
  }
  user.password = newPassword;
  user.passwordToken = null;
  user.passwordTokenExpirationDate = null;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "password successfully changed" });
});

const logoutUser = asyncWrapper(async (req, res) => {
  await Token.findOneAndUpdate(
    { user: req.user.id },
    { isValid: false },
    { new: true }
  );

  res.cookie("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now()),
    sameSite: "None",
  });
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now()),
    sameSite: "None",
  });

  res.status(StatusCodes.OK).json({ msg: "user logged out" });
});

const refreshToken = asyncWrapper(async (req, res) => {
  const { refreshToken } = req.signedCookies;
  if (!refreshToken) {
    throw new Unauthorized("refresh token is missing");
  }
  const payload = verifyJWT(refreshToken);

  if (!payload) {
    throw new Unauthorized("refresh token is invalid");
  }

  const newAccessToken = createJWT({ payload });

  const accessTokenExpiry = 1000 * 60 * 60;

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + accessTokenExpiry),
    sameSite: "None",
  });

  res.status(StatusCodes.OK).send({ msg: "access token refreshed" });
});

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logoutUser,
  refreshToken,
};
