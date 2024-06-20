// import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import "../Home/Home.css";
import SideNav from "../SideNav/SideNav";
import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../utils/Axios";
import { tokenLoader } from "../../utils/token";
import StaffHomePage from "../../pages/StaffHomePage/StaffHomePage";
import StudentHomePage from "../../pages/StudentHomePage/StudentHomePage";

const Home = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [userType, setUserType] = useState(""); // State to trigger re-render
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
  }, []);
  return (
    <>
      <div>
        <div>
          <Row>
            <SideNav isOpen={isSideBarOpen} toggleSidebar={toggleSidebar} />
            {userType === "student" && <StudentHomePage />}
            {userType === "staff" && <StaffHomePage />}
          </Row>
        </div>
      </div>
    </>
  );
};

export default Home;
