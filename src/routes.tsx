import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import NotFound from "./pages/NotFound";
import React from "react";
import MainPage from "./pages/MainPage";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import AdminAdd from "./pages/AdminAdd";
import ProtectedRoute from "./components/ProtectedRoute";
import ValidateLogin from "./components/ValidateLogin";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "cart",
        element: (
          <ValidateLogin>
            <Cart />
          </ValidateLogin>
        ),
      },
      {
        path: "product/:id",
        element: <ProductDetail />,
      },
      {
        path: "edit",
        element: (
          <ProtectedRoute>
            <AdminAdd />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
