var nodemailer = require("nodemailer");

const EMAIL_SERVICE_EMAIL = `project3632service@gmail.com`;
const EMAIL_SERVICE_SERVICE = "gmail";
const EMAIL_SERVICE_PASS = "N0bb2LOF";

const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE_SERVICE,
  auth: {
    user: EMAIL_SERVICE_EMAIL,
    pass: EMAIL_SERVICE_PASS
  }
});

module.exports = {
  EMAIL_SERVICE_EMAIL,
  transporter
};
