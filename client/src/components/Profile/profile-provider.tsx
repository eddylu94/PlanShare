import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import ProfileCanvas from "./profile-canvas";
import { IUserContext, UserDataContext } from "./../../user-context-provider";
import { baseGetRequest } from "./../../base-requests";
import { IProfileOrganizationData } from "./../../utils/utils";
import { STATUS_CODE, STATUS_MESSAGE } from "./../../utils/constants";

const ProfileProviderWithContext = (props: {
  userData: IUserContext;
  history: History;
}) => {
  const _userData = props.userData;

  // Whether at least one request has been executed for profile
  const [isRetrievedProfileDirty, setIsRetrievedProfileDirty] = useState(false);

  const { history } = props;

  const [firstName, setFirstName] = useState("");
  const [organizations, setOrganizations] = useState(
    [] as IProfileOrganizationData[]
  );
  const [joinedDate, setJoinedDate] = useState(-1);

  if (!_userData.user?.auth) {
    history.push("/signup");
  }

  console.log(_userData);

  const retrieveProfileResponseHandler = (data: any) => {
    if (
      data.statusCode === STATUS_CODE.FAILURE &&
      data.statusMessage === STATUS_MESSAGE.USER_NOT_VALIDATED
    ) {
      console.log("User not validated");
      history.push("/validate");
    }

    const profileData = data?.body?.profileData;
    if (profileData) {
      console.log(profileData);

      setFirstName(profileData.firstName);
      setOrganizations(profileData.organizations);
      setJoinedDate(profileData.joinedDate);
      setIsRetrievedProfileDirty(true);
    }
  };

  const retrieveProfileErrorHandler = (error: any) => {
    console.log(error);
  };

  const retrieveProfile = () => {
    baseGetRequest(
      "getprofile",
      [],
      retrieveProfileResponseHandler,
      retrieveProfileErrorHandler,
      _userData.user?.auth
    );
  };

  const retrieveSubscriptionsByUserResponseHandler = (data: any) => {
    if (data) {
      console.log(data.subscriptions);
    }
  };

  const retrieveSubscriptionsByUserErrorHandler = (error: any) => {
    console.log(error);
  };

  const retrieveSubscriptionsByUser = () => {
    baseGetRequest(
      "getsubscriptionsbyauthor",
      [{ userId: _userData.user?.userId as string }],
      retrieveSubscriptionsByUserResponseHandler,
      retrieveSubscriptionsByUserErrorHandler,
      _userData.user?.auth
    );
  };

  useEffect(() => {
    retrieveProfile();
    retrieveSubscriptionsByUser();
    // eslint-disable-next-line
  }, []);

  return isRetrievedProfileDirty ? (
    <ProfileCanvas
      firstName={firstName}
      organizations={organizations}
      joinedDate={joinedDate}
    />
  ) : null;
};

const ProfileProvider = (props: { history: History }) => (
  <UserDataContext.Consumer>
    {userData => (
      <ProfileProviderWithContext userData={userData} history={props.history} />
    )}
  </UserDataContext.Consumer>
);

export default withRouter(ProfileProvider);
