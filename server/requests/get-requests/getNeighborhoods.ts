import mongodb from "mongodb";

import { postSuccess } from "../../utils/utils";
import { NEIGHBORHOODS } from "../../constants";

export const getNeighborhoods = (
  _mongoClient: typeof mongodb.MongoClient,
  _postReq: any,
  postRes: any
) => {
  console.log("Retrieving neighborhoods...");

  postSuccess(postRes, {
    neighborhoods: NEIGHBORHOODS
  });
};
