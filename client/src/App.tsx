import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

import SignUp from "./components/SignUp/sign-up-provider";

function App() {
  return (
    <div>
      <Router>
        <div>
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
