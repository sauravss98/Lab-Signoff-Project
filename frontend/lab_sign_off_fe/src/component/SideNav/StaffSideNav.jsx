import classes from "./SideNav.module.css";
import { NavLink } from "react-router-dom";
// eslint-disable-next-line react/prop-types
const StaffSideNav = ({ isOpen, toggleSidebar }) => {
  /**
   * Sidenav component-Staff
   */
  return (
    <>
      <div className={classes.hamburger} onClick={toggleSidebar}>
        &#9776;
      </div>
      <div className={`${classes.sidebar} ${isOpen ? classes.open : ""}`}>
        <NavLink to="/staff">Home Staff</NavLink>
        <NavLink to="/staff/labs">Labs</NavLink>
        <NavLink to="/staff/students">Students</NavLink>
        <NavLink to="/staff/requests">Requests</NavLink>
        <NavLink to="/staff/feedbacks">Feedback</NavLink>
      </div>
    </>
  );
};

export default StaffSideNav;
