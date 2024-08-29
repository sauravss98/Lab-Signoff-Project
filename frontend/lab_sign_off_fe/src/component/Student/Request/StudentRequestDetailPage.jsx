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
import FileUploadInfo from "../../FileUploadInfo/FileUploadInfo";

const token = tokenLoader();

const StudentRequestDetailPage = () => {
  const [data, setData] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const { requestId } = useParams();

  const fetchRequestData = async () => {
    try {
      const userDataResponse = await axiosInstance.get(`users/user_details`, {
        headers: {
          Authorization: "Token " + token,
        },
      });
      setActiveUser(userDataResponse.data);

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

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage("");
  };

  const onDownloadClick = async (messageId) => {
    try {
      const response = await axiosInstance.get(
        `requests/request_messages/${messageId}/download/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
          responseType: "blob",
        }
      );

      const contentDisposition = response.headers["content-disposition"];
      let filename = "download_" + messageId;

      if (contentDisposition && contentDisposition.includes("filename=")) {
        const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (fileNameMatch.length > 1) {
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
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Messages</Typography>
                  {data.messages.map((msg) => {
                    const isUserMessage = msg.sender.id === activeUser?.id;
                    return (
                      <Box
                        key={msg.id}
                        my={2}
                        display="flex"
                        flexDirection={isUserMessage ? "row-reverse" : "row"}
                      >
                        <Box
                          p={2}
                          borderRadius={8}
                          maxWidth="70%"
                          bgcolor={isUserMessage ? "#e1f5fe" : "#fff3e0"}
                          boxShadow={2}
                          ml={isUserMessage ? 0 : 2}
                          mr={isUserMessage ? 2 : 0}
                        >
                          <Typography variant="body2">
                            {msg.sender.first_name} {msg.sender.last_name}:{" "}
                            {msg.message}
                          </Typography>
                          {msg.file && (
                            <Box mt={1}>
                              <img
                                src={msg.file}
                                alt="Attachment"
                                style={{ maxWidth: "100%", cursor: "pointer" }}
                                onClick={() => openModal(msg.file)}
                              />
                              <IconButton
                                download
                                size="small"
                                style={{ marginTop: "10px" }}
                                onClick={() => onDownloadClick(msg.id)}
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
                    );
                  })}
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
                    <Box display="flex" alignItems="center">
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
                      <FileUploadInfo file={file} />
                    </Box>
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
          alt="Full Size"
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />
      </ReactModal>
    </Container>
  );
};

export default StudentRequestDetailPage;
