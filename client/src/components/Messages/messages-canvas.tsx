import React from "react";

import Conversation from "./conversation";
import { IConversationSummary, IMessageData } from "./../../utils/utils";
import { DEVICE_MODE } from "./../../utils/constants";

import useMediaQuery from "@material-ui/core/useMediaQuery";

import moment from "moment";

interface IMessagesCanvasProps {
  isConversationModalOpen: boolean;
  initialConversationId: string | null;
  conversationId: string | null;
  conversationsList: IConversationSummary[];
  currentUserId: string;
  firstName: string;
  userId: string;
  messages: IMessageData[];
  text: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleConversationSelection: (id: string) => void;
  handleBackButtonClick: () => void;
}

const MessagesCanvas = (props: IMessagesCanvasProps) => {
  const {
    isConversationModalOpen,
    initialConversationId,
    conversationId,
    conversationsList,
    currentUserId,
    firstName,
    userId,
    messages,
    text,
    handleChange,
    handleSubmit,
    handleConversationSelection,
    handleBackButtonClick
  } = props;

  const renderConversationSummary = (
    conversation: IConversationSummary,
    index: number
  ) => {
    const { firstName, lastMessage } = conversation;
    const conversationSummaryConversationId = conversation.conversationId;

    let lastMessageComponent: any;
    if (lastMessage) {
      const { date, message, firstName } = lastMessage;
      lastMessageComponent = (
        <>
          <div className="message-summary-message">{`${firstName}: ${message}`}</div>
          <div className="message-summary-date">
            {moment(date).format("lll")}
          </div>
        </>
      );
    } else {
      lastMessageComponent = (
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
    }

    return lastMessage ||
      conversationId === conversationSummaryConversationId ||
      initialConversationId === conversationSummaryConversationId ? (
      <div
        className="message-summary"
        key={"message-summary-" + index}
        onClick={() =>
          handleConversationSelection(conversationSummaryConversationId)
        }
      >
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

  const small = useMediaQuery("(max-width:768px)");
  const medium = useMediaQuery("(min-width:768px)");
  const large = useMediaQuery("(min-width:992px)");
  const xLarge = useMediaQuery("(min-width:1200px)");

  let deviceMode: string;
  if (small) {
    deviceMode = DEVICE_MODE.MOBILE;
  } else if (medium && !large) {
    deviceMode = DEVICE_MODE.TABLET;
  } else if (large && !xLarge) {
    deviceMode = DEVICE_MODE.DESKTOP;
  } else {
    deviceMode = DEVICE_MODE.LARGE_DESKTOP;
  }

  const messagesPanes =
    (conversationListComponent && conversationListComponent.length) ||
    conversationId ? (
      <div className="messages-container">
        {deviceMode === DEVICE_MODE.MOBILE && isConversationModalOpen ? (
          <div className="conversation-modal">
            <Conversation
              isConversationModalOpen={isConversationModalOpen}
              currentUserId={currentUserId}
              firstName={firstName}
              userId={userId}
              messages={messages}
              text={text}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              handleConversationSelection={handleConversationSelection}
              handleBackButtonClick={handleBackButtonClick}
            />
          </div>
        ) : null}
        <div className="message-summaries-pane">
          {conversationListComponent}
        </div>
        {deviceMode !== DEVICE_MODE.MOBILE ? (
          <Conversation
            currentUserId={currentUserId}
            firstName={firstName}
            userId={userId}
            messages={messages}
            text={text}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleConversationSelection={handleConversationSelection}
          />
        ) : null}
      </div>
    ) : (
      <div className="messages-container">
        <div className="messages-no-messages">
          You currently have no messages
        </div>
      </div>
    );

  return (
    <div
      className="page-container"
      style={{ alignItems: "center", padding: 0 }}
    >
      <div className="page-wrapper">{messagesPanes}</div>
    </div>
  );
};

export default MessagesCanvas;
