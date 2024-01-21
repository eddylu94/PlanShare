import mongodb from "mongodb";

import { postSuccess } from "../../utils/utils";
import { ORGANIZATION } from "../../organizations";

export const getOrganizations = (
  _mongoClient: typeof mongodb.MongoClient,
  _postReq: any,
  postRes: any
) => {
  console.log("Retrieving organizations...");
  
	postSuccess(postRes, {
		organizations: Object.values(ORGANIZATION),
	});
};
