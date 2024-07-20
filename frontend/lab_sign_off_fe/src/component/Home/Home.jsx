import Row from "react-bootstrap/Row";
import classes from "./Home.module.css";
import { useEffect, useState, useRef } from "react";
import { tokenLoader } from "../../utils/token";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/Axios";
import SideNavComponent from "../SideNav/SideNavComponent";
import StudentMainPage from "../../pages/StudentMainPage/StudentMainPage";
import StaffMainPage from "../../pages/StaffMainPage/StaffMainPage";
import AdminMainPage from "../../pages/AdminMainPage/AdminMainPage";

const Home = () => {
  const navigate = useNavigate();
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [userType, setUserType] = useState("");
  const userTypeRef = useRef("");

  const toggleSidebar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };
  const token = tokenLoader();

  useEffect(() => {
    const fetchData = async () => {
      if (token === "EXPIRED") {
        navigate("/login");
        return;
      }
      if (token) {
        try {
          const response = await axiosInstance.get("/users/user_details", {
            headers: {
              Authorization: "Token " + token,
            },
          });
          userTypeRef.current = response.data.user_type;
          setUserType(userTypeRef.current);
        } catch (error) {
          console.log(error);
          if (error.response.status === 403) {
            navigate("/login");
          }
        }
      } else {
        navigate("/login");
      }
    };

    fetchData();

    const handleResize = () => {
      if (window.innerWidth < 700) {
        setIsSideBarOpen(false);
      } else {
        setIsSideBarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [navigate, token]);

  return (
    <>
      <SideNavComponent isOpen={isSideBarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`${classes.mainDiv} ${
          isSideBarOpen ? classes.sidenavOpen : ""
        }`}
      >
        <Row>
          {userType === "student" && <StudentMainPage />}
          {userType === "staff" && <StaffMainPage />}
          {userType === "admin" && <AdminMainPage />}
        </Row>
      </div>
    </>
  );
};

export default Home;
