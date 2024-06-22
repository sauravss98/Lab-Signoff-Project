import Row from "react-bootstrap/Row";
import classes from "./Home.module.css";
import SideNav from "../SideNav/SideNav";
import { useEffect, useState, useRef } from "react";
import { tokenLoader } from "../../utils/token";
import StaffHomePage from "../../pages/StaffHomePage/StaffHomePage";
import StudentHomePage from "../../pages/StudentHomePage/StudentHomePage";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/Axios";

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
        const response = await axiosInstance.get("/users/user_details", {
          headers: {
            Authorization: "Token " + token,
          },
        });
        userTypeRef.current = response.data.user_type;
        setUserType(userTypeRef.current);
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
      <SideNav isOpen={isSideBarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`${classes.mainDiv} ${
          isSideBarOpen ? classes.sidenavOpen : ""
        }`}
      >
        <Row>
          {userType === "student" && <StudentHomePage />}
          {userType === "staff" && <StaffHomePage />}
        </Row>
      </div>
    </>
  );
};

export default Home;
