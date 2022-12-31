// Third-party libraries
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Scrollbars from "react-custom-scrollbars";

// Utilites
import { IMessageData } from "./../../utils/utils";
import { InputChangeEvent } from "../../utils/interfaces";

interface IConversationCanvasProps {
  currentUserId: string;
  firstName: string;
  userId: string;
  messages: IMessageData[];
  text: string;
  handleChange: (event: InputChangeEvent) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleConversationSelection: (id: string) => void;
  isConversationModalOpen?: boolean;
  handleBackButtonClick?: () => void;
}

const ConversationCanvas = (props: IConversationCanvasProps) => {
  const {
    currentUserId,
    firstName,
    userId,
    messages,
    text,
    isConversationModalOpen,
    handleChange,
    handleSubmit,
    handleBackButtonClick
  } = props;

  const messagesEndRef = useRef(null);

  const [previousMessagesLength, setPreviousMessagesLength] = useState(0);

  const scrollToBottom = () => {
    if (messagesEndRef) {
      const behavior = previousMessagesLength > 0 ? { behavior: "smooth" } : {};
      (messagesEndRef as any).current.scrollIntoView(behavior);
      setPreviousMessagesLength(messages.length);
    }
  };

  useEffect(scrollToBottom, [messages]);

  const renderCurrentUserMessage = (
    messageData: IMessageData,
    index: number
  ) => (
    <div
      key={"conversation-message-" + index}
      className="conversation-message conversation-current-user-message"
    >
      {messageData.message}
    </div>
  );

  const renderOtherUserMessage = (messageData: IMessageData, index: number) => (
    <div
      key={"conversation-message-" + index}
      className="conversation-message conversation-other-user-message"
    >
      {messageData.message}
    </div>
  );

  const renderMessage = (messageData: IMessageData, index: number) =>
    messageData.userId === currentUserId
      ? renderCurrentUserMessage(messageData, index)
      : renderOtherUserMessage(messageData, index);

  const renderMessages = (messages: IMessageData[]) => {
    return messages.map((messageData, i) => renderMessage(messageData, i));
  };

  return (
    <div className="conversation-container">
      <div className="conversation-header">
        {isConversationModalOpen && (
          <button
            className="conversation-back-button"
            onClick={handleBackButtonClick}
          >
            <img
              alt="Back to messages"
              className="conversation-back-arrow-icon"
              src="/back_arrow_icon.png"
            />
          </button>
        )}
        <img
          alt="Profile"
          className="conversation-header-profile-picture"
          src="/profile_picture_placeholder.png"
        />
        <Link to={`profile?id=${userId}`}>
          <span className="conversation-header-first-name">{firstName}</span>
        </Link>
      </div>

      <Scrollbars className="conversation-scrollbars-container">
        <div className="conversation-body">
          {renderMessages(messages)}
          <div ref={messagesEndRef}></div>
        </div>
      </Scrollbars>

      <div className="conversation-footer">
        <form className="conversation-bar" onSubmit={handleSubmit}>
          <input
            type="text"
            className="conversation-text-input"
            placeholder="Enter a message..."
            value={text}
            onChange={handleChange}
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
