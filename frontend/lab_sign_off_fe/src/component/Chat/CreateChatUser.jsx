import React, { useState } from "react";
import axios from "axios";
import { Container, Typography, TextField, Button, Box } from "@mui/material";

const CreateChatUser = ({ onUserCreated }) => {
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(null);

  const handleCreateUser = async () => {
    try {
      const response = await axios.post("http://localhost:8000/chat/users/", {
        name: userName,
      });
      setUserName("");
      onUserCreated(response.data);
    } catch (error) {
      setError(error.response?.data?.detail || "Failed to create user");
    }
  };

  return (
    <Container>
      <Typography variant="h5">Create a New User</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        fullWidth
        variant="outlined"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Enter user name"
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleCreateUser}>
        Create User
      </Button>
    </Container>
  );
};

export default CreateChatUser;
