import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SettingsItems from "../../component/SettingsItemsComponent/SettingsItems";
import { useSelector } from "react-redux";

const SettingsPage = () => {
  const settingsState = useSelector(
    (state) => state.settingsPage.selected_settings
  );
  return (
    <div>
      <Row>
        <Col lg={8}>
          <SettingsItems />
        </Col>
        <Col sm={4}>
          <Container>{settingsState}</Container>
        </Col>
      </Row>
    </div>
  );
};

export default SettingsPage;
