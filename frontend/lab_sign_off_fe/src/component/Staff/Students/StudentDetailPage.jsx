import { useState, useEffect } from "react";
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
import StudentEnrollModal from "./StudentEnrollModal";
import { Button } from "react-bootstrap";

const token = tokenLoader();

const StudentDetailPage = () => {
  const [data, setData] = useState(null);
  const { selectedRowId } = useParams();
  const [showModal, setShowModal] = useState(false);

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

  useEffect(() => {
    fetchData();
  }, [selectedRowId]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    fetchData();
  };

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
      <Card style={{ marginBottom: "20px" }}>
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
      <Button variant="dark" onClick={handleShowModal}>
        Enroll Student
      </Button>
      <StudentEnrollModal
        show={showModal}
        handleClose={handleCloseModal}
        studentId={selectedRowId}
      />
    </Container>
  );
};

export default StudentDetailPage;
