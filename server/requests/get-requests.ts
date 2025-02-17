import { poll } from "./get-requests/poll";
import { getValidationEmail } from "./get-requests/getValidationEmail";
import { getSubscriptionCategories } from "./get-requests/getSubscriptionCategories";
import { getSubscriptionBrands } from "./get-requests/getSubscriptionBrands";
import { getSubscriptions } from "./get-requests/getSubscriptions";
import { getSubscriptionsAsGuest } from "./get-requests/getSubscriptionsAsGuest";
import { getSubscription } from "./get-requests/getSubscription";
import { getSubscriptionAsGuest } from "./get-requests/getSubscriptionAsGuest";
import { getProfile } from "./get-requests/getProfile";
import { getSubscriptionsByAuthor } from "./get-requests/getSubscriptionsByAuthor";
import { getArchivedSubscriptions } from "./get-requests/getArchivedSubscriptions";
import { getEmailAddress } from "./get-requests/getEmailAddress";
import { getSettingEmailNotifications } from "./get-requests/getSettingEmailNotifications";
import { getConversation } from "./get-requests/getConversation";
import { getConversationById } from "./get-requests/getConversationById";
import { getConversationsList } from "./get-requests/getConversationsList";
import { getUnreadMessagesCount } from "./get-requests/getUnreadMessagesCount";

const getRequests = {
  poll,
  getValidationEmail,
  getSubscriptionCategories,
  getSubscriptionBrands,
  getSubscriptions,
  getSubscriptionsAsGuest,
  getSubscription,
  getSubscriptionAsGuest,
  getProfile,
  getSubscriptionsByAuthor,
  getArchivedSubscriptions,
  getEmailAddress,
  getSettingEmailNotifications,
  getConversation,
  getConversationById,
  getConversationsList,
  getUnreadMessagesCount
};

export default getRequests;
