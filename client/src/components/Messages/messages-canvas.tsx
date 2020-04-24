import React from "react";

import { IConversationSummary } from "./../../utils/utils";

interface IMessagesCanvasProps {
  conversationsList: IConversationSummary[];
}

const MessagesCanvas = (props: IMessagesCanvasProps) => {
  const { conversationsList } = props;

  const renderConversationSummary = (conversation: IConversationSummary) => {
    const { firstName, lastMessage } = conversation;
    const { userId, date, message } = lastMessage;

    return (
      <div>
        <div>{firstName}</div>
        {/* <div>{userId}</div> */}
        <div>{date.toString()}</div>
        <div>{message}</div>
      </div>
    );
  };

  const renderConversationsList = () =>
    conversationsList.map(conversation =>
      renderConversationSummary(conversation)
    );

  return <div className="page-container">{renderConversationsList()}</div>;
};

export default MessagesCanvas;
