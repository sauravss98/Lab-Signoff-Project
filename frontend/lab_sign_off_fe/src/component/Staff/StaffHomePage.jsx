import { useRef } from "react";
import {
  Container,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CompletionRatesChart from "../Charts/CompletionRatesChart";
import CourseEnrollmentChart from "../Charts/CourseEnrollmentChart";
import CourseParticipationChart from "../Charts/CourseParticipationChart";
import CourseRatingsChart from "../Charts/CourseRatingsChart";
import EnrollmentTrendsChart from "../Charts/EnrollmentTrendsChart";
import LabRequestStatusChart from "../Charts/LabRequestStatusChart";
import LabRequestTrendsChart from "../Charts/LabRequestTrendsChart";
import OverallFeedbackChart from "../Charts/OverallFeedbackChart";
import RatingDistribution from "../Charts/RatingDistribution";
import UserTypeDistributionChart from "../Charts/UserTypeDistributionChart";
// import ProgramStudentCountChart from "../Charts/ProgramStudentCountChart";
import CompletionVsFeedbackChart from "../Charts/CompletionVsFeedbackChart";
import EnrollmentVsParticipationChart from "../Charts/EnrollmentVsParticipationChart";
// import CompletionRatesByCourseChart from "../Charts/CompletionRatesByCourseChart";

const StaffHomePage = () => {
  // Refs for each chart
  const overallFeedbackRef = useRef(null);
  const ratingDistributionRef = useRef(null);
  const courseRatingsRef = useRef(null);
  const completionVsFeedbackRef = useRef(null);
  const enrollmentTrendsRef = useRef(null);
  const courseEnrollmentRef = useRef(null);
  const completionRatesRef = useRef(null);
  const courseParticipationRef = useRef(null);
  const enrollmentVsParticipationRef = useRef(null);
  // const completionRatesByCourseRef = useRef(null);
  const labRequestStatusRef = useRef(null);
  const labRequestTrendsRef = useRef(null);
  const userTypeDistributionRef = useRef(null);

  const maxHeight = 400;

  // Scroll size control function
  const getScrollStyle = (ref) => {
    if (ref && ref.current && ref.current.scrollHeight > maxHeight) {
      return { maxHeight, overflowY: "auto" };
    }
    return {};
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Data Hub
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Accordion defaultExpanded sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Feedback Charts</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper
                  elevation={3}
                  ref={overallFeedbackRef}
                  sx={{ p: 2, ...getScrollStyle(overallFeedbackRef) }}
                >
                  <OverallFeedbackChart />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper
                  elevation={3}
                  ref={ratingDistributionRef}
                  sx={{ p: 2, ...getScrollStyle(ratingDistributionRef) }}
                >
                  <RatingDistribution />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper
                  elevation={3}
                  ref={courseRatingsRef}
                  sx={{ p: 2, ...getScrollStyle(courseRatingsRef) }}
                >
                  <CourseRatingsChart />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper
                  elevation={3}
                  ref={completionVsFeedbackRef}
                  sx={{ p: 2, ...getScrollStyle(completionVsFeedbackRef) }}
                >
                  <CompletionVsFeedbackChart />
                </Paper>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">
              Enrollment and Participation Charts
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper
                  elevation={3}
                  ref={enrollmentTrendsRef}
                  sx={{ p: 2, ...getScrollStyle(enrollmentTrendsRef) }}
                >
                  <EnrollmentTrendsChart />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper
                  elevation={3}
                  ref={courseEnrollmentRef}
                  sx={{ p: 2, ...getScrollStyle(courseEnrollmentRef) }}
                >
                  <CourseEnrollmentChart />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper
                  elevation={3}
                  ref={completionRatesRef}
                  sx={{ p: 2, ...getScrollStyle(completionRatesRef) }}
                >
                  <CompletionRatesChart />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper
                  elevation={3}
                  ref={courseParticipationRef}
                  sx={{ p: 2, ...getScrollStyle(courseParticipationRef) }}
                >
                  <CourseParticipationChart />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper
                  elevation={3}
                  ref={enrollmentVsParticipationRef}
                  sx={{ p: 2, ...getScrollStyle(enrollmentVsParticipationRef) }}
                >
                  <EnrollmentVsParticipationChart />
                </Paper>
              </Grid>
              {/* <Grid item xs={12}>
                <Paper
                  elevation={3}
                  ref={completionRatesByCourseRef}
                  sx={{ p: 2, ...getScrollStyle(completionRatesByCourseRef) }}
                >
                  <CompletionRatesByCourseChart courseName="Introduction to Python" />
                </Paper> */}
              {/* </Grid> */}
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Lab Request Charts</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper
                  elevation={3}
                  ref={labRequestStatusRef}
                  sx={{ p: 2, ...getScrollStyle(labRequestStatusRef) }}
                >
                  <LabRequestStatusChart />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper
                  elevation={3}
                  ref={labRequestTrendsRef}
                  sx={{ p: 2, ...getScrollStyle(labRequestTrendsRef) }}
                >
                  <LabRequestTrendsChart />
                </Paper>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">User Distribution Charts</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper
                  elevation={3}
                  ref={userTypeDistributionRef}
                  sx={{ p: 2, ...getScrollStyle(userTypeDistributionRef) }}
                >
                  <UserTypeDistributionChart selectedType={"all"} />
                </Paper>
              </Grid>
              {/* Backend issue with the chart */}
              {/* <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 2, maxHeight: 400, overflowY: "auto" }}>
                  <ProgramStudentCountChart />
                </Paper>
              </Grid> */}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Container>
    </>
  );
};

export default StaffHomePage;
