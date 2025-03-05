const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => jwt.sign(payload, process.env.JWT_SECRET);

const verifyJWT = token => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: user });
  const refreshTokenJWT = createJWT({
    payload: { id: user.id, refreshToken, role: user.role },
  });

  const accessTokenExpiry = 1000 * 60 * 60;
  const refreshTokenExpiry = 1000 * 60 * 60 * 24;

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + accessTokenExpiry),
    sameSite: "None",
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + refreshTokenExpiry),
    sameSite: "None",
  });
};

module.exports = { createJWT, verifyJWT, attachCookiesToResponse };
