import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";

import SignUp from "./components/SignUp/sign-up-provider";

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
              <Home />
            </Route>
            <Route path="/signup">
              <SignUp />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );

  function Home() {
    return (
      <div>
        <h2>Home</h2>
      </div>
    );
  }
}

export default App;
