import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import ConversationCanvas from "./conversation-canvas";
import { IUserContext, UserDataContext } from "./../../user-context-provider";
import { baseGetRequest, basePostRequest } from "./../../base-requests";
import { STATUS_CODE, STATUS_MESSAGE } from "./../../utils/constants";

const ConversationProviderWithContext = (props: {
  userData: IUserContext;
  history: History;
}) => {
  const _userData = props.userData;

  const { history } = props;

  if (!_userData.user?.auth) {
    history.push("/signup");
  }

  useEffect(() => {
    // eslint-disable-next-line
  }, []);

  return true ? <ConversationCanvas /> : null;
};

const MessagesProvider = (props: { history: History }) => (
  <UserDataContext.Consumer>
    {userData => (
      <ConversationProviderWithContext
        userData={userData}
        history={props.history}
      />
    )}
  </UserDataContext.Consumer>
);

export default withRouter(MessagesProvider);
