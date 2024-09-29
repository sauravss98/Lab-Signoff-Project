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
const RequestMainPageStudent = React.lazy(() =>
  import("../Student/Request/RequestMainPageStudents")
);
const ChatPage = React.lazy(() => import("../../pages/ChatPage/ChatPage"));
const StaffRequestDetailPage = React.lazy(() =>
  import("../Staff/Request/StaffRequestDetailPage")
);

const StudentRequestDetailPage = React.lazy(() =>
  import("../Student/Request/StudentRequestDetailPage")
);

const NotificationLayout = React.lazy(() =>
  import("../../pages/NotificationLayout/NotificationLayout")
);

const FeedbackMainPage = React.lazy(() =>
  import("../Staff/Feedback/FeedbackMainPage")
);
const AdminReqestComponent = React.lazy(() =>
  import("../AdminPages/Requests/AdminReqestComponent")
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
        path: "notifications",
        element: <NotificationLayout />,
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
            path: "chat",
            element: <ChatPage />,
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
          {
            path: "request/:requestId/detail",
            element: <StaffRequestDetailPage />,
          },
          {
            path: "feedbacks/",
            element: <FeedbackMainPage />,
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
            path: "chat",
            element: <ChatPage />,
          },
          {
            path: "student-courses",
            element: <EnrolledCourseGridComponent />,
          },
          {
            path: `course/:course_id/details`,
            element: <CourseDetailPage />,
          },
          {
            path: `requests`,
            element: <RequestMainPageStudent />,
          },
          {
            path: "request/:requestId/detail",
            element: <StudentRequestDetailPage />,
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
          {
            path: "requests",
            element: <AdminReqestComponent />,
          },
          {
            path: "chat",
            element: <ChatPage />,
          },
        ],
      },
      // {
      //   path: "chat",
      //   element: <ChatPage />,
      //   // children: [
      //   //   // {
      //   //   //   index: true,
      //   //   //   element: < />,
      //   //   // },
      //   // ],
      // },
    ],
  },
]);

const AppRouters = () => {
  // This is the Router of the application and it controls all the pages
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRouters;
