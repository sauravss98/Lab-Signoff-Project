import SideNavComponent from "../../component/SideNav/SideNavComponent";
import { Outlet } from "react-router-dom";
import Row from "react-bootstrap/Row";
import { useEffect, useState } from "react";
import classes from "../../component/Home/Home.module.css";

const StudentMainPage = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  useEffect(() => {
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
      <SideNavComponent isOpen={isSideBarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`${classes.mainDiv} ${
          isSideBarOpen ? classes.sidenavOpen : ""
        }`}
      >
        <Row>
          <Outlet />
        </Row>
      </div>
    </>
  );
};

export default StudentMainPage;
