import CourseEnrollmentChart from "../Charts/CourseEnrollmentChart";
import CourseRatingsChart from "../Charts/CourseRatingsChart";
import EnrollmentTrendsChart from "../Charts/EnrollmentTrendsChart";
import OverallFeedbackChart from "../Charts/OverallFeedbackChart";
import RatingDistribution from "../Charts/RatingDistribution";
import { Container, Grid } from "@mui/material";

const StaffHomePage = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <OverallFeedbackChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <RatingDistribution />
        </Grid>
        <Grid item xs={12} md={6}>
          <CourseRatingsChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <EnrollmentTrendsChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <CourseEnrollmentChart />
        </Grid>
      </Grid>
    </Container>
  );
};

export default StaffHomePage;
