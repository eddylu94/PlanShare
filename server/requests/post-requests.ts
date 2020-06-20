import { signUp } from "./post-requests/signUp";
import { addEmail } from "./post-requests/addEmail";
import { resendConfirmationCode } from "./post-requests/resendConfirmationCode";
import { login } from "./post-requests/login";
import { verifyEmail } from "./post-requests/verifyEmail";
import { createSubscription } from "./post-requests/createSubscription";
import { editSubscription } from "./post-requests/editSubscription";
import { archiveSubscription } from "./post-requests/archiveSubscription";
import { deleteSubscription } from "./post-requests/deleteSubscription";
import { deleteUser } from "./post-requests/deleteUser";
import { sendMessage } from "./post-requests/sendMessage";

const postRequests = {
  signUp,
  addEmail,
  resendConfirmationCode,
  login,
  verifyEmail,
  createSubscription,
  editSubscription,
  archiveSubscription,
  deleteSubscription,
  deleteUser,
  sendMessage
};

export default postRequests;
