import mongodb from "mongodb";

import { retrieveOrganizationByDomain } from "./../../organizations";
import {
  authenticate,
  postSuccess,
  getDomain,
  postFailure
} from "./../../utils";
import { STATUS_MESSAGE } from "../../constants";

export const getOrganization = (
  mongoClient: typeof mongodb.MongoClient,
  postReq: any,
  postRes: any
) => {
  console.log("Retrieving organization...");
  authenticate(mongoClient, postReq, postRes)
    .then(res => {
      const [db, findRes] = res;

      const { email } = findRes;

      if (!email) {
        postFailure(postRes, STATUS_MESSAGE.NO_EMAIL_EXISTS);
      }

      const domain = getDomain(email);
      const organization = retrieveOrganizationByDomain(domain);

      db.close();
      postSuccess(postRes, {
        organization
      });
    })
    .catch(err => {
      console.log(err);
    });
};
