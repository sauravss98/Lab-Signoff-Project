import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../utils/Axios";
import { Bounce, toast } from "react-toastify";
import ReactModal from "react-modal";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
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
      if (response.status === 200) {
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

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage("");
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
                        <Box>
                          <img
                            src={msg.file}
                            alt="Attachment"
                            style={{ maxWidth: "100%", cursor: "pointer" }}
                            onClick={() => openModal(msg.file)}
                          />
                          <IconButton
                            href={msg.file}
                            download
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

      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <img
          src={selectedImage}
          alt="Modal Attachment"
          style={{ maxWidth: "100%" }}
        />
        <Box mt={2} display="flex" justifyContent="space-between">
          <IconButton href={selectedImage} download size="small">
            <DownloadIcon />
          </IconButton>
          <Button
            variant="contained"
            color="secondary"
            onClick={closeModal}
            size="small"
          >
            Close
          </Button>
        </Box>
      </ReactModal>
    </Container>
  );
};

export default StaffRequestDetailPage;
