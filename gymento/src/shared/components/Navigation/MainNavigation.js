import React from "react";
import { Link } from "react-router-dom";

import MainHeader from "./MainHeader";
import "./MainNavigation.css";

const MainNavigation = () => {
  return (
    <MainHeader>
      <botton className="main-navigation__menu-btn">
        <span></span>
        <span></span>
        <span></span>
      </botton>
      <h1 className="main-navigation__title">
        <Link to="/">Gymento</Link>
      </h1>
      <nav>...</nav>
    </MainHeader>
  );
};

export default MainNavigation;
