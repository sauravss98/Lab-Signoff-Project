import classes from "./SideNav.module.css";
const SideNav = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      <div className={classes.hamburger} onClick={toggleSidebar}>
        &#9776;
      </div>
      <div className={`${classes.sidebar} ${isOpen ? classes.open : ""}`}>
        <a>Home</a>
        <a>Requests</a>
      </div>
    </>
  );
};

export default SideNav;
