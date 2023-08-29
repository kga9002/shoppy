import React, { useEffect } from "react";
import { useUserContext } from "../context/authContext";
import { Navigate } from "react-router-dom";

export default function ValidateLogin({ children }: any) {
  const userData = useUserContext();

  return userData ? children : <Navigate to='/' />;
}
