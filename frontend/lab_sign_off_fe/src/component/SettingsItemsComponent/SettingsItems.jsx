import ListGroup from "react-bootstrap/ListGroup";
import Tab from "react-bootstrap/Tab";
import Col from "react-bootstrap/Col";
import { useDispatch } from "react-redux";
import { setSelectedSettings } from "../../store/settingsPageState";

const SettingsItems = () => {
  const dispatch = useDispatch();

  const listClick = (clickedItem) => {
    dispatch(setSelectedSettings(clickedItem));
  };

  return (
    <Tab.Container
      id="list-group-tabs-example"
      defaultActiveKey="#user-profile"
    >
      <Col md={8}>
        <ListGroup>
          <ListGroup.Item
            action
            href="#user-profile"
            variant="dark"
            onClick={() => listClick("user_profile")}
          >
            User Profile
          </ListGroup.Item>
          <ListGroup.Item
            action
            href="#users-page"
            variant="dark"
            onClick={() => listClick("users_page")}
          >
            Users
          </ListGroup.Item>
          <ListGroup.Item
            action
            href="#programs-page"
            variant="dark"
            onClick={() => listClick("programs_page")}
          >
            Programs
          </ListGroup.Item>
          <ListGroup.Item
            action
            href="#courses-page"
            variant="dark"
            onClick={() => listClick("courses_page")}
          >
            Courses
          </ListGroup.Item>
        </ListGroup>
      </Col>
    </Tab.Container>
  );
};

export default SettingsItems;
