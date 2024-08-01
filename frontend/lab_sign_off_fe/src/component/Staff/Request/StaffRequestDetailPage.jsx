import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../utils/Axios";
import { Bounce, toast } from "react-toastify";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { tokenLoader } from "../../../utils/token";

const token = tokenLoader();

const StaffRequestDetailPage = () => {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const { requestId } = useParams();

  const fetchRequestData = async () => {
    try {
      const response = await axiosInstance.get(`requests/${requestId}/`, {
        headers: {
          Authorization: "Token " + token,
        },
      });
      setData(response.data);
    } catch (error) {
      toast.error("Error loading data", {
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
    fetchRequestData();
  }, [requestId]);

  const handleAddMessage = async () => {
    // Handle the message submission logic here
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleCloseRequest = () => {
    // Handle closing the request logic here
  };

  const handleSignOffLab = async () => {
    try {
      const studentId = data.student_lab_session.student;
      const courseId = data.student_lab_session.lab_session.id;
      const payload = { completed: true };
      const response = await axiosInstance.patch(
        `lab-session/student-lab-sessions/${studentId}/${courseId}/update/`,
        payload,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
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
      fetchRequestData();
    } catch (error) {
      console.error(
        "Error marking lab session as complete",
        error.response ? error.response.data : error.message
      );
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

  return (
    <Container>
      {data && (
        <Box my={4}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Request Details</Typography>
                  <Typography>ID: {data.id}</Typography>
                  <Typography>
                    Student: {data.student.first_name} {data.student.last_name}
                  </Typography>
                  <Typography>Email: {data.student.email}</Typography>
                  <Typography>
                    Lab Session ID: {data.student_lab_session.id}
                  </Typography>
                  <Typography>
                    Status:{" "}
                    {data.student_lab_session.completed
                      ? "Completed"
                      : "Incomplete"}
                  </Typography>
                  <Typography>Request Status: {data.status}</Typography>
                  <Typography>Created At: {data.created_at}</Typography>
                  <Typography>Updated At: {data.updated_at}</Typography>
                  <Box mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSignOffLab}
                    >
                      Sign Off Lab
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleCloseRequest}
                      style={{ marginLeft: "10px" }}
                    >
                      Close Request
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Messages</Typography>
                  {data.messages.map((msg) => (
                    <Box key={msg.id} my={2}>
                      <Typography variant="body2">
                        {msg.sender.first_name} {msg.sender.last_name}:{" "}
                        {msg.message}
                      </Typography>
                      {msg.file && (
                        <img
                          src={msg.file}
                          alt="Attachment"
                          style={{ maxWidth: "100%" }}
                        />
                      )}
                      <Typography variant="caption" color="textSecondary">
                        {new Date(msg.created_at).toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                  <Box mt={4}>
                    <Typography variant="h6">Add New Message</Typography>
                    <TextField
                      label="Message"
                      multiline
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      variant="outlined"
                      fullWidth
                      margin="normal"
                    />
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="file-upload"
                      type="file"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload">
                      <Button
                        variant="contained"
                        color="primary"
                        component="span"
                      >
                        Upload File
                      </Button>
                    </label>
                    <Box mt={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddMessage}
                      >
                        Add Message
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default StaffRequestDetailPage;
