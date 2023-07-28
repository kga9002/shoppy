import React, { createContext, useContext, useEffect, useState } from "react";
import { ref, child, get } from "firebase/database";
import { database } from "../auth/auth";

export interface Product {
  category: string;
  description: string;
  id: string;
  image: string;
  options: string;
  price: number;
  title: string;
}

const ProductContext = createContext<Product[] | null>(null);

export const ProductProvider = ({ children }: any) => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const dbRef = ref(database);

  useEffect(() => {
    get(child(dbRef, "products"))
      .then((o) => {
        if (o.exists()) {
          setProducts(o.val());
        } else {
          console.log("no data");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return <ProductContext.Provider value={products}>{children}</ProductContext.Provider>;
};

export function useProductContext() {
  return useContext(ProductContext);
}
