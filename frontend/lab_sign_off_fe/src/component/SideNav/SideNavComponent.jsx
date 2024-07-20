import { useSelector } from "react-redux";
import StaffSideNav from "./StaffSideNav";
import StudentSideNav from "./StudentSideNav";
import AdminSideNav from "./AdminSideNav";

const SideNavComponent = ({ isOpen, toggleSidebar }) => {
  const userType = useSelector((state) => state.auth.user_type);
  return (
    <>
      {userType === "staff" && (
        <StaffSideNav isOpen={isOpen} toggleSidebar={toggleSidebar} />
      )}
      {userType === "student" && <StudentSideNav />}
      {userType === "admin" && <AdminSideNav />}
    </>
  );
};

export default SideNavComponent;
