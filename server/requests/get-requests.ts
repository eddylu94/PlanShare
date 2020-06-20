import { getValidationEmail } from "./get-requests/getValidationEmail";
import { getSubscriptionCategories } from "./get-requests/getSubscriptionCategories";
import { getSubscriptionBrands } from "./get-requests/getSubscriptionBrands";
import { getSubscriptions } from "./get-requests/getSubscriptions";
import { getSubscriptionsAsGuest } from "./get-requests/getSubscriptionsAsGuest";
import { getSubscription } from "./get-requests/getSubscription";
import { getProfile } from "./get-requests/getProfile";
import { getSubscriptionsByAuthor } from "./get-requests/getSubscriptionsByAuthor";
import { getArchivedSubscriptions } from "./get-requests/getArchivedSubscriptions";
import { getEmailAddress } from "./get-requests/getEmailAddress";
import { getConversation } from "./get-requests/getConversation";
import { getConversationById } from "./get-requests/getConversationById";
import { getConversationsList } from "./get-requests/getConversationsList";

const getRequests = {
  getValidationEmail,
  getSubscriptionCategories,
  getSubscriptionBrands,
  getSubscriptions,
  getSubscriptionsAsGuest,
  getSubscription,
  getProfile,
  getSubscriptionsByAuthor,
  getArchivedSubscriptions,
  getEmailAddress,
  getConversation,
  getConversationById,
  getConversationsList
};

export default getRequests;
