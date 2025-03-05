const nodemailer = require("nodemailer");
const nodemailerConfig = require("./nodemailerConfig");

const sendVerification = async ({ email, token }) => {
  const transportConfig = await nodemailerConfig(email);
  const transporter = nodemailer.createTransport(transportConfig);

  const origin = `${process.env.ORIGIN}/verify-email?token=${token}&email=${email}`;

  await transporter.sendMail({
    from: "lsharashenidze2001@gmail.com",
    to: email,
    subject: "Email Verification",
    html: `
    <h1>Please verify email: <a href=${origin}>Verify email</a></h1>
    `,
  });
};

module.exports = sendVerification;
