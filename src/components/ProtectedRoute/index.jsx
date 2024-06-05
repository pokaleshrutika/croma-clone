import React, { useEffect, useState } from "react";
import Login from "../LogIn/Login";

const getUserFromLocalStorage = () => {
  const userDetails = localStorage.getItem("userDetails");
  if (userDetails) {
    const parseData = JSON.parse(userDetails);
    return parseData;
  } else {
    return {};
  }
};
export const ProtectedRoute = ({ children }) => {
  const [toggle, setToggle] = useState(1);
  const localStorageUserDetails = getUserFromLocalStorage();
  if (localStorageUserDetails?.token) {
    return <>{children}</>;
  } else {
    return (
      <Login
        onClose={() => {
          setToggle(toggle + 1);
        }}
        isOpen
      ></Login>
    );
  }
};
