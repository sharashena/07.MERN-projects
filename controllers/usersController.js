const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const asyncWrapper = require("../middlewares/asyncWrapper");
const checkPermission = require("../helpers/checkPermission");
const updateUserValidation = require("../validations/authValidations/updateUserValidation");
const updateUserPassValidation = require("../validations/authValidations/updateUserPasswordValidation");
const { BadRequest, NotFound } = require("../errors");
const sendVerification = require("../helpers/nodemailer/sendVerification");
const crypto = require("crypto");

const getAllUsers = asyncWrapper(async (req, res) => {
  const excludeFields =
    "-password -passwordToken -passwordTokenExpirationDate -verified -createdAt -updatedAt -verificationToken -verificationTokenExpirationDate";
  const users = await User.find({}).select(excludeFields);
  if (!users) {
    throw new NotFound("user not found");
  }
  res.status(StatusCodes.OK).json({ numOfUsers: user.length, users });
});

const getSingleUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const excludeFields =
    "-password -passwordToken -passwordTokenExpirationDate -verificationToken -verificationTokenExpirationDate";
  const user = await User.findOne({ _id: id }).select(excludeFields);
  if (!user) {
    throw new NotFound("user not found");
  }
  res.status(StatusCodes.OK).json({ user });
});

const showCurrentUser = asyncWrapper(async (req, res) => {
  const excludeFields =
    "-password -passwordToken -passwordTokenExpirationDate -verificationToken -verificationTokenExpirationDate -createdAt -updatedAt";
  const user = await User.findOne({ _id: req.user.id }).select(excludeFields);
  if (!user) {
    throw new NotFound("user not found");
  }
  res.status(StatusCodes.OK).json({ user });
});

const updateUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;
  const errors = updateUserValidation({ username, email });
  if (Object.keys(errors).length > 0) {
    throw new BadRequest(JSON.stringify(errors));
  }
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new NotFound("user not found");
  }
  checkPermission(user, req.user.id);
  user.username = username;
  if (user.email !== email) {
    const verificationToken = crypto.randomBytes(64).toString("hex");
    const fifteenMins = 1000 * 60 * 15;
    const verificationTokenExpDate = new Date(Date.now() + fifteenMins);
    sendVerification({ email, token: verificationToken });
    user.verificationToken = verificationToken;
    user.verificationTokenExpirationDate = verificationTokenExpDate;
    await user.save();
  }
  user.email = email;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "user updated successfully" });
});

const updateUserPassword = asyncWrapper(async (req, res) => {
  const { currentPassword, newPassword, repeatPassword } = req.body;
  const errors = updateUserPassValidation({
    currentPassword,
    newPassword,
    repeatPassword,
  });
  if (Object.keys(errors).length > 0) {
    throw new BadRequest(JSON.stringify(errors));
  }
  const user = await User.findOne({ _id: req.user.id });
  if (!user) {
    throw new NotFound("user not found");
  }

  const isCurrPassMatch = await user.comparePasswords(currentPassword);
  if (!isCurrPassMatch) {
    throw new BadRequest("current password is incorrect");
  }
  if (newPassword !== repeatPassword) {
    throw new BadRequest("new password and repeat password don't match");
  }
  const oldPassMatch = await user.comparePasswords(newPassword);
  if (oldPassMatch) {
    throw new BadRequest("new password can't be old password");
  }
  user.password = newPassword;
  await user.save();

  res
    .status(StatusCodes.OK)
    .json({ msg: "your password updated successfully" });
});

const deleteUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new BadRequest("user now found");
  }
  checkPermission(user, req.user.id);
  await user.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "user has deleted successfully" });
});

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  deleteUser,
};
