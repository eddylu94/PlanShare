import mongodb from "mongodb";

import {
  postSuccess,
  postFailure,
  SLACK_HOOK,
  slackPostRequest,
	SlackTitle
} from "../../utils/utils";
import {
  MONGO_URL,
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_MESSAGE,
  MONGO_PREREQUISITIES,
  SUBSCRIPTION_STATUS
} from "./../../constants";

export const getSubscriptionOrganizationsAsGuest = (
  mongoClient: typeof mongodb.MongoClient,
  _postReq: any,
  postRes: any
) => {
  console.log("Retrieving subscriptions as guest...");
  mongoClient.connect(MONGO_URL, MONGO_PREREQUISITIES, (connectErr, db) => {
    if (connectErr) {
      const errorMessage = "Connection error";
      console.log(errorMessage);

			const supportingText = `
				\`\`\`
				Request: getSubscriptionsAsGuest
				Description: ${errorMessage}
				Error message: ${connectErr.message}
				\`\`\`
			`;

			slackPostRequest(
				SLACK_HOOK.ERRORS,
				SlackTitle.NEW_ERROR,
				supportingText,
			);

      return;
    }

    const dbo = db.db(DATABASE_NAME);

    const findQuery = {
      status: SUBSCRIPTION_STATUS.ACTIVE
    };

    dbo
      .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
      .find(findQuery)
      .toArray()
      .then(results => {
        if (results.length === 0) {
          console.log("Unable to find subscriptions");
          db.close();
          postFailure(postRes, STATUS_MESSAGE.CANNOT_FIND_SUBSCRIPTIONS);
          return;
        }

				const subscriptionOrgs = new Set<string>();

        results.forEach((subscription: any) => {
					const orgName = subscription.organization?.name;
					if (orgName?.length > 0) {
						subscriptionOrgs.add(subscription.organization?.name);
					}
				});

        db.close();
        postSuccess(postRes, {
          subscriptionOrgs: Array.from(subscriptionOrgs),
        });
      })
      .catch(findErr => {
        if (findErr) {
          console.log("Error finding record");
          console.log(findErr);
          db.close();
          postFailure(postRes, STATUS_MESSAGE.UNKNOWN_ERROR);
        }
      });
  });
};
