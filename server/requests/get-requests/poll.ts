import mongodb from "mongodb";

import {
  postSuccess,
} from "./../../utils";

export const poll = (
  _mongoClient: typeof mongodb.MongoClient,
  _postReq: any,
  postRes: any
) => {
  console.log("Polling...");

	postSuccess(postRes, { message: "polo" });
};
