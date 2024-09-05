import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/Axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
} from "@mui/material";
import { tokenLoader } from "../../../utils/token";

const token = tokenLoader();

const CourseStatusDetails = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const studentResponse = await axiosInstance.get(
          "/lab-session/student-enrollment-details/",
          {
            headers: {
              Authorization: "Token " + token,
            },
          }
        );
        const enrolledCourses = studentResponse.data.enrolled_courses;

        const coursesWithDetails = await Promise.all(
          enrolledCourses.map(async (course) => {
            const sessionsResponse = await axiosInstance.get(
              `/lab-session/courses-details/${course.id}/lab-sessions/`,
              {
                headers: {
                  Authorization: "Token " + token,
                },
              }
            );
            const incompleteSessions = sessionsResponse.data.results.filter(
              (session) => !session.completed
            );

            const progressResponse = await axiosInstance.get(
              `/lab-session/courses/${course.id}/progress/`,
              {
                headers: {
                  Authorization: "Token " + token,
                },
              }
            );
            const progress = progressResponse.data.progress;

            return {
              ...course,
              incompleteSessions,
              progress,
            };
          })
        );

        setCourses(coursesWithDetails);
      } catch (error) {
        console.error("Error fetching course data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Enrolled Courses
      </Typography>
      <Grid container spacing={2}>
        {courses.map((course) => (
          <Grid item xs={12} key={course.id}>
            <Card sx={{ backgroundColor: "#f5f5f5" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {course.course_name} - Progress: {course.progress}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={parseFloat(course.progress)}
                  sx={{ marginBottom: 2 }}
                />
                <Grid container spacing={2}>
                  {course.incompleteSessions.map((session) => (
                    <Grid item xs={3} key={session.id}>
                      <Card sx={{ backgroundColor: "#e0e0e0", padding: 2 }}>
                        <CardContent>
                          <Typography variant="subtitle1" gutterBottom>
                            {session.lab_session_name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ marginTop: 1 }}
                          >
                            {session.lab_session_description ||
                              "No description available"}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CourseStatusDetails;
