import mongodb from "mongodb";

import { SLACK_HOOK, SlackTitle, authenticate, postSuccess, slackPostRequest } from "../../utils/utils";

export const getEmailAddress = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving email address...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const { email } = findRes;

      db.close();
      postSuccess(postRes, {
        email
      });
    })
    .catch(err => {
      console.log(err);

			const supportingText = `
				\`\`\`
				Request: getEmailAddress
				Description: Caught error
				Error message: ${err.message}
				\`\`\`
			`;
			
			slackPostRequest(SLACK_HOOK.ERRORS, SlackTitle.NEW_ERROR, supportingText);
    });
};
