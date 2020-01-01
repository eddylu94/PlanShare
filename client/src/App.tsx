import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";

import SignUp from "./components/SignUp/sign-up-provider";
import Search from "./components/Search/search-provider";
import CreateListing from "./components/CreateListing/create-listing-provider";
import Login from "./components/Login/login-provider";
import { UserContextProvider } from "./user-context-provider";

const AppContextProviders = (props: { children: any }) => (
  <UserContextProvider>{props.children}</UserContextProvider>
);

function App() {
  return (
    <div className="app">
      <AppContextProviders>
        <Router>
          <div className="app-container">
            <nav className="navbar">
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/create">Create new listing</Link>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
              </ul>
            </nav>
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
            </Switch>
          </div>
        </Router>
      </AppContextProviders>
    </div>
  );
}

export default App;
