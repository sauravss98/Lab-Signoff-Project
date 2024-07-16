import { useState } from "react";
import UserGridComponent from "./UserGridComponent";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import UserCreateModal from "./UserCreateModal";
import Button from "react-bootstrap/esm/Button";

const UserListComponent = () => {
  const [tabState, setTabState] = useState("all");
  const [openUserCreateModal, setOpenUserCreateModal] = useState(false);

  const handleNewUserClick = () => {
    setOpenUserCreateModal(true);
  };
  const handleClose = () => {
    setOpenUserCreateModal(false);
  };

  return (
    <div>
      <Tabs
        defaultActiveKey="all"
        id="user-type-tab"
        activeKey={tabState}
        onSelect={(k) => setTabState(k)}
        className="mb-3"
      >
        <Tab eventKey="all" title="All" />

        <Tab eventKey="staff" title="Staffs" />
        <Tab eventKey="student" title="Students" />
        <Tab eventKey="admin" title="Admins" />
      </Tabs>
      <UserGridComponent tabState={tabState} />
      <UserCreateModal open={openUserCreateModal} handleClose={handleClose} />
      <Button variant="dark" onClick={handleNewUserClick}>
        Create New User
      </Button>
    </div>
  );
};

export default UserListComponent;
