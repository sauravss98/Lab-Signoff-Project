import classes from "./SideNav.module.css";
import { NavLink } from "react-router-dom";
// eslint-disable-next-line react/prop-types
const StudentSideNav = ({ isOpen, toggleSidebar }) => {
  /**
   * Sidenav component-Student
   */
  return (
    <>
      <div className={classes.hamburger} onClick={toggleSidebar}>
        &#9776;
      </div>
      <div className={`${classes.sidebar} ${isOpen ? classes.open : ""}`}>
        <NavLink to="/student">Home Student</NavLink>
        <NavLink to="/student/student-courses/">Enrolled Course</NavLink>
        <NavLink to="/student/requests">Requests</NavLink>
      </div>
    </>
  );
};

export default StudentSideNav;
