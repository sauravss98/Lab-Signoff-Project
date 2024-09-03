import { useRef } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  Grid,
  Typography,
  Divider,
  Paper,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FeedbackGridComponent from "./FeedbackGridComponent";
import OverallFeedbackChart from "../../Charts/OverallFeedbackChart";
import RatingDistribution from "../../Charts/RatingDistribution";
import CourseRatingsChart from "../../Charts/CourseRatingsChart";
import CompletionVsFeedbackChart from "../../Charts/CompletionVsFeedbackChart";

const FeedbackMainPage = () => {
  // Refs for each chart
  const overallFeedbackRef = useRef(null);
  const ratingDistributionRef = useRef(null);
  const courseRatingsRef = useRef(null);
  const completionVsFeedbackRef = useRef(null);

  const maxHeight = 400;

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
          Feedback Overview
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Accordion defaultExpanded>
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

        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Detailed Feedback Table
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Paper elevation={3} sx={{ p: 3 }}>
            <FeedbackGridComponent />
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default FeedbackMainPage;
