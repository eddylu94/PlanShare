import React from "react";

import { Link, withRouter } from "react-router-dom";
import { History } from "history";
import { IUserContext, UserDataContext } from "./../../user-context-provider";
import { TITLE } from "./../../utils/constants";
import { log } from "./../../utils/utils";

const NavBarWithContext = (props: {
  userData: IUserContext;
  history: History;
}) => {
  const { userData, history } = props;

  log(history);

  const logoutHandler = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    userData.updateUser({
      userId: "",
      auth: "",
      firstName: ""
    });

    localStorage.setItem("userId", "");
    localStorage.setItem("auth", "");
    localStorage.setItem("firstName", "");

    event.preventDefault();
    history.push("/signup");
  };

  const user = userData?.user;
  const isUser = user?.auth && user?.userId;

  const navBarLinks = [];

  navBarLinks.push(
    <Link to="/">
      <img alt="Home" className="navbar-home-icon" src={"./icon.png"} />
      <span className="navbar-title">{TITLE}</span>
    </Link>
  );

  const navBarListItems = navBarLinks.map((link, i) => (
    <li key={"nav-bar-item-" + i}>{link}</li>
  ));

  const isSignUpLoginPage =
    history.location.pathname === "/signup" ||
    history.location.pathname === "/login";

  return !isSignUpLoginPage ? (
    <nav className="navbar">
      <ul>{navBarListItems}</ul>
      <ul>
        {isUser ? (
          <>
            <li>
              <Link to="/search">
                <img
                  alt="Search listings"
                  className="navbar-icon"
                  src={"./search_icon_white.png"}
                />
                <span className="navbar-link-label">Search</span>
              </Link>
            </li>
            <li>
              <Link to="/create">
                <img
                  alt="Create new listing"
                  className="navbar-icon"
                  src={"./create_icon_white.png"}
                />
                <span className="navbar-link-label">Post</span>
              </Link>
            </li>
            <li>
              <Link to="/messages">
                <img
                  alt="Messages"
                  className="navbar-icon"
                  src={"./message_icon_white.png"}
                />
                <span className="navbar-link-label">Messages</span>
              </Link>
            </li>
            <li>
              <div className="nav-bar-profile">
                <img
                  alt="Profile"
                  className="nav-bar-profile-picture"
                  src="/profile_picture_placeholder.png"
                />
                <span className="navbar-first-name">{user?.firstName}</span>
              </div>
              <ul className="navbar-profile-menu">
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <Link to="/settings">Settings</Link>
                </li>
                <li>
                  <Link to="/feedback">Feedback</Link>
                </li>
                <li>
                  <Link to="/logout" onClick={logoutHandler}>
                    Logout
                  </Link>
                </li>
              </ul>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/signup">Sign In</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  ) : null;
};

const NavBar = (props: { history: History }) => (
  <UserDataContext.Consumer>
    {userData => (
      <NavBarWithContext userData={userData} history={props.history} />
    )}
  </UserDataContext.Consumer>
);

export default withRouter(NavBar);
