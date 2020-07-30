import React from "react";

import UsersList from "../components/UsersList";

const Users = () => {
  const USERS = [
    {
      id: "u1",
      name: "Ali Bahrami",
      image: "https://randomuser.me/api/portraits/lego/2.jpg",
      places: 3,
    },
  ];

  return <UsersList items={USERS} />;
};

export default Users;
