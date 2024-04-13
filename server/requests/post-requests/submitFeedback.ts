import mongodb from "mongodb";

import {
  authenticate,
  postSuccess,
  SLACK_HOOK,
  slackPostRequest,
	SlackTitle
} from "../../utils/utils";

export const submitFeedback = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Submitting feedback...");

  const obj = postReq.body;

  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

			const supportingText = `
				\`\`\`
				Username: ${findRes.username}
				Message: ${obj.message}
				\`\`\`
			`;

			slackPostRequest(SLACK_HOOK.FEEDBACK, SlackTitle.FEEDBACK, supportingText);

			db.close();
			postSuccess(postRes, {});
    })
    .catch(err => {
      console.log(err);

			const supportingText = `
				\`\`\`
				Request: createSubscription
				Description: Caught error
				Error message: ${err.message}
				\`\`\`
			`;
			
			slackPostRequest(SLACK_HOOK.ERRORS, SlackTitle.NEW_ERROR, supportingText);
    });
};
