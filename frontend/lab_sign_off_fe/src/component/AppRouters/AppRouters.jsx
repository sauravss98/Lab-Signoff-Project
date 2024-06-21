import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import { tokenLoader } from "../../utils/token";

const Home = React.lazy(() => import("../Home/Home"));
const Login = React.lazy(() => import("../../pages/Login/Login"));
const RootPage = React.lazy(() => import("../../pages/RootPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
    id: "root",
    loader: tokenLoader,
    fallback: <div>Loading...</div>,
    children: [
      {
        index: true,
        element: <Home />,
        loader: tokenLoader,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);

const AppRouters = () => {
  return <RouterProvider router={router} />;
};

export default AppRouters;
