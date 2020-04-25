import React from "react";

import Conversation from "./conversation";
import { IConversationSummary, IMessageData } from "./../../utils/utils";

import moment from "moment";

interface IMessagesCanvasProps {
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
}

const MessagesCanvas = (props: IMessagesCanvasProps) => {
  const {
    conversationId,
    conversationsList,
    currentUserId,
    firstName,
    userId,
    messages,
    text,
    handleChange,
    handleSubmit,
    handleConversationSelection
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
          <div className="message-summary-message">Conversation is empty</div>
          <div className="message-summary-date"></div>
        </>
      );
    }

    return lastMessage ||
      conversationId === conversationSummaryConversationId ? (
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

  return (conversationListComponent && conversationListComponent.length) ||
    conversationId ? (
    <div className="messages-container">
      <div className="message-summaries-pane">{conversationListComponent}</div>
      {conversationId ? (
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
      <div className="messages-no-messages">You currently have no messages</div>
    </div>
  );
};

export default MessagesCanvas;
