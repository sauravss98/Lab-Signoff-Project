import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import StudentEnrollmentDetailTab from "./StudentEnrollmentDetailTab";
import StudentLabProgressComponent from "./StudentLabProgressComponent";

const StudentDetailPage = () => {
  const [tabItem, setTabItem] = useState("enroll");
  const handleChange = (event, newValue) => {
    setTabItem(newValue);
  };
  return (
    <>
      <Tabs
        value={tabItem}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        aria-label="secondary tabs example"
      >
        <Tab value="enroll" label="Enroll Student" />
        <Tab value="mark" label="Student Lab Status" />
      </Tabs>
      {tabItem === "enroll" && <StudentEnrollmentDetailTab />}
      {tabItem === "mark" && <StudentLabProgressComponent />}
    </>
  );
};

export default StudentDetailPage;
