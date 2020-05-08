import React, { useState } from "react";

import { log } from "./utils/utils";

export type UserDataType = {
  userId: string | null;
  auth: string | null;
  firstName: string | null;
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
  const firstName = localStorage.getItem("firstName");

  const [user, setUser] = useState({ userId, auth, firstName });

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
