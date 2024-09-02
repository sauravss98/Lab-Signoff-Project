import { Container, Grid, Paper, Box, Typography } from "@mui/material";
import CoursesGridComponent from "./CoursesGridComponent";
import CourseEnrollmentChart from "../Charts/CourseEnrollmentChart";
import "./CoursesListComponent.css";

const CoursesListComponent = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper elevation={3} sx={{ padding: 2, width: "100%", maxWidth: 800 }}>
          <Typography variant="h4" gutterBottom align="center">
            Course Enrollment
          </Typography>
          <CourseEnrollmentChart />
        </Paper>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <CoursesGridComponent />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CoursesListComponent;
