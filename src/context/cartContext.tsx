import React, { createContext, useContext, useEffect, useState } from "react";
import { ref, child, get, onValue } from "firebase/database";
import { database } from "../auth/auth";
import { useUserContext } from "./authContext";

export interface Cart {
  amount: number;
  image: string;
  option: string;
  price: number;
  title: string;
  id: string;
}

const CartContext = createContext<Cart[] | null>(null);

export const CartProvider = ({ children }: any) => {
  const [cart, setCart] = useState<Cart[] | null>(null);
  const userData = useUserContext();

  useEffect(() => {
    if (userData) {
      const getDataRef = ref(database, "cart/" + userData?.uid + "/");
      onValue(getDataRef, (snapshot) => {
        const data = snapshot.val();
        setCart(data);
      });
    }
  }, [userData]);

  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
};

export function useCartContext() {
  return useContext(CartContext);
}
