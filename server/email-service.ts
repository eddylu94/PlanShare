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

export const NEW_MESSAGE_NOTIFICATION_SUBJECT =
  "You've received a new message for your listing!";

export const createNewMessageNotificationBody = (firstName: string) => {
  return `<span style="font-size: 11px;">Hi ${firstName},
	<br /><br />
	This is a notification to let you know that you have recently received a new message for one of your listings!
	<br /><br />
	The PlanShare Team
	<br /><br />
	</span>
	<span style="font-size: 8px;">If you no longer wish to receive notifications regarding new messages, you can change your notification preferences at:
	<br /><a href="https://planshare.io/settings">https://planshare.io/settings</a></span>`;
};
