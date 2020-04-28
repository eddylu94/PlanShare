import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import { IMessageData } from "./../../utils/utils";

interface IConversationCanvasProps {
  currentUserId: string;
  firstName: string;
  userId: string;
  messages: IMessageData[];
  text: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleConversationSelection: (id: string) => void;
}

const ConversationCanvas = (props: IConversationCanvasProps) => {
  const {
    currentUserId,
    firstName,
    userId,
    messages,
    text,
    handleChange,
    handleSubmit
  } = props;

  const renderCurrentUserMessage = (
    messageData: IMessageData,
    index: number
  ) => {
    return (
      <div
        key={"conversation-message-" + index}
        className="conversation-message conversation-current-user-message"
      >
        {messageData.message}
      </div>
    );
  };

  const renderOtherUserMessage = (messageData: IMessageData, index: number) => {
    return (
      <div
        key={"conversation-message-" + index}
        className="conversation-message conversation-other-user-message"
      >
        {messageData.message}
      </div>
    );
  };

  const renderMessage = (messageData: IMessageData, index: number) =>
    messageData.userId === currentUserId
      ? renderCurrentUserMessage(messageData, index)
      : renderOtherUserMessage(messageData, index);

  const renderMessages = (messages: IMessageData[]) => {
    return messages.map((messageData, i) => renderMessage(messageData, i));
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef) {
      (messagesEndRef as any).current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="conversation-container">
      <div className="conversation-header">
        <img
          alt="Profile"
          className="conversation-header-profile-picture"
          src="/profile_picture_placeholder.png"
        />
        <Link to={`profile?id=${userId}`}>
          <span className="conversation-header-first-name">{firstName}</span>
        </Link>
      </div>
      <div className="conversation-body">
        {renderMessages(messages)}
        <div ref={messagesEndRef} />
      </div>
      <div className="conversation-footer">
        <div className="conversation-warning">
          Never share your bank account or debit/credit card information
        </div>
        <form className="conversation-bar" onSubmit={handleSubmit}>
          <input
            type="text"
            className="conversation-text-input"
            placeholder="Search for a subscription"
            value={text}
            onChange={handleChange}
            autoFocus
          />
          <button className="conversation-send-button">
            <img
              alt="Send"
              className="conversation-send-icon"
              src="/send_icon.png"
            />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConversationCanvas;
