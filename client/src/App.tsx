import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import "./shared-styles/form.css";
import "./shared-styles/intro.css";
import "./shared-styles/organizations.css";
import "./shared-styles/placeholder.css";
import "./components/CreateListing/create-listing.css";
import "./components/Feedback/feedback.css";
import "./components/Info/info.css";
import "./components/Login/login.css";
import "./components/Messages/messages.css";
import "./components/NavBar/nav-bar.css";
import "./components/Profile/profile.css";
import "./components/Search/search.css";
import "./components/Settings/settings.css";
import "./components/SignUp/sign-up.css";
import "./components/Subscription/subscription.css";
import "./components/Validate/validate.css";
import "./components/TermsOfUse/terms-of-use.css";

import NavBar from "./components/NavBar/nav-bar";
import SignUp from "./components/SignUp/sign-up-provider";
import Privacy from "./components/Privacy/privacy";
import Validate from "./components/Validate/validate";
import Search from "./components/Search/search-provider";
import CreateListing from "./components/CreateListing/create-listing-provider";
import Login from "./components/Login/login-provider";
import Profile from "./components/Profile/profile-provider";
import Settings from "./components/Settings/settings-provider";
import Messages from "./components/Messages/messages-provider";
import Feedback from "./components/Feedback/feedback";
import Info from "./components/Info/info";
import { UserContextProvider } from "./user-context-provider";

const AppContextProviders = (props: { children: any }) => (
  <UserContextProvider>{props.children}</UserContextProvider>
);

const App = () => (
  <div className="app">
    <AppContextProviders>
      <Router>
        <div className="app-container">
          <NavBar />
          <Switch>
            <Route exact path="/">
              <Search />
            </Route>
            <Route path="/signup">
              <SignUp />
            </Route>
            <Route path="/privacy">
              <Privacy />
            </Route>
            <Route path="/feedback">
              <Feedback />
            </Route>
            <Route path="/info">
              <Info />
            </Route>
            <Route path="/search">
              <Search />
            </Route>
            <Route path="/create">
              <CreateListing />
            </Route>
            <Route path="/edit">
              <CreateListing />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/validate">
              <Validate />
            </Route>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/settings">
              <Settings />
            </Route>
            <Route path="/messages">
              <Messages />
            </Route>
          </Switch>
        </div>
      </Router>
    </AppContextProviders>
  </div>
);

export default App;
