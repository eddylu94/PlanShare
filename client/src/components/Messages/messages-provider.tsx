import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import MessagesCanvas from "./messages-canvas";
import { IUserContext, UserDataContext } from "./../../user-context-provider";
import { baseGetRequest, basePostRequest } from "./../../base-requests";
import {
  IConversationSummary,
  IConversationData,
  IMessageData
} from "./../../utils/utils";
import { STATUS_CODE } from "./../../utils/constants";

const MessagesProviderWithContext = (props: {
  userData: IUserContext;
  history: History;
  location: Location;
}) => {
  const _userData = props.userData;

  const currentUserId = _userData.user?.userId as string;

  const { history, location } = props;

  const [
    isRetrievedConversationsDirty,
    setIsRetrievedConversationsDirty
  ] = useState(false);

  const [conversationsList, setConversationsList] = useState(
    [] as IConversationSummary[]
  );

  const [firstName, setFirstName] = useState("");
  const [messages, setMessages] = useState([] as IMessageData[]);
  const [text, setText] = useState("");

  var params = new URLSearchParams(location.search);
  const [conversationId, setConversationId] = useState(params.get("c"));

  const [otherUserId, setUserId] = useState(params.get("id") as string);

  if (!_userData.user?.auth) {
    history.push("/signup");
  }

  const retrieveConversationsListResponseHandler = (data: any) => {
    const conversationsList = data?.body?.conversationsList as any;
    if (conversationsList) {
      setIsRetrievedConversationsDirty(true);
      console.log(conversationsList);
      setConversationsList(conversationsList);
    }
  };

  const retrieveConversationsListErrorHandler = (error: any) => {
    setIsRetrievedConversationsDirty(true);
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

  const retrieveConversationResponseHandler = (data: any) => {
    const conversation = data?.body?.conversation as IConversationData;
    if (conversation) {
      console.log(conversation);
      setConversationId(conversation.conversationId);
      setFirstName(conversation.firstName);
      setUserId(conversation.userId);
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

  const retrieveConversationByIdResponseHandler = (data: any) => {
    const conversation = data?.body?.conversation as IConversationData;
    if (conversation) {
      setIsRetrievedConversationsDirty(true);
      console.log(conversation);
      setConversationId(conversation.conversationId);
      setMessages(conversation.messages);
      setFirstName(conversation.firstName);
      setUserId(conversation.userId);
    }
  };

  const retrieveConversationByIdErrorHandler = (error: any) => {
    setIsRetrievedConversationsDirty(true);
    console.log(error);
  };

  const retrieveConversationById = () => {
    if (conversationId) {
      baseGetRequest(
        "getconversationbyid",
        [{ conversationId }],
        retrieveConversationByIdResponseHandler,
        retrieveConversationByIdErrorHandler,
        _userData.user?.auth
      );
    }
  };

  const handleSubmitResponseHandler = (data: any) => {
    console.log(data);
    if (data?.statusCode === STATUS_CODE.SUCCESS) {
      retrieveConversationsList();
      retrieveConversationById();
    }
  };

  const handleSubmitErrorHandler = (err: any) => {
    console.log(err);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleConversationSelection = (id: string) => {
    setConversationId(id);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const postRequestData = {
      conversationId,
      message: text
    };
    console.log(postRequestData);

    basePostRequest(
      "sendmessage",
      postRequestData,
      handleSubmitResponseHandler,
      handleSubmitErrorHandler,
      _userData.user?.auth
    );

    setText("");

    event.preventDefault();
  };

  useEffect(() => {
    retrieveConversationsList();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    retrieveConversationsList();
    if (conversationId) {
      retrieveConversationById();
    } else if (otherUserId) {
      retrieveConversation();
    }
    // eslint-disable-next-line
  }, [conversationId]);

  return isRetrievedConversationsDirty ? (
    <MessagesCanvas
      conversationId={conversationId}
      conversationsList={conversationsList}
      currentUserId={currentUserId}
      firstName={firstName}
      userId={otherUserId as string}
      messages={messages}
      text={text}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleConversationSelection={handleConversationSelection}
    />
  ) : null;
};

const MessagesProvider = (props: { history: History; location: any }) => (
  <UserDataContext.Consumer>
    {userData => (
      <MessagesProviderWithContext
        userData={userData}
        history={props.history}
        location={props.location}
      />
    )}
  </UserDataContext.Consumer>
);

export default withRouter(MessagesProvider);
