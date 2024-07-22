import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  CircularProgress,
  Container,
  Box,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axiosInstance from "../../../utils/Axios";
import { tokenLoader } from "../../../utils/token";
import { Bounce, toast } from "react-toastify";

const token = tokenLoader();

const StudentLabProgressComponent = () => {
  const { selectedRowId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `lab-session/student/${selectedRowId}/lab-session-details/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        setData(response.data);
      } catch (error) {
        let errorMessage = "Error loading data";
        if (error.response && error.response.data) {
          const errorData = error.response.data;
          if (
            errorData.detail ===
            "You do not have permission to perform this action."
          ) {
            errorMessage = "You do not have permission to perform this action.";
          }
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedRowId]);

  if (loading) {
    return (
      <Container>
        <Box mt={4} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!data || !data.enrolled_courses || data.enrolled_courses.length === 0) {
    return (
      <Container>
        <Box mt={4}>
          <Typography variant="h6" align="center">
            Student is not enrolled in any courses
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box mt={4}>
        {data.enrolled_courses.map((course) => (
          <Accordion key={course.id} sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${course.id}-content`}
              id={`panel-${course.id}-header`}
            >
              <Typography variant="h6">{course.course_name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {course.lab_sessions && course.lab_sessions.length > 0 ? (
                course.lab_sessions.map((session) => (
                  <Accordion key={session.id} sx={{ mb: 1 }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel-${session.id}-content`}
                      id={`panel-${session.id}-header`}
                    >
                      <Typography>{session.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        <Chip
                          label={
                            session.completed ? "Completed" : "Not Completed"
                          }
                          color={session.completed ? "success" : "warning"}
                          variant="outlined"
                        />
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Typography>No lab sessions available</Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
};

export default StudentLabProgressComponent;
