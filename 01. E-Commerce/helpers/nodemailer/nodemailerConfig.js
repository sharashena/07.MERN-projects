const { OAuth2Client } = require("google-auth-library");

const clientId = process.env.OAUTH_CLIENT_ID;
const clientSecret = process.env.OAUTH_CLIENT_SECRET;
const refreshToken = process.env.OAUTH_REFRESH_TOKEN;
const redirectUrl = process.env.OAUTH_REDIRECT_URI;

const oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);
oAuth2Client.setCredentials({ refresh_token: refreshToken });

const nodemailerConfig = async email => {
  const accessToken = await oAuth2Client.getAccessToken();
  return {
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: email,
      clientId,
      clientSecret,
      refreshToken,
      accessToken: accessToken.token,
    },
  };
};

module.exports = nodemailerConfig;
