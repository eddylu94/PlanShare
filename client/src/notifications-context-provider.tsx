import React, { useState } from "react";

import { log } from "@utils/utils";

export type NotificationsDataType = {
  unreadMessagesCount: number;
};

export interface INotificationsContext {
  notifications: NotificationsDataType | undefined;
  updateNotifications: (data: NotificationsDataType) => void;
}

export const NotificationsDataContext = React.createContext(
  {} as INotificationsContext
);

export const NotificationsContextProvider = (props: { children: any }) => {
  const { children } = props;

  const unreadMessagesCount = 0;

  const [notifications, setNotifications] = useState({ unreadMessagesCount });

  const updateNotifications = (notificationsData: NotificationsDataType) => {
    setNotifications(notificationsData);
    log(notificationsData);
  };

  return (
    <NotificationsDataContext.Provider
      value={{ notifications, updateNotifications }}
    >
      {children}
    </NotificationsDataContext.Provider>
  );
};
