import mongodb from "mongodb";

import {
  authenticate,
  getDomain,
  postSuccess,
  postFailure,
	slackPostRequest,
	SlackTitle,
	SLACK_HOOK
} from "../../utils/utils";
import {
  DATABASE_NAME,
  DATABASE_COLLECTION,
  STATUS_MESSAGE,
  SORT_BY,
  SUBSCRIPTION_STATUS
} from "./../../constants";
import { Sponsors } from "../../sponsors";

export const getSubscriptions = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving subscriptions...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;
      const { email } = findRes;

      const { t, sc, o, gs, sb, da, p } = postReq.query;

      const subscriptionCategories = sc.split(",");
			const subscriptionOrganizations = o != null && o.length > 0 ? o.split("||") : [];

      let [minGroupSize, maxGroupSize] = gs
        ? gs.split(",").map((val: string) => parseInt(val))
        : [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];

      let [minPrice, maxPrice] = p
        ? p.split(",").map((val: string) => parseInt(val))
        : [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];

      const dbo = db.db(DATABASE_NAME);

      const currentDate = new Date();
      const oldestDate = new Date(
        new Date().setDate(new Date().getDate() - parseInt(da) - 1)
      );

      const domain = getDomain(email);

      let sort: any;
      switch (sb) {
        case SORT_BY.DATE_ASC:
          sort = { createdDate: 1 };
          break;
        case SORT_BY.DATE_DES:
        default:
          sort = { createdDate: -1 };
      }

      const findQuery = {
        "subscriptionBrand.type": { $in: subscriptionCategories },
				...(subscriptionOrganizations.length > 0 && {"organization.name": { $in: subscriptionOrganizations }}),
        price: {
          $gte: minPrice,
          $lte: maxPrice
        },
        createdDate: {
          $lte: new Date(currentDate),
          $gte: new Date(oldestDate)
        },
        status: SUBSCRIPTION_STATUS.ACTIVE,
        $or: [
          { organization: null },
          { "organization.domains": { $in: [domain] } }
        ]
      };

      const regex = new RegExp(t, "i");

      if (t.length > 0) {
        Object.assign(findQuery, {
          $or: [
            { $text: { $search: t } },
            { "subscriptionBrand.name": { $regex: regex } }
          ]
        });
      }

      dbo
        .collection(DATABASE_COLLECTION.SUBSCRIPTIONS_COLLECTION)
        .find(findQuery)
        .sort(sort)
        .toArray()
        .then(results => {
          if (results.length === 0) {
            console.log("Unable to find subscriptions");
            db.close();
            postFailure(postRes, STATUS_MESSAGE.CANNOT_FIND_SUBSCRIPTIONS);
            return;
          }

          const data = results.sort((a: any, b: any) => {
            switch (sb) {
              case SORT_BY.DATE_ASC:
                return a.createdDate - b.createdDate;
              case SORT_BY.DATE_DES:
              default:
                return b.createdDate - a.createdDate;
            }
          });

					if (data.length >= 2) {
						data.splice(2, 0, Sponsors[0]);
					}

          db.close();
          postSuccess(postRes, {
            subscriptions: data
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
				Request: getSubscriptions
				Description: Caught error
				Error message: ${err.message}
				\`\`\`
			`;
			
			slackPostRequest(SLACK_HOOK.ERRORS, SlackTitle.NEW_ERROR, supportingText);
    });
};
