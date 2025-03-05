const nodemailer = require("nodemailer");
const nodemailerConfig = require("./nodemailerConfig");

const sendResetPassword = async ({ email, token }) => {
  const transportConfig = await nodemailerConfig(email);
  const transporter = nodemailer.createTransport(transportConfig);

  const origin = `${process.env.ORIGIN}/reset-password?token=${token}&email=${email}`;

  await transporter.sendMail({
    from: "lsharashenidze2001@gmail.com",
    to: email,
    subject: "Reset Password",
    html: `
    <h1>
    Dear customer, we are sending reset password link to you. <br/>
    <a href=${origin}>Reset password</a>
    </h1>
    `,
  });
};

module.exports = sendResetPassword;
