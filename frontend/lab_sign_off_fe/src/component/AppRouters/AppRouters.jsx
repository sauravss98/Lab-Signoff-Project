import { Route, Routes } from "react-router-dom";
import React from "react";

const Home = React.lazy(() => import("../Home/Home"));
const Login = React.lazy(() => import("../../pages/Login/Login"));

const AppRouters = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
};

export default AppRouters;
