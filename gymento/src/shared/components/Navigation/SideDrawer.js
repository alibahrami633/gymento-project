import React from "react";
import ReactDom from "react-dom";

import "./SideDrawer.css";

const SideDrawer = (props) => {
  const content = <aside className="side-drawer">{props.children}</aside>; // React Portals

  return ReactDom.createPortal(content, document.getElementById("drawer-hook"));
};

export default SideDrawer;
