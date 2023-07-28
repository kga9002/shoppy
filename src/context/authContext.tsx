import React, { createContext, useContext, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, database } from "../auth/auth";
import { ref, set } from "firebase/database";

const AuthContext = createContext<User | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [userData, setUserData] = useState<User | null>(null);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserData(user);
      set(ref(database, "users/" + user.uid), {
        username: user.displayName,
        email: user.email,
      });
    }
  });

  return <AuthContext.Provider value={userData}>{children}</AuthContext.Provider>;
};

export function useUserContext() {
  return useContext(AuthContext);
}
