import React from "react";

interface IConversationCanvasProps {
  userId: string;
  text: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface IMessageData {
  userId: string;
  date: Date;
  message: string;
}

const ConversationCanvas = (props: IConversationCanvasProps) => {
  const { userId, text, handleChange } = props;

  const messages = [
    {
      userId: userId,
      date: new Date(),
      message: "Hello World !"
    },
    {
      userId: "abc",
      date: new Date(),
      message: "Hello World !"
    },
    {
      userId: userId,
      date: new Date(),
      message: "Hello World !"
    },
    {
      userId: "abc",
      date: new Date(),
      message: "Hello World !"
    },
    {
      userId: userId,
      date: new Date(),
      message: "Hello World !"
    },
    {
      userId: userId,
      date: new Date(),
      message: "Hello World !"
    },
    {
      userId: "abc",
      date: new Date(),
      message: "Hello World !"
    },
    {
      userId: "abc",
      date: new Date(),
      message: "Hello World !"
    }
  ];

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
    messageData.userId === userId
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
          <span className="conversation-header-first-name">John</span>
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
