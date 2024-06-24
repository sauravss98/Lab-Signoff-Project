import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SettingsItems from "../../component/SettingsItemsComponent/SettingsItems";
import { useSelector } from "react-redux";
import UserProfileComponent from "../../component/UserProfileComponent/UserProfileComponent";
import UserListComponent from "../../component/UsersListPage/UserListComponent";
import ProgramsListComponent from "../../component/ProgramsListComponent/ProgramsListComponent";
import CoursesListComponent from "../../component/CoursesListComponent/CoursesListComponent";

const SettingsPage = () => {
  const settingsState = useSelector(
    (state) => state.settingsPage.selected_settings
  );
  return (
    <div>
      <Row>
        <Col lg={4}>
          <SettingsItems />
        </Col>
        <Col lg={8}>
          <Container>
            {settingsState === "user_profile" && <UserProfileComponent />}
            {settingsState === "users_page" && <UserListComponent />}
            {settingsState === "programs_page" && <ProgramsListComponent />}
            {settingsState === "courses_page" && <CoursesListComponent />}
          </Container>
        </Col>
      </Row>
    </div>
  );
};

export default SettingsPage;
