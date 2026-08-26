import mongodb from "mongodb";

import { slackPostRequest, SLACK_HOOK, SlackTitle } from "../../utils/utils";
import {
  MONGO_URL,
  DATABASE_NAME,
  DATABASE_COLLECTION,
  MONGO_PREREQUISITIES
} from "../../constants";
import {
  buildInsightsPayload,
  getInsightsSecret,
  hasBearerPrefix,
  isAuthorizedInsightsRequest,
  normalizeAuthorizationHeader,
  unauthorizedBody
} from "../../utils/insights";

const sendUnauthorized = (res: any) => {
  res.status(401).json(unauthorizedBody);
};

const getAuthorizationHeader = (getReq: any): unknown => {
  if (getReq && typeof getReq.get === "function") {
    const fromGetter = getReq.get("Authorization");
    if (fromGetter) {
      return fromGetter;
    }
  }
  const headers = (getReq && getReq.headers) || {};
  return headers.authorization || headers.Authorization;
};

export const getInsights = (
  mongoClient: typeof mongodb.MongoClient,
  getReq: any,
  getRes: any
) => {
  const authorization = getAuthorizationHeader(getReq);
  const secret = getInsightsSecret(process.env.INSIGHTS_SECRET);

  if (!isAuthorizedInsightsRequest(authorization, secret || undefined)) {
    console.log("Insights unauthorized", {
      headerPresent: Boolean(normalizeAuthorizationHeader(authorization)),
      insightsSecretLoaded: Boolean(secret),
      bearerPrefixFound: hasBearerPrefix(authorization)
    });
    sendUnauthorized(getRes);
    return;
  }

  mongoClient.connect(MONGO_URL, MONGO_PREREQUISITIES, (connectErr, db) => {
    if (connectErr) {
      const errorMessage = "Connection error";
      console.log(errorMessage);

      const supportingText = `
				\`\`\`
				Request: getInsights
				Description: ${errorMessage}
				Error message: ${connectErr.message}
				\`\`\`
			`;

      slackPostRequest(SLACK_HOOK.ERRORS, SlackTitle.NEW_ERROR, supportingText);
      getRes.status(500).json({ error: "Internal Server Error" });
      return;
    }

    const dbo = db.db(DATABASE_NAME);
    dbo
      .collection(DATABASE_COLLECTION.USERS_COLLECTION)
      .find({}, { projection: { joinedDate: 1 } })
      .toArray((findErr, users) => {
        if (findErr) {
          const errorMessage = "Error finding records";
          console.log(errorMessage);
          db.close();

          const supportingText = `
						\`\`\`
						Request: getInsights
						Description: ${errorMessage}
						Error message: ${findErr.message}
						\`\`\`
					`;

          slackPostRequest(
            SLACK_HOOK.ERRORS,
            SlackTitle.NEW_ERROR,
            supportingText
          );
          getRes.status(500).json({ error: "Internal Server Error" });
          return;
        }

        const payload = buildInsightsPayload(users || []);
        db.close();
        getRes.json(payload);
      });
  });
};
