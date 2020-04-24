import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import ConversationCanvas from "./conversation-canvas";
import { IUserContext, UserDataContext } from "./../../user-context-provider";
import { baseGetRequest, basePostRequest } from "./../../base-requests";
import { IConversationData, IMessageData } from "./../../utils/utils";
import { STATUS_CODE, STATUS_MESSAGE } from "./../../utils/constants";

const ConversationProviderWithContext = (props: {
  userData: IUserContext;
  history: History;
  location: Location;
}) => {
  const _userData = props.userData;

  const { history, location } = props;

  var params = new URLSearchParams(location.search);
  const otherUserId = params.get("id");

  const [firstName, setFirstName] = useState("");
  const [messages, setMessages] = useState([] as IMessageData[]);

  const [text, setText] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  if (!_userData.user?.auth) {
    history.push("/signup");
  }

  const retrieveConversationResponseHandler = (data: any) => {
    const conversation = data?.body?.conversation as IConversationData;
    if (conversation) {
      console.log(conversation);
      setFirstName(conversation.firstName);
      setMessages(conversation.messages);
    }
  };

  const retrieveConversationErrorHandler = (error: any) => {
    console.log(error);
  };

  const retrieveConversation = () => {
    if (otherUserId) {
      baseGetRequest(
        "getconversation",
        [{ userId: otherUserId }],
        retrieveConversationResponseHandler,
        retrieveConversationErrorHandler,
        _userData.user?.auth
      );
    }
  };

  useEffect(() => {
    retrieveConversation();
    // eslint-disable-next-line
  }, []);

  return true ? (
    <ConversationCanvas
      currentUserId={_userData?.user?.userId as string}
      firstName={firstName}
      messages={messages}
      text={text}
      handleChange={handleChange}
    />
  ) : null;
};

const ConversationProvider = (props: { history: History; location: any }) => (
  <UserDataContext.Consumer>
    {userData => (
      <ConversationProviderWithContext
        userData={userData}
        history={props.history}
        location={props.location}
      />
    )}
  </UserDataContext.Consumer>
);

export default withRouter(ConversationProvider);
