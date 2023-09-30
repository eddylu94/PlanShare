import React, { useContext, useEffect } from "react";

import { Link, withRouter } from "react-router-dom";
import { History } from "history";
import { UserDataContext } from "user-context-provider";
import { NotificationsDataContext } from "notifications-context-provider";
import { TITLE } from "@utils/constants";
import { log } from "@utils/utils";

import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import MailIcon from "@mui/icons-material/Mail";
import Badge from "@mui/material/Badge";

import { getUnreadMessagesCount } from "@requests/getRequests";

interface INavBarProps {
  history: History;
}

const NavBar = (props: INavBarProps) => {
  const { history } = props;

  const userData = useContext(UserDataContext);
  const notificationsData = useContext(NotificationsDataContext);

  const getUnreadMessagesCountResponseHandler = (res: {
    body?: { unreadMessages: number };
  }) => {
    const unreadMessagesCount = res.body?.unreadMessages;
    if (unreadMessagesCount != null) {
      notificationsData.updateNotifications({ unreadMessagesCount });
    }
  };

  useEffect(() => {
    getUnreadMessagesCount(
      getUnreadMessagesCountResponseHandler,
      log,
      user?.auth
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <img
        alt="Home"
        className="navbar-home-icon"
        src={"./icon_transparent.png"}
      />
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
      <div className="navbar_wrapper">
        <ul>{navBarListItems}</ul>
        <ul>
          {isUser ? (
            <>
              <li>
                <Link to="/search">
                  <IconButton aria-label="Search">
                    <SearchIcon style={{ color: "white" }} />
                  </IconButton>
                  <span className="navbar-link-label">Search</span>
                </Link>
              </li>
              <li>
                <Link to="/create">
                  <IconButton aria-label="Post">
                    <EditIcon style={{ color: "white" }} />
                  </IconButton>
                  <span className="navbar-link-label">Post</span>
                </Link>
              </li>
              <li>
                <Link to="/messages">
                  <IconButton aria-label="cart">
                    <Badge
                      badgeContent={
                        notificationsData.notifications?.unreadMessagesCount
                      }
                      color="warning"
                    >
                      <MailIcon style={{ color: "white" }} />
                    </Badge>
                  </IconButton>
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
      </div>
    </nav>
  ) : null;
};

export default withRouter(NavBar);
