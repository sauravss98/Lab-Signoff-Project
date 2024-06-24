import { useSelector } from "react-redux";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import ChangePasswordComponent from "./ChangePasswordModalComponent";

const UserProfileComponent = () => {
  const first_name = useSelector((state) => state.auth.first_name);
  const last_name = useSelector((state) => state.auth.last_name);
  const email = useSelector((state) => state.auth.email);
  const [modalShow, setModalShow] = useState(false);

  const changePasswordClick = () => {
    setModalShow(true);
  };
  return (
    <div>
      <Row>
        <Col>
          <h1>User Profile</h1>
        </Col>
      </Row>
      <Row>
        <Col sm>
          <h3>Email :</h3>
        </Col>
        <Col sm={8}>
          <h3>{email}</h3>
        </Col>
      </Row>
      <Row>
        <Col sm>
          <h3>First Name :</h3>
        </Col>
        <Col sm={8}>
          <h3>{first_name}</h3>
        </Col>
      </Row>
      <Row>
        <Col sm>
          <h3>Last Name :</h3>
        </Col>
        <Col sm={8}>
          <h3>{last_name}</h3>
        </Col>
      </Row>
      <Row>
        <Col sm>
          <Button variant="dark" onClick={changePasswordClick}>
            Change Password
          </Button>
        </Col>
      </Row>
      <ChangePasswordComponent
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      ;
    </div>
  );
};

export default UserProfileComponent;
