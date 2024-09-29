import { useSelector } from "react-redux";
import StaffSideNav from "./StaffSideNav";
import StudentSideNav from "./StudentSideNav";
import AdminSideNav from "./AdminSideNav";
import PropTypes from "prop-types";

const SideNavComponent = ({ isOpen, toggleSidebar }) => {
  /**
   * Sidenav component-main-It routes to different user types based on the token
   */
  const userType = useSelector((state) => state.auth.user_type);
  return (
    <>
      {userType === "staff" && (
        <StaffSideNav isOpen={isOpen} toggleSidebar={toggleSidebar} />
      )}
      {userType === "student" && (
        <StudentSideNav isOpen={isOpen} toggleSidebar={toggleSidebar} />
      )}
      {userType === "admin" && (
        <AdminSideNav isOpen={isOpen} toggleSidebar={toggleSidebar} />
      )}
    </>
  );
};

SideNavComponent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default SideNavComponent;
