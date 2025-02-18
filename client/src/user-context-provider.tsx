import React, { useState } from "react";

import { log } from "@utils/utils";

export type UserDataType = {
  userId: string | null;
  auth: string | null;
  username: string | null;
};

export interface IUserContext {
  user: UserDataType | undefined;
  updateUser: (data: UserDataType) => void;
}

export const UserDataContext = React.createContext({} as IUserContext);

export const UserContextProvider = (props: { children: any }) => {
  const { children } = props;

  const userId = localStorage.getItem("userId");
  const auth = localStorage.getItem("auth");
  const username = localStorage.getItem("username");

  const [user, setUser] = useState({ userId, auth, username });

  const updateUser = (userData: UserDataType) => {
    setUser(userData);
    log(userData);
  };

  return (
    <UserDataContext.Provider value={{ user, updateUser }}>
      {children}
    </UserDataContext.Provider>
  );
};
