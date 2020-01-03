import React from "react";

import { Link, withRouter } from "react-router-dom";
import { History } from "history";
import { IUserContext, UserDataContext } from "./../../user-context-provider";

const NavBarWithContext = (props: {
  userData: IUserContext;
  history: History;
}) => {
  const { userData, history } = props;

  const logoutHandler = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    debugger;
    userData.updateUser({
      userId: "",
      auth: ""
    });

    localStorage.setItem("userId", "");
    localStorage.setItem("auth", "");

    event.preventDefault();
    history.push("/");
  };

  const navBarLinks = [
    <Link to="/">Home</Link>,
    <Link to="/create">Create new listing</Link>
  ];

  const user = userData?.user;
  const additionalLinks =
    user?.auth && user?.userId
      ? [
          <Link to="/profile">Profile</Link>,
          <Link to="/logout" onClick={logoutHandler}>
            Logout
          </Link>
        ]
      : [<Link to="/login">Log In</Link>];

  const navBarListItems = navBarLinks
    .concat(additionalLinks)
    .map((link, i) => <li key={"nav-bar-item-" + i}>{link}</li>);

  return (
    <nav className="navbar">
      <ul>{navBarListItems}</ul>
    </nav>
  );
};

const NavBar = (props: { history: History }) => (
  <UserDataContext.Consumer>
    {userData => (
      <NavBarWithContext userData={userData} history={props.history} />
    )}
  </UserDataContext.Consumer>
);

export default withRouter(NavBar);
