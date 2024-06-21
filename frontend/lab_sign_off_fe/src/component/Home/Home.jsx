// import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import classes from "./Home.module.css";
import SideNav from "../SideNav/SideNav";
import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../utils/Axios";
import { tokenLoader } from "../../utils/token";
import StaffHomePage from "../../pages/StaffHomePage/StaffHomePage";
import StudentHomePage from "../../pages/StudentHomePage/StudentHomePage";

const Home = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [userType, setUserType] = useState("");
  const userTypeRef = useRef("");
  const toggleSidebar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };
  console.log("Token is " + tokenLoader());

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axiosInstance.get("/users/user_details");
        console.log(response.data);
        userTypeRef.current = response.data.user_type;
        setUserType(userTypeRef.current);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    getData();

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
  }, []);
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
