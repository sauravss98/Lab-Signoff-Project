import { useState } from "react";
import UserGridComponent from "./UserGridComponent";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

const UserListComponent = () => {
  const [tabState, setTabState] = useState("all");
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
    </div>
  );
};

export default UserListComponent;
