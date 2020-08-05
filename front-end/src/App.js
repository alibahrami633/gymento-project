import React, { useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import MainNavigation from "./shared/components/Navigation/MainNavigation";
import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/Context/auth-context";

import "./App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // to avoid re-creating it unnecessarily and to avoid infinite loops
  const login = useCallback(() => {
    setIsLoggedIn(true);
  });

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  });

  return (
    // value in AuthContext will binds the intial values in the AuthContext into a new value and by the value changing, all the components that listen to the context will be re-rendered
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, login: login, logout: logout }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Switch>
            <Route exact path="/" component={Users} />
            <Route exact path="/:userId/places" component={UserPlaces} />
            <Route exact path="/places/new" component={NewPlace} />
            <Route exact path="/places/:placeId" component={UpdatePlace} />
            <Route exact path="/auth" component={Auth} />
            <Redirect to="/" />
          </Switch>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
