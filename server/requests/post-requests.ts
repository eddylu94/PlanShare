import { signUp } from "./post-requests/signUp";
import { addEmail } from "./post-requests/addEmail";
import { resendConfirmationCode } from "./post-requests/resendConfirmationCode";
import { login } from "./post-requests/login";
import { changePass } from "./post-requests/changePass";
import { verifyEmail } from "./post-requests/verifyEmail";
import { createSubscription } from "./post-requests/createSubscription";
import { editSubscription } from "./post-requests/editSubscription";
import { archiveSubscription } from "./post-requests/archiveSubscription";
import { deleteSubscription } from "./post-requests/deleteSubscription";
import { deleteUser } from "./post-requests/deleteUser";
import { sendMessage } from "./post-requests/sendMessage";
import { changeSettingEmailNotifications } from "./post-requests/changeSettingEmailNotifications";

const postRequests = {
  signUp,
  addEmail,
  resendConfirmationCode,
  login,
  changePass,
  verifyEmail,
  createSubscription,
  editSubscription,
  archiveSubscription,
  deleteSubscription,
  deleteUser,
  sendMessage,
  changeSettingEmailNotifications
};

export default postRequests;
