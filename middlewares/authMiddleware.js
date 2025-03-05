const { Unauthorized } = require("../errors");
const { verifyJWT } = require("../helpers/jwt");
const Token = require("../models/Token");

const authMiddleware = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = req.signedCookies;
    if (!refreshToken) {
      return next(new Unauthorized("unauthorized user! please log in first"));
    }
    if (!accessToken) {
      return next(new Unauthorized("access token is invalid"));
    }
    if (accessToken) {
      const user = verifyJWT(accessToken);
      req.user = user;
      return next();
    }
    if (refreshToken) {
      try {
        const user = verifyJWT(refreshToken);
        req.user = user;
        const existingToken = await Token.findOne({
          refreshToken: user.refreshToken,
          user: user.id,
        });
        if (!existingToken || existingToken.expiresAt < new Date()) {
          return next(
            new Unauthorized("refresh token expired, please log in again")
          );
        }
        return next();
      } catch (error) {
        return next(new Unauthorized("Refresh token invalid or expired"));
      }
    }
  } catch (error) {
    return next(new Unauthorized("Authentication failed"));
  }
};

const authPermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new Unauthorized("You have not permission to access this route")
      );
    }
    next();
  };
};

module.exports = {
  authMiddleware,
  authPermission,
};
