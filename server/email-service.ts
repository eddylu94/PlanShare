import nodemailer from "nodemailer";

export const EMAIL_SERVICE_HOST = "mail.privateemail.com";
export const EMAIL_SERVICE_PORT = 465;
export const EMAIL_SERVICE_EMAIL = `admin@planshare.io`;
export const EMAIL_SERVICE_PASS = "N0bb2LOF";

export const transporter = nodemailer.createTransport({
  host: EMAIL_SERVICE_HOST,
  port: EMAIL_SERVICE_PORT,
  secure: true,
  auth: {
    user: EMAIL_SERVICE_EMAIL,
    pass: EMAIL_SERVICE_PASS
  }
});
