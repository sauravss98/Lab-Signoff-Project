import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import { Bounce, toast } from "react-toastify";
import axiosInstance from "../../../utils/Axios";
import { tokenLoader } from "../../../utils/token";
import CoursesLabsGrid from "./CoursesLabsGrid";
import CompletionRatesByCourseChart from "../../Charts/CompletionRatesByCourseChart";

const token = tokenLoader();

const CoursesLabsDetailPage = () => {
  const { selectedRowId } = useParams();
  const [courseDetails, setCourseDetails] = useState({});
  const [tabValue, setTabValue] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/courses/${selectedRowId}/`, {
        headers: {
          Authorization: "Token " + token,
        },
      });
      setCourseDetails(response.data);
    } catch (error) {
      let errorMessage = "Error loading data";
      const errorData = error.response;
      if (
        errorData?.data.detail ===
        "You do not have permission to perform this action."
      ) {
        errorMessage = "You do not have permission to perform this action.";
      }
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  }, [selectedRowId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handler for tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ padding: 1 }}>
      <Card variant="outlined">
        <CardContent sx={{ padding: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Course ID:</Typography>
              <Typography variant="body2">
                {courseDetails.id || "Loading..."}
              </Typography>
            </Grid>
            <Divider variant="middle" sx={{ width: "100%", marginY: 0.5 }} />
            <Grid item xs={12}>
              <Typography variant="subtitle2">Course Name:</Typography>
              <Typography variant="body2">
                {courseDetails.course_name || "Loading..."}
              </Typography>
            </Grid>
            <Divider variant="middle" sx={{ width: "100%", marginY: 0.5 }} />
            <Grid item xs={12}>
              <Typography variant="subtitle2">Staff:</Typography>
              {courseDetails.staff ? (
                courseDetails.staff.map((staffMember) => (
                  <Chip
                    key={staffMember.id}
                    label={`${staffMember.first_name} ${staffMember.last_name}`}
                    sx={{ marginRight: 0.5, marginBottom: 0.5 }}
                  />
                ))
              ) : (
                <Typography variant="body2">Loading...</Typography>
              )}
            </Grid>
            <Divider variant="middle" sx={{ width: "100%", marginY: 0.5 }} />
            <Grid item xs={12}>
              <Typography variant="subtitle2">Programs:</Typography>
              {courseDetails.programs ? (
                courseDetails.programs.map((program) => (
                  <Chip
                    key={program.id}
                    label={program.program_name}
                    sx={{ marginRight: 0.5, marginBottom: 0.5 }}
                  />
                ))
              ) : (
                <Typography variant="body2">Loading...</Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
        sx={{ marginTop: 2 }}
      >
        <Tab label="Chart" />
        <Tab label="Grid" />
      </Tabs>

      {tabValue === 0 && courseDetails.course_name && (
        <CompletionRatesByCourseChart courseName={courseDetails.course_name} />
      )}
      {tabValue === 1 && <CoursesLabsGrid course_id={Number(selectedRowId)} />}
    </Box>
  );
};

export default CoursesLabsDetailPage;
