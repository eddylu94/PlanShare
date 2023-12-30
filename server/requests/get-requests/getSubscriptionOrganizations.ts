import mongodb from "mongodb";

import {
  authenticate,
  getDomain,
  postSuccess,
  postFailure,
	SLACK_HOOK,
	slackPostRequest,
	SlackTitle
} from "./../../utils";
import { retrieveOrganizationByDomain } from "./../../organizations";
import {
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_MESSAGE,
  SUBSCRIPTION_STATUS
} from "./../../constants";

export const getSubscriptionOrganizations = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving subscriptions...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;
      const { email } = findRes;

      const dbo = db.db(DATABASE_NAME);

      const domain = getDomain(email);
      const organization = retrieveOrganizationByDomain(domain);
      const organizationId = organization && organization.organizationId;

      const findQuery = {
        status: SUBSCRIPTION_STATUS.ACTIVE,
        $or: [
          { organization: null },
          { "organization.organizationId": organizationId }
        ]
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
    })
    .catch(err => {
      console.log(err);

			const supportingText = `
				\`\`\`
				Request: getSubscriptionOrganizations
				Description: Caught error
				Error message: ${err.message}
				\`\`\`
			`;
			
			slackPostRequest(SLACK_HOOK.ERRORS, SlackTitle.NEW_ERROR, supportingText);
    });
};
