import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";

import "./App.css";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Users} />
        <Route exact path="/places/new" component={NewPlace} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default App;
