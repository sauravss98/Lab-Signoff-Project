import { Container, Tab, Tabs } from "@mui/material";
import StudentsListMainGridComponent from "./Students/StudentsListMainGridComponent";
import { useState } from "react";

const StudentPageComponent = () => {
  const [tabItem, setTabItem] = useState("enroll");
  const handleChange = (event, newValue) => {
    setTabItem(newValue);
  };
  return (
    <Container>
      <Tabs
        value={tabItem}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        aria-label="secondary tabs example"
      >
        <Tab value="enroll" label="Enroll Student" />
        <Tab value="mark" label="Student Status" />
      </Tabs>
      {tabItem === "enroll" && <StudentsListMainGridComponent />}
      {tabItem === "mark" && <b>Test</b>}
    </Container>
  );
};

export default StudentPageComponent;
