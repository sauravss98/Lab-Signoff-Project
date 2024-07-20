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
const ErrorPage = React.lazy(() => import("../../pages/ErrorPage"));
const StaffMainPage = React.lazy(() =>
  import("../../pages/StaffMainPage/StaffMainPage")
);
const StaffHomePage = React.lazy(() => import("../Staff/StaffHomePage"));
const StaffLabPageComponent = React.lazy(() =>
  import("../Staff/StaffLabPageComponent")
);
const StudentPageComponent = React.lazy(() =>
  import("../Staff/StudentPageComponent")
);
const StudentMainPage = React.lazy(() =>
  import("../../pages/StudentMainPage/StudentMainPage")
);
const StudentHomePage = React.lazy(() => import("../Student/StudentHomePage"));
const AdminMainPage = React.lazy(() =>
  import("../../pages/AdminMainPage/AdminMainPage")
);
const AdminHomePage = React.lazy(() => import("../AdminPages/AdminHomePage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
    id: "root",
    loader: tokenLoader,
    fallback: <div>Loading...</div>,
    // ErrorBoundary: <ErrorBoundary />,
    errorElement: <ErrorPage />,
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
      {
        path: "staff",
        element: <StaffMainPage />,
        children: [
          {
            index: true,
            element: <StaffHomePage />,
          },
          {
            path: "labs",
            element: <StaffLabPageComponent />,
          },
          {
            path: "students",
            element: <StudentPageComponent />,
          },
        ],
      },
      {
        path: "student",
        element: <StudentMainPage />,
        children: [
          {
            index: true,
            element: <StudentHomePage />,
          },
        ],
      },
      {
        path: "admin",
        element: <AdminMainPage />,
        children: [
          {
            index: true,
            element: <AdminHomePage />,
          },
        ],
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
