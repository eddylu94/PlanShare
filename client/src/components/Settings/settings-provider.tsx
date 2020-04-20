import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

import SettingsCanvas from "./settings-canvas";
import { IUserContext, UserDataContext } from "./../../user-context-provider";
import { baseGetRequest, basePostRequest } from "./../../base-requests";
import { STATUS_CODE, STATUS_MESSAGE } from "./../../utils/constants";

const SettingsProviderWithContext = (props: {
  userData: IUserContext;
  history: History;
}) => {
  const _userData = props.userData;

  // Whether at least one request has been executed for profile
  const [isRetrievedProfileDirty, setIsRetrievedProfileDirty] = useState(false);

  const { history } = props;

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  if (!_userData.user?.auth) {
    history.push("/signup");
  }

  console.log(_userData);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPass(value);
  };

  const deleteUserResponseHandler = (data: any) => {
    console.log(data);
    if (
      data.statusCode === STATUS_CODE.FAILURE &&
      data.statusMessage === STATUS_MESSAGE.INCORRECT_CRED
    ) {
      alert("Incorrect password");
    } else if (data.statusCode === STATUS_CODE.SUCCESS) {
      alert("Account has been successfully deleted");

      _userData.updateUser({
        userId: "",
        auth: "",
        firstName: ""
      });

      localStorage.setItem("userId", "");
      localStorage.setItem("auth", "");
      localStorage.setItem("firstName", "");

      history.push("/signup");
    }
  };

  const deleteUserErrorHandler = (error: any) => {
    console.log(error);
  };

  const deleteUser = () => {
    const postRequestData = {
      userId: _userData.user?.userId as string,
      email,
      pass
    };

    basePostRequest(
      "deleteuser",
      postRequestData,
      deleteUserResponseHandler,
      deleteUserErrorHandler,
      _userData.user?.auth
    );
  };

  const retrieveEmailResponseHandler = (data: any) => {
    console.log(data);
    if (
      data.statusCode === STATUS_CODE.FAILURE &&
      data.statusMessage === STATUS_MESSAGE.USER_NOT_VALIDATED
    ) {
      console.log("User not validated");
      history.push("/validate");
    } else if (data.statusCode === STATUS_CODE.SUCCESS) {
      setEmail(data?.body?.email);
    }
    setIsRetrievedProfileDirty(true);
  };

  const retrieveEmailErrorHandler = (error: any) => {
    console.log(error);
  };

  const retrieveEmail = () => {
    baseGetRequest(
      "getemailaddress",
      [],
      retrieveEmailResponseHandler,
      retrieveEmailErrorHandler,
      _userData.user?.auth
    );
  };

  useEffect(() => {
    retrieveEmail();
    // eslint-disable-next-line
  }, []);

  return isRetrievedProfileDirty ? (
    <SettingsCanvas
      email={email}
      pass={pass}
      handleInputChange={handleInputChange}
      handleSubmit={deleteUser}
    />
  ) : null;
};

const SettingsProvider = (props: { history: History }) => (
  <UserDataContext.Consumer>
    {userData => (
      <SettingsProviderWithContext
        userData={userData}
        history={props.history}
      />
    )}
  </UserDataContext.Consumer>
);

export default withRouter(SettingsProvider);
