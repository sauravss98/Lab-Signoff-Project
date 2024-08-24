import CompletionRatesChart from "../Charts/CompletionRatesChart";
import CourseEnrollmentChart from "../Charts/CourseEnrollmentChart";
import CourseParticipationChart from "../Charts/CourseParticipationChart";
import CourseRatingsChart from "../Charts/CourseRatingsChart";
import EnrollmentTrendsChart from "../Charts/EnrollmentTrendsChart";
import LabRequestStatusChart from "../Charts/LabRequestStatusChart";
import LabRequestTrendsChart from "../Charts/LabRequestTrendsChart";
import OverallFeedbackChart from "../Charts/OverallFeedbackChart";
import RatingDistribution from "../Charts/RatingDistribution";
import { Container, Grid } from "@mui/material";
import UserTypeDistributionChart from "../Charts/UserTypeDistributionChart";
import ProgramStudentCountChart from "../Charts/ProgramStudentCountChart";
import CompletionVsFeedbackChart from "../Charts/CompletionVsFeedbackChart";
import EnrollmentVsParticipationChart from "../Charts/EnrollmentVsParticipationChart";

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
        <Grid item xs={12} md={6}>
          <CompletionRatesChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <CourseParticipationChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <LabRequestStatusChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <LabRequestTrendsChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <UserTypeDistributionChart />
        </Grid>
        {/* not working backend issue */}
        {/* <Grid item xs={12} md={6}>
          <ProgramStudentCountChart />
        </Grid> */}
        <Grid item xs={12} md={6}>
          <CompletionVsFeedbackChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <EnrollmentVsParticipationChart />
        </Grid>
      </Grid>
    </Container>
  );
};

export default StaffHomePage;
