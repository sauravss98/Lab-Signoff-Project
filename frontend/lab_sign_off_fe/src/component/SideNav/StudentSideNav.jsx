import classes from "./SideNav.module.css";
// eslint-disable-next-line react/prop-types
const StudentSideNav = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      <div className={classes.hamburger} onClick={toggleSidebar}>
        &#9776;
      </div>
      <div className={`${classes.sidebar} ${isOpen ? classes.open : ""}`}>
        <a>Home Student</a>
        <a>Requests</a>
      </div>
    </>
  );
};

export default StudentSideNav;
