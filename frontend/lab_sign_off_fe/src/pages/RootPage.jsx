import { useEffect } from "react";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import Header from "../component/Header/Header";

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
    </>
  );
};

export default RootPage;
