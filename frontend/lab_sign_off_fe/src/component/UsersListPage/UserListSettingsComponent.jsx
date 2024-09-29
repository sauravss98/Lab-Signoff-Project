import { useState } from "react";
import UserGridComponent from "./UserGridComponent";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import UserCreateModal from "./UserCreateModal";
import Button from "react-bootstrap/esm/Button";
import UserTypeDistributionChart from "../Charts/UserTypeDistributionChart";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const UserListComponent = () => {
  /**
   * User Settings page component
   */
  const [tabState, setTabState] = useState("all");
  const [openUserCreateModal, setOpenUserCreateModal] = useState(false);

  const handleNewUserClick = () => {
    setOpenUserCreateModal(true);
  };
  const handleClose = () => {
    setOpenUserCreateModal(false);
  };

  return (
    <Container fluid="md">
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={6} className="d-flex flex-column align-items-center">
          <h4 className="mb-3">User Type Distribution</h4>
          <div style={{ maxWidth: "500px", width: "100%" }}>
            <UserTypeDistributionChart selectedType={tabState} />
          </div>
        </Col>
      </Row>

      <Row className="justify-content-between align-items-center mb-3">
        <Col xs={12} md={8}>
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
        </Col>
        <Col xs={12} md={4} className="text-md-end text-center mb-2">
          <Button variant="dark" onClick={handleNewUserClick}>
            Create New User
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <UserGridComponent tabState={tabState} />
        </Col>
      </Row>
      <UserCreateModal open={openUserCreateModal} handleClose={handleClose} />
    </Container>
  );
};

export default UserListComponent;
