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
const CoursesLabsDetailPage = React.lazy(() =>
  import("../Staff/Courses/CoursesLabsDetailPage")
);
const StudentDetailPage = React.lazy(() =>
  import("../Staff/Students/StudentDetailPage")
);
const EnrolledCourseGridComponent = React.lazy(() =>
  import("../Student/Course/EnrolledCourseGridComponent")
);
const CourseDetailPage = React.lazy(() =>
  import("../Student/Course/CourseDetailPage")
);
const RequestLandingPage = React.lazy(() =>
  import("../Staff/Request/RequestLandingPage")
);

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
            path: "course/:selectedRowId/details",
            element: <CoursesLabsDetailPage />,
          },
          {
            path: "students",
            element: <StudentPageComponent />,
          },
          {
            path: "student/:selectedRowId/details",
            element: <StudentDetailPage />,
          },
          {
            path: "requests",
            element: <RequestLandingPage />,
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
          {
            path: "student-courses",
            element: <EnrolledCourseGridComponent />,
          },
          {
            path: `course/:course_id/details`,
            element: <CourseDetailPage />,
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
