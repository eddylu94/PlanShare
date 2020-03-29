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
    userData.updateUser({
      userId: "",
      auth: "",
      firstName: ""
    });

    localStorage.setItem("userId", "");
    localStorage.setItem("auth", "");

    event.preventDefault();
    history.push("/signup");
  };

  const user = userData?.user;
  const isUser = user?.auth && user?.userId;

  const navBarLinks = [];

  if (isUser) {
    navBarLinks.push(
      <Link to="/">
        <img
          alt="Home"
          className="navbar-home-icon"
          src={"./home_icon_white.png"}
        />
      </Link>
    );
    navBarLinks.push();
  }

  const navBarListItems = navBarLinks.map((link, i) => (
    <li key={"nav-bar-item-" + i}>{link}</li>
  ));

  return isUser ? (
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
                Search listings
              </Link>
            </li>
            <li>
              <Link to="/create">
                <img
                  alt="Create new listing"
                  className="navbar-icon"
                  src={"./create_icon_white.png"}
                />
                Create listing
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: "0 16px",
                  textDecoration: "none"
                }}
              >
                <img
                  alt="Profile"
                  className="nav-bar-profile-picture"
                  src="/profile_picture_placeholder.png"
                />
                <span className="navbar-first-name">{user?.firstName}</span>
              </Link>
              <ul>
                <li>
                  <Link to="/profile">Profile</Link>
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
              <Link to="/login">Log In</Link>
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
