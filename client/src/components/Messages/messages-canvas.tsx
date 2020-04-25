import React from "react";

import Conversation from "./conversation";
import { IConversationSummary, IMessageData } from "./../../utils/utils";

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
    const { date, message } = lastMessage;

    return (
      <div
        className="message-summary"
        key={"message-summary-" + index}
        onClick={() => handleConversationSelection(conversationId)}
      >
        <div>{firstName}</div>
        <div>{date.toString()}</div>
        <div>{message}</div>
      </div>
    );
  };

  const renderConversationsList = () =>
    conversationsList.map((conversation, i) =>
      renderConversationSummary(conversation, i)
    );

  return (
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
  );
};

export default MessagesCanvas;
