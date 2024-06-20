import { useEffect } from "react";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import Header from "../component/Header/Header";

const RootPage = () => {
  const navigate = useNavigate();
  const token = useLoaderData();
  console.log(token);
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
  }, [token]);
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
