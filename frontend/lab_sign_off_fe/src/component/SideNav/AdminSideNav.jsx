import classes from "./SideNav.module.css";
import { NavLink } from "react-router-dom";
// eslint-disable-next-line react/prop-types
const AdminSideNav = ({ isOpen, toggleSidebar }) => {
  /**
   * Sidenav component-Admin
   */
  return (
    <>
      <div className={classes.hamburger} onClick={toggleSidebar}>
        &#9776;
      </div>
      <div className={`${classes.sidebar} ${isOpen ? classes.open : ""}`}>
        <NavLink to="/admin">Home Staff</NavLink>
        <NavLink to="/admin/requests">Requests</NavLink>
      </div>
    </>
  );
};

export default AdminSideNav;
