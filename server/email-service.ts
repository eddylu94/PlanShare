import nodemailer from "nodemailer";

export const EMAIL_SERVICE_EMAIL = `project3632service@gmail.com`;
export const EMAIL_SERVICE_SERVICE = "gmail";
export const EMAIL_SERVICE_PASS = "N0bb2LOF";

export const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE_SERVICE,
  auth: {
    user: EMAIL_SERVICE_EMAIL,
    pass: EMAIL_SERVICE_PASS
  }
});
