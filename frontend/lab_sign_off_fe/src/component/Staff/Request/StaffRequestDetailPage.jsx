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
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { tokenLoader } from "../../../utils/token";

const token = tokenLoader();

const StaffRequestDetailPage = () => {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
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

  const fetchCurrentUser = async () => {
    try {
      const response = await axiosInstance.get("users/user_details", {
        headers: {
          Authorization: "Token " + token,
        },
      });
      setCurrentUserId(response.data.id);
    } catch (error) {
      console.error("Error fetching current user data", error);
    }
  };

  useEffect(() => {
    fetchRequestData();
    fetchCurrentUser();
  }, [requestId]);

  const handleAddMessage = async () => {
    const formData = new FormData();
    formData.append("message", message);
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await axiosInstance.post(
        `requests/${requestId}/messages/create/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        toast.success("Message sent successfully", {
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
        setMessage("");
        setFile(null);
        fetchRequestData();
      }
    } catch (error) {
      toast.error("Error sending message", {
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

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSignOffLab = async () => {
    try {
      const request_payload = { status: "approved" };
      const request_update_response = await axiosInstance.patch(
        `requests/${requestId}/`,
        request_payload,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
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
      if (response.status === 200 || request_update_response.status === 200) {
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
      }
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

  const onDownloadClick = async (id, isRequest = false) => {
    try {
      const endpoint = isRequest
        ? `requests/${requestId}/file-download/`
        : `requests/request_messages/${id}/download/`;

      const response = await axiosInstance.get(endpoint, {
        headers: {
          Authorization: "Token " + token,
        },
        responseType: "blob",
      });

      const contentDisposition = response.headers["content-disposition"];
      let filename = `download_${id}`;

      if (contentDisposition && contentDisposition.includes("filename=")) {
        const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (fileNameMatch && fileNameMatch.length > 1) {
          filename = fileNameMatch[1];
        }
      }

      const blob = new Blob([response.data], { type: response.data.type });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file", error);
      toast.error("Error downloading file", {
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

  const getFileNameFromUrl = (url) => {
    if (!url) return "No file uploaded";
    const parts = url.split("/");
    return parts[parts.length - 1];
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
                  {data.file && (
                    <Box mt={2}>
                      <Typography variant="body2">
                        File: {getFileNameFromUrl(data.file)}
                      </Typography>
                      <IconButton
                        onClick={() => onDownloadClick(data.id, true)}
                        size="small"
                        style={{ marginTop: "10px" }}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Box>
                  )}
                  <Box mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSignOffLab}
                    >
                      Sign Off Lab
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
                    <Box
                      key={msg.id}
                      my={2}
                      display="flex"
                      flexDirection="column"
                      alignItems={
                        msg.sender.id === currentUserId
                          ? "flex-end"
                          : "flex-start"
                      }
                    >
                      <Box
                        bgcolor={
                          msg.sender.id === currentUserId
                            ? "#e1f5fe"
                            : "#fff3e0"
                        }
                        color={
                          msg.sender.id === currentUserId
                            ? "text.primary"
                            : "text.primary"
                        }
                        p={2}
                        borderRadius={2}
                        maxWidth="80%"
                      >
                        <Typography variant="body1">{msg.message}</Typography>
                        {msg.file && (
                          <Box>
                            <Typography variant="body2">
                              File: {getFileNameFromUrl(msg.file)}
                            </Typography>
                            <IconButton
                              onClick={() => onDownloadClick(msg.id)}
                              size="small"
                              style={{ marginTop: "10px" }}
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Box>
                        )}
                        <Typography variant="caption" color="textSecondary">
                          {new Date(msg.created_at).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                  <Box mt={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <input
                      type="file"
                      onChange={handleFileChange}
                      style={{ marginTop: "10px" }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddMessage}
                      style={{ marginTop: "10px" }}
                    >
                      Send
                    </Button>
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
