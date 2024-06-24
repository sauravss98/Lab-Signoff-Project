import { useSelector } from "react-redux";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const UserProfileComponent = () => {
  const first_name = useSelector((state) => state.auth.first_name);
  const last_name = useSelector((state) => state.auth.last_name);
  const email = useSelector((state) => state.auth.email);
  return (
    <div>
      <Row>
        <Col>
          <h1>User Profile</h1>
        </Col>
      </Row>
      <Row>
        <Col sm={2}>
          <h3>Email :</h3>
        </Col>
        <Col sm>
          <h3>{email}</h3>
        </Col>
      </Row>
      <Row>
        <Col sm={2}>
          <h3>First Name :</h3>
        </Col>
        <Col sm>
          <h3>{first_name}</h3>
        </Col>
      </Row>
      <Row>
        <Col sm={2}>
          <h3>Last Name :</h3>
        </Col>
        <Col sm>
          <h3>{last_name}</h3>
        </Col>
      </Row>
    </div>
  );
};

export default UserProfileComponent;
