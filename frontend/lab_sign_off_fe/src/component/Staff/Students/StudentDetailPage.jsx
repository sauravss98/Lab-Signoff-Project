import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { tokenLoader } from "../../../utils/token";
import axiosInstance from "../../../utils/Axios";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import Button from "react-bootstrap/esm/Button";

const token = tokenLoader();

const StudentDetailPage = () => {
  const [data, setData] = useState(null);
  const { selectedRowId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `lab-session/student-enrollment/${selectedRowId}/`,
          {
            headers: {
              Authorization: "Token " + token,
            },
          }
        );
        setData(response.data);
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
    };
    fetchData();
  }, [selectedRowId]);

  if (!data) {
    return (
      <Container style={{ textAlign: "center", marginTop: "50px" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <ToastContainer />
      <Typography variant="h4" gutterBottom>
        Student Details
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h5" component="div">
            {data.first_name} {data.last_name}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <strong>Email:</strong> {data.email}
          </Typography>
          <Typography variant="h6" gutterBottom style={{ marginTop: "16px" }}>
            Enrolled Courses:
          </Typography>
          <List>
            {data.enrolled_courses.map((course) => (
              <ListItem key={course.id}>
                <ListItemText primary={course.course_name} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
      <Button variant="dark">Enroll</Button>
    </Container>
  );
};

export default StudentDetailPage;
