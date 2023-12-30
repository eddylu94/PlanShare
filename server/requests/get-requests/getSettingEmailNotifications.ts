import mongodb from "mongodb";

import { SLACK_HOOK, SlackTitle, authenticate, postSuccess, slackPostRequest } from "./../../utils";

export const getSettingEmailNotifications = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving email notifications setting...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const { settingEmailNotifications } = findRes;

      db.close();
      postSuccess(postRes, {
        settingEmailNotifications
      });
    })
    .catch(err => {
      console.log(err);

			const supportingText = `
				\`\`\`
				Request: getSettingEmailNotifications
				Description: Caught error
				Error message: ${err.message}
				\`\`\`
			`;
			
			slackPostRequest(SLACK_HOOK.ERRORS, SlackTitle.NEW_ERROR, supportingText);
    });
};
