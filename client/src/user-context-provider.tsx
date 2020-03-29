import React, { useState } from "react";

export type UserDataType = {
  userId: string | null;
  auth: string | null;
  firstName: string;
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
  const firstName = "";

  const [user, setUser] = useState({ userId, auth, firstName });

  const updateUser = (userData: UserDataType) => {
    setUser(userData);
    console.log(userData);
  };

  return (
    <UserDataContext.Provider value={{ user, updateUser }}>
      {children}
    </UserDataContext.Provider>
  );
};
