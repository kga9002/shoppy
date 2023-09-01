import React from "react";
import { useUserContext } from "../context/authContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: any) {
  const userData = useUserContext();
  const isAdmin = userData?.email === "kga9002@intflow.ai";
  return isAdmin ? children : <Navigate to='/' />;
}
