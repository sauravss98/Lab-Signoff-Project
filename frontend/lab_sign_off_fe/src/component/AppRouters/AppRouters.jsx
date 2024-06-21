import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React, { Suspense } from "react";
import { tokenLoader } from "../../utils/token";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary ";

const Home = React.lazy(() => import("../Home/Home"));
const Login = React.lazy(() => import("../../pages/Login/Login"));
const RootPage = React.lazy(() => import("../../pages/RootPage"));
const SettingsPage = React.lazy(() =>
  import("../../pages/SettingsPage/SettingsPage")
);

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
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);

const AppRouters = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRouters;
