import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import "./App.css";

import SignUp from "./components/SignUp/sign-up-provider";
import Search from "./components/Search/search-provider";
import CreateListing from "./components/CreateListing/create-listing-provider";
import Login from "./components/Login/login-provider";
import {
  UserDataContext,
  UserContextProvider,
  IUserContext
} from "./user-context-provider";

const AppContextProviders = (props: { children: any }) => (
  <UserContextProvider>{props.children}</UserContextProvider>
);

const NavBar = (props: { userData: IUserContext }) => (
  <nav className="navbar">
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/create">Create new listing</Link>
      </li>
      <li>
        {props.userData && props.userData.user ? (
          <Link to="/profile">Profile</Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </li>
    </ul>
  </nav>
);

function App() {
  return (
    <div className="app">
      <AppContextProviders>
        <Router>
          <div className="app-container">
            <UserDataContext.Consumer>
              {userData => <NavBar userData={userData} />}
            </UserDataContext.Consumer>
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
