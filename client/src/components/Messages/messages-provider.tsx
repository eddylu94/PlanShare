import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import MessagesCanvas from "./messages-canvas";
import { IUserContext, UserDataContext } from "./../../user-context-provider";
import {
  SOCKET_IO_PATH,
  baseGetRequest,
  basePostRequest,
  SOCKET_URL,
  ERROR_TYPE,
  slackPostRequest,
  SLACK_HOOK
} from "./../../base-requests";
import {
  log,
  IConversationSummary,
  IConversationData,
  IMessageData
} from "./../../utils/utils";
import { STATUS_CODE, STATUS_MESSAGE } from "./../../utils/constants";

import socketIOClient from "socket.io-client";

const MessagesProviderWithContext = (props: {
  userData: IUserContext;
  history: History;
  location: Location;
}) => {
  const _userData = props.userData;

  const currentUserId = _userData.user?.userId as string;

  const { history, location } = props;

  let _firstConversationRetrieval = false;

  const [
    isRetrievedConversationsDirty,
    setIsRetrievedConversationsDirty
  ] = useState(false);

  const [conversationsList, setConversationsList] = useState(
    [] as IConversationSummary[]
  );

  const [isConversationModalOpen, setIsConversationModalOpen] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [messages, setMessages] = useState([] as IMessageData[]);
  const [text, setText] = useState("");

  const [conversationId, setConversationId] = useState("");
  const [initialConversationId, setInitialConversationId] = useState("");

  let conversationByIdRetrieval = 0;

  var params = new URLSearchParams(location.search);
  const [otherUserId, setOtherUserId] = useState(params.get("id") as string);

  const [sockets, setSockets] = useState({} as any);

  if (!_userData.user?.auth) {
    history.push("/signup");
  }

  const retrieveConversationsListResponseHandler = (data: any) => {
    if (
      data.statusCode === STATUS_CODE.FAILURE &&
      data.statusMessage === STATUS_MESSAGE.USER_NOT_VALIDATED
    ) {
      log("User not validated");
      history.push("/validate");
    }

    let newConversationsList = data?.body
      ?.conversationsList as IConversationSummary[];
    if (newConversationsList) {
      setIsRetrievedConversationsDirty(true);

      newConversationsList = newConversationsList
        .filter(
          conversation =>
            !!conversation.lastMessage || conversation.userId === otherUserId
        )
        .sort((a, b) => {
          const aValue = a.userId === otherUserId ? 1 : 0;
          const bValue = b.userId === otherUserId ? 1 : 0;
          return bValue - aValue;
        });

      if (!conversationId && newConversationsList[0]) {
        setConversationId(newConversationsList[0].conversationId);
      }

      if (conversationId) {
        retrieveConversationById();
      } else if (otherUserId) {
        retrieveConversation();
      }

      log(newConversationsList);
      setConversationsList(newConversationsList);
    }
  };

  const retrieveConversationsListOnlyResponseHandler = (data: any) => {
    let newConversationsList = data?.body
      ?.conversationsList as IConversationSummary[];
    if (newConversationsList) {
      setIsRetrievedConversationsDirty(true);

      newConversationsList = newConversationsList
        .filter(
          conversation =>
            !!conversation.lastMessage || conversation.userId === otherUserId
        )
        .sort((a, b) => {
          const aValue = a.userId === otherUserId ? 1 : 0;
          const bValue = b.userId === otherUserId ? 1 : 0;
          return bValue - aValue;
        });

      log(newConversationsList);
      setConversationsList(newConversationsList);
    }
  };

  const retrieveConversationsListErrorHandler = (error: any) => {
    setIsRetrievedConversationsDirty(true);
    log(error);
  };

  const retrieveConversationsList = (isConversationsListOnly?: boolean) => {
    baseGetRequest(
      "getconversationslist",
      [],
      isConversationsListOnly
        ? retrieveConversationsListOnlyResponseHandler
        : retrieveConversationsListResponseHandler,
      retrieveConversationsListErrorHandler,
      _userData.user?.auth
    );
  };

  const retrieveConversationResponseHandler = (data: any) => {
    const conversation = data?.body?.conversation as IConversationData;
    if (conversation) {
      log(conversation);
      setConversationId(conversation.conversationId);
      setInitialConversationId(conversation.conversationId);
      setFirstName(conversation.firstName);
      setOtherUserId(conversation.userId);
      setMessages(conversation.messages);

      if (!_firstConversationRetrieval) {
        retrieveConversationsList();
      }
      _firstConversationRetrieval = true;
    }
  };

  const retrieveConversationErrorHandler = (error: any) => {
    log(error);
  };

  const retrieveConversation = () => {
    if (!otherUserId && !_firstConversationRetrieval) {
      retrieveConversationsList();
      _firstConversationRetrieval = true;
    } else if (otherUserId) {
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
      log(conversation);

      setConversationId(conversation.conversationId);
      setMessages(conversation.messages);
      setFirstName(conversation.firstName);
      setOtherUserId(conversation.userId);
    }
  };

  const retrieveConversationByIdErrorHandler = (error: any) => {
    setIsRetrievedConversationsDirty(true);
    log(error);
  };

  const retrieveConversationById = () => {
    if (conversationId) {
      if (new Date().getTime() - conversationByIdRetrieval >= 500) {
        conversationByIdRetrieval = new Date().getTime();
        baseGetRequest(
          "getconversationbyid",
          [{ conversationId }],
          retrieveConversationByIdResponseHandler,
          retrieveConversationByIdErrorHandler,
          _userData.user?.auth
        );
      }
    }
  };

  const handleSubmitResponseHandler = (data: any) => {
    log(data);
    if (data?.statusCode === STATUS_CODE.SUCCESS) {
      retrieveConversationsList();

      const postRequestData = {
        text: JSON.stringify({
          errorType: ERROR_TYPE.CLIENT,
          type: "SENT_MESSAGE",
          userId: _userData.user?.userId
        })
      };

      slackPostRequest(SLACK_HOOK.MESSAGES, postRequestData);

      if (sockets[conversationId]) {
        sockets[conversationId].emit(
          "send message",
          "Sending message from client..."
        );
      } else {
        retrieveConversationById();
      }
    }
  };

  const handleSubmitErrorHandler = (err: any) => {
    log(err);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleConversationSelection = (id: string) => {
    setConversationId(id);
    setIsConversationModalOpen(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!text) {
      event.preventDefault();
      return;
    }

    const postRequestData = {
      conversationId,
      message: text
    };
    log(postRequestData);

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
    retrieveConversation();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (conversationId) {
      log("Conversation ID:", conversationId);

      const currentSockets = Object.assign({}, sockets);

      if (!currentSockets[conversationId]) {
        currentSockets[conversationId] = socketIOClient(SOCKET_URL, {
          path: SOCKET_IO_PATH,
          query: {
            conversationId
          }
        });
      }

      setSockets(currentSockets);
    }

    retrieveConversationById();
    // eslint-disable-next-line
  }, [conversationId]);

  useEffect(() => {
    retrieveConversationsList(true);
    // eslint-disable-next-line
  }, [messages]);

  useEffect(() => {
    if (sockets) {
      const keys = Object.keys(sockets);
      keys
        .map(key => sockets[key])
        .forEach((socket: any) => {
          socket.off("room joined");
          socket.off("message received");

          socket.on("room joined", (data: any) => {
            log("Room joined:", data);
          });

          socket.on("message received", (data: any) => {
            log("Message received:", data);
            log(socket.query.conversationId);
            retrieveConversationById();
          });
        });
    }
    // eslint-disable-next-line
  }, [sockets]);

  const handleBackButtonClick = () => {
    setIsConversationModalOpen(false);
  };

  return isRetrievedConversationsDirty ? (
    <MessagesCanvas
      isConversationModalOpen={isConversationModalOpen}
      initialConversationId={initialConversationId}
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
      handleBackButtonClick={handleBackButtonClick}
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
