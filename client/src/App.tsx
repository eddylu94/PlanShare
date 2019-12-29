import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";

import SignUp from "./components/SignUp/sign-up-provider";
import Search from "./components/Search/search-provider";

function App() {
  return (
    <div className="app">
      <Router>
        <div className="app-container">
          <nav className="navbar">
            <ul>
              <li>
                <Link to="/">Home</Link>
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
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
