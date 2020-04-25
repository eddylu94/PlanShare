import React from "react";

import Conversation from "./conversation";
import { IConversationSummary, IMessageData } from "./../../utils/utils";

import moment from "moment";

interface IMessagesCanvasProps {
  conversationId: string | null;
  conversationsList: IConversationSummary[];
  currentUserId: string;
  firstName: string;
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
    const { firstName, lastMessage, conversationId } = conversation;

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
    }

    return (
      <div
        className="message-summary"
        key={"message-summary-" + index}
        onClick={() => handleConversationSelection(conversationId)}
      >
        <div className="message-summary-header">
          <img
            alt="Profile"
            className="conversation-header-profile-picture"
            src="/profile_picture_placeholder.png"
          />
          <span className="conversation-header-first-name">{firstName}</span>
        </div>
        {lastMessage ? lastMessageComponent : null}
      </div>
    );
  };

  const renderConversationsList = () =>
    conversationsList.map((conversation, i) =>
      renderConversationSummary(conversation, i)
    );

  return conversationsList && conversationsList.length ? (
    <div className="messages-container">
      <div className="message-summaries-pane">{renderConversationsList()}</div>
      {conversationId ? (
        <Conversation
          currentUserId={currentUserId}
          firstName={firstName}
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
