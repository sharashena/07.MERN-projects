const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logoutUser,
  refreshToken,
} = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.get("/refresh-token", refreshToken);
router.patch("/reset-password", resetPassword);
router.patch("/logout", authMiddleware, logoutUser);

module.exports = router;
