import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { tokenLoader } from "../../../utils/token";
import axiosInstance from "../../../utils/Axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  Chip,
} from "@mui/material";
import RequestCreateModal from "../Request/RequestCreateModal";

const token = tokenLoader();

const CourseDetailPage = () => {
  const [data, setData] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [requestCreateModal, setRequestCreateModal] = useState(false);
  const { course_id } = useParams();

  const fetchData = useCallback(async () => {
    try {
      let results = [];
      let nextPageUrl = `lab-session/courses-details/${course_id}/lab-sessions/`;
      while (nextPageUrl) {
        const response = await axiosInstance.get(nextPageUrl, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        results = results.concat(response.data.results);
        nextPageUrl = response.data.next;
      }
      setData(results);
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
  }, [course_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateModalClose = () => {
    setRequestCreateModal(false);
    fetchData(); // Refresh data after closing the modal
  };

  const handleSendRequest = (labSessionId) => {
    setSessionId(labSessionId);
    setRequestCreateModal(true);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Course {course_id} Lab Sessions
      </Typography>
      {data.map((labSession) => (
        <Card key={labSession.id} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6" component="h2">
              {labSession.lab_session_name}
            </Typography>
            <Box mt={2}>
              <Chip
                label={labSession.completed ? "Completed" : "Not Completed"}
                color={labSession.completed ? "success" : "warning"}
              />
            </Box>
            <Box mt={2}>
              {!labSession.completed && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSendRequest(labSession.lab_session)}
                >
                  Send Request
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      ))}
      <RequestCreateModal
        open={requestCreateModal}
        handleClose={handleCreateModalClose}
        sessionId={sessionId}
      />
    </Container>
  );
};

export default CourseDetailPage;
