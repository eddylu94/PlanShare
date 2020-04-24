import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import MessagesCanvas from "./messages-canvas";
import { IUserContext, UserDataContext } from "./../../user-context-provider";
import { baseGetRequest, basePostRequest } from "./../../base-requests";
import { IConversationSummary } from "./../../utils/utils";
import { STATUS_CODE, STATUS_MESSAGE } from "./../../utils/constants";

const MessagesProviderWithContext = (props: {
  userData: IUserContext;
  history: History;
}) => {
  const _userData = props.userData;

  const { history } = props;

  const [conversationsList, setConversationsList] = useState(
    [] as IConversationSummary[]
  );

  if (!_userData.user?.auth) {
    history.push("/signup");
  }

  const retrieveConversationsListResponseHandler = (data: any) => {
    const conversationsList = data?.body?.conversationsList as any;
    if (conversationsList) {
      console.log(conversationsList);
      setConversationsList(conversationsList);
    }
  };

  const retrieveConversationsListErrorHandler = (error: any) => {
    console.log(error);
  };

  const retrieveConversationsList = () => {
    baseGetRequest(
      "getconversationslist",
      [],
      retrieveConversationsListResponseHandler,
      retrieveConversationsListErrorHandler,
      _userData.user?.auth
    );
  };

  useEffect(() => {
    retrieveConversationsList();
    // eslint-disable-next-line
  }, []);

  return true ? <MessagesCanvas conversationsList={conversationsList} /> : null;
};

const MessagesProvider = (props: { history: History }) => (
  <UserDataContext.Consumer>
    {userData => (
      <MessagesProviderWithContext
        userData={userData}
        history={props.history}
      />
    )}
  </UserDataContext.Consumer>
);

export default withRouter(MessagesProvider);
