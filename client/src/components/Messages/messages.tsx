// Third-party libraries
import React, { useState, useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";
import moment from "moment";
import socketIOClient from "socket.io-client";
import ContactMailTwoToneIcon from "@mui/icons-material/ContactMailTwoTone";

// Components
import Conversation from "./conversation";

// API
import {
  SOCKET_IO_PATH,
  SOCKET_URL,
  ERROR_TYPE,
  slackPostRequest,
  SLACK_HOOK
} from "base-requests";
import {
  getConversation,
  getConversationById,
  getConversationList
} from "@requests/getRequests";
import { sendMessage } from "@requests/postRequests";

// Utilities
import { NotificationsDataContext } from "notifications-context-provider";
import { UserDataContext } from "user-context-provider";
import {
  log,
  IConversationSummary,
  IConversationData,
  IMessageData,
  useDeviceMode
} from "@utils/utils";
import { STATUS_CODE, STATUS_MESSAGE, DEVICE_MODE } from "@utils/constants";
import { InputChangeEvent } from "@utils/interfaces";

const MessagesProvider = (props: { history: History; location: any }) => {
  let _firstConversationRetrieval = false;
  let _conversationByIdRetrieval = 0;

  const { history, location } = props;

  const _userData = useContext(UserDataContext);
  const notificationsData = useContext(NotificationsDataContext);

  const currentUserId = _userData.user?.userId as string;

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

  const deviceMode = useDeviceMode();

  const params = new URLSearchParams(location.search);
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

    const unreadMessages = data?.body?.unreadMessages;
    if (unreadMessages != null) {
      notificationsData.updateNotifications({
        unreadMessagesCount: unreadMessages
      });
    }

    let newConversationsList = data?.body?.conversationsList as Array<
      IConversationSummary
    >;
    if (newConversationsList) {
      setIsRetrievedConversationsDirty(true);

      newConversationsList = newConversationsList
        .filter(
          conversation =>
            !!conversation.lastMessage || conversation.userId === otherUserId
        )
        .sort((a, b) => {
          if (!b.lastMessage) {
            return 1;
          }

          if (!a.lastMessage) {
            return -1;
          }

          return (
            new Date(b.lastMessage.date).getTime() -
            new Date(a.lastMessage.date).getTime()
          );
        });

      // if (!conversationId && newConversationsList[0]) {
      //   setConversationId(newConversationsList[0].conversationId);
      // }

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
    const unreadMessages = data?.body?.unreadMessages;
    if (unreadMessages != null) {
      notificationsData.updateNotifications({
        unreadMessagesCount: unreadMessages
      });
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
          if (!b.lastMessage) {
            return 1;
          }

          if (!a.lastMessage) {
            return -1;
          }

          return (
            new Date(b.lastMessage.date).getTime() -
            new Date(a.lastMessage.date).getTime()
          );
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
    getConversationList(
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

  const retrieveConversation = () => {
    if (!otherUserId && !_firstConversationRetrieval) {
      retrieveConversationsList();
      _firstConversationRetrieval = true;
    } else if (otherUserId) {
      getConversation(
        otherUserId,
        retrieveConversationResponseHandler,
        log,
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
    if (
      conversationId &&
      new Date().getTime() - _conversationByIdRetrieval >= 500
    ) {
      _conversationByIdRetrieval = new Date().getTime();
      getConversationById(
        conversationId,
        retrieveConversationByIdResponseHandler,
        retrieveConversationByIdErrorHandler,
        _userData.user?.auth
      );
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

  const handleChange = (event: InputChangeEvent) => {
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

    sendMessage(
      conversationId,
      text,
      handleSubmitResponseHandler,
      log,
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

  const renderConversationSummary = (
    conversation: IConversationSummary,
    index: number
  ) => {
    const { firstName, lastMessage } = conversation;
    const conversationSummaryConversationId = conversation.conversationId;

    const lastMessageComponent = lastMessage ? (
      <>
        <div className="message-summary-message">{`${lastMessage.firstName}: ${lastMessage.message}`}</div>
        <div className="message-summary-date">
          {moment(lastMessage.date).format("lll")}
        </div>
      </>
    ) : (
      <>
        <div
          className="message-summary-message"
          style={{ fontStyle: "italic" }}
        >
          New draft
        </div>
        <div className="message-summary-date"></div>
      </>
    );

    let messageSummaryClassName = "message-summary";
    if (!conversation.isRead) {
      messageSummaryClassName += " message-summary--unread";
    }

    return lastMessage ||
      conversationId === conversationSummaryConversationId ||
      initialConversationId === conversationSummaryConversationId ? (
      <div
        className={messageSummaryClassName}
        key={"message-summary-" + index}
        onClick={() =>
          handleConversationSelection(conversationSummaryConversationId)
        }
      >
        {!conversation.isRead && (
          <div className="message-summary-unread-indicator"></div>
        )}
        <div className="message-summary-header">
          <img
            alt="Profile"
            className="conversation-header-profile-picture"
            src="/profile_picture_placeholder.png"
          />
          <span className="conversation-header-first-name">{firstName}</span>
        </div>
        {lastMessageComponent}
      </div>
    ) : (
      undefined
    );
  };

  const conversationListComponent = conversationsList
    .map((conversation, i) => renderConversationSummary(conversation, i))
    .filter(conversationComponent => !!conversationComponent);

  const messagesPanes =
    (conversationListComponent && conversationListComponent.length > 0) ||
    conversationId ? (
      <div className="messages-container">
        {conversationId !== "" &&
          deviceMode === DEVICE_MODE.MOBILE &&
          isConversationModalOpen && (
            <div className="conversation-modal">
              <Conversation
                isConversationModalOpen={isConversationModalOpen}
                currentUserId={currentUserId}
                firstName={firstName}
                userId={otherUserId}
                messages={messages}
                text={text}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleConversationSelection={handleConversationSelection}
                handleBackButtonClick={handleBackButtonClick}
              />
            </div>
          )}
        <div className="message-summaries-pane">
          {conversationListComponent}
        </div>
        {conversationId === "" && deviceMode !== DEVICE_MODE.MOBILE && (
          <div className="conversation-no-conversation-selected">
            Please select a conversation
          </div>
        )}
        {conversationId !== "" && deviceMode !== DEVICE_MODE.MOBILE && (
          <Conversation
            currentUserId={currentUserId}
            firstName={firstName}
            userId={otherUserId}
            messages={messages}
            text={text}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleConversationSelection={handleConversationSelection}
          />
        )}
      </div>
    ) : (
      <div className="messages-no-messages-container">
        <div className="messages-no-messages">
          <ContactMailTwoToneIcon
            style={{
              width: 100,
              height: 100,
              color: "#6c5dbd",
              marginBottom: 10
            }}
          />

          <div>
            <span className="i">You currently have no messages.</span>
            <br />
            <br />
            To start a new message, you can:
            <ol>
              <li>
                Go to the{" "}
                <a className="b" href="/search">
                  Search page
                </a>
              </li>
              <li>Select a listing of interest</li>
              <li>
                Select <span className="b">Message</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    );

  return isRetrievedConversationsDirty ? (
    <div
      className="page-container"
      style={{ alignItems: "center", padding: 0 }}
    >
      <div className="page-wrapper">{messagesPanes}</div>
    </div>
  ) : null;
};

export default withRouter(MessagesProvider);
