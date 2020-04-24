import React from "react";

import { IMessageData } from "./../../utils/utils";

interface IConversationCanvasProps {
  currentUserId: string;
  firstName: string;
  messages: IMessageData[];
  text: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ConversationCanvas = (props: IConversationCanvasProps) => {
  const { currentUserId, firstName, messages, text, handleChange } = props;

  // const messages = [
  //   {
  //     userId: currentUserId,
  //     date: new Date(),
  //     message: "Hello World !"
  //   },
  //   {
  //     userId: "abc",
  //     date: new Date(),
  //     message: "Hello World !"
  //   },
  //   {
  //     userId: currentUserId,
  //     date: new Date(),
  //     message: "Hello World !"
  //   },
  //   {
  //     userId: "abc",
  //     date: new Date(),
  //     message: "Hello World !"
  //   },
  //   {
  //     userId: currentUserId,
  //     date: new Date(),
  //     message: "Hello World !"
  //   },
  //   {
  //     userId: currentUserId,
  //     date: new Date(),
  //     message: "Hello World !"
  //   },
  //   {
  //     userId: "abc",
  //     date: new Date(),
  //     message: "Hello World !"
  //   },
  //   {
  //     userId: "abc",
  //     date: new Date(),
  //     message: "Hello World !"
  //   }
  // ];

  const renderCurrentUserMessage = (messageData: IMessageData) => {
    return (
      <div className="conversation-message conversation-current-user-message">
        {messageData.message}
      </div>
    );
  };

  const renderOtherUserMessage = (messageData: IMessageData) => {
    return (
      <div className="conversation-message conversation-other-user-message">
        {messageData.message}
      </div>
    );
  };

  const renderMessage = (messageData: IMessageData) =>
    messageData.userId === currentUserId
      ? renderCurrentUserMessage(messageData)
      : renderOtherUserMessage(messageData);

  const renderMessages = (messages: IMessageData[]) => {
    return messages.map(messageData => renderMessage(messageData));
  };

  return (
    <div className="page-container">
      <div className="conversation-container">
        <div className="conversation-header">
          <img
            alt="Profile"
            className="conversation-header-profile-picture"
            src="/profile_picture_placeholder.png"
          />
          <span className="conversation-header-first-name">{firstName}</span>
        </div>
        <div className="conversation-body">{renderMessages(messages)}</div>
        <div className="conversation-footer">
          <div className="conversation-bar">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationCanvas;
