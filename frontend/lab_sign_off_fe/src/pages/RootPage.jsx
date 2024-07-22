import { useEffect } from "react";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import Header from "../component/Header/Header";
import Toast from "../component/Toast/Toast";

const RootPage = () => {
  const navigate = useNavigate();
  const token = useLoaderData();

  useEffect(() => {
    if (!token || token === "EXPIRED") {
      navigate("/login");
      return;
    }
  }, [navigate, token]);
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Toast />
    </>
  );
};

export default RootPage;
