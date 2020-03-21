import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import NavBar from "./components/NavBar/nav-bar";
import SignUp from "./components/SignUp/sign-up-provider";
import Validate from "./components/Validate/validate";
import Search from "./components/Search/search-provider";
import CreateListing from "./components/CreateListing/create-listing-provider";
import Login from "./components/Login/login-provider";
import Profile from "./components/Profile/profile-provider";
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
            <Route path="/search">
              <Search />
            </Route>
            <Route path="/create">
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
          </Switch>
        </div>
      </Router>
    </AppContextProviders>
  </div>
);

export default App;
