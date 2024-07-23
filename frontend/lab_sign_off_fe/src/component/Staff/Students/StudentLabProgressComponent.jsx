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
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { Button } from "react-bootstrap";
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

  const handleMarkAsComplete = async (courseId, sessionId) => {
    try {
      const data = { completed: true };
      await axiosInstance.patch(
        `lab-session/student-lab-sessions/${selectedRowId}/${sessionId}/update/`,
        data,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      // Update the state to mark the session as completed
      setData((prevData) => {
        const updatedCourses = prevData.enrolled_courses.map((course) => {
          if (course.id === courseId) {
            const updatedSessions = course.lab_sessions.map((session) => {
              if (session.id === sessionId) {
                return { ...session, completed: true };
              }
              return session;
            });
            return { ...course, lab_sessions: updatedSessions };
          }
          return course;
        });
        return { ...prevData, enrolled_courses: updatedCourses };
      });
      toast.success("Lab session marked as complete", {
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
    } catch (error) {
      toast.error("Error marking lab session as complete", {
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
  };

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
          <Card key={course.id} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {course.course_name}
              </Typography>
              <Divider />
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
                      <Box display="flex" alignItems="center">
                        <Chip
                          label={
                            session.completed ? "Completed" : "Not Completed"
                          }
                          color={session.completed ? "success" : "warning"}
                          variant="outlined"
                        />
                        {!session.completed && (
                          <Button
                            variant="dark"
                            onClick={() =>
                              handleMarkAsComplete(course.id, session.id)
                            }
                          >
                            Mark as Complete
                          </Button>
                        )}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Typography>No lab sessions available</Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default StudentLabProgressComponent;
