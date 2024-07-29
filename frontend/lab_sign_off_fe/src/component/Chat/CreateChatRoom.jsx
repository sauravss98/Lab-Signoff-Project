import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Box } from "@mui/material";

const CreateChatRoom = ({ onRoomCreated }) => {
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState(null);

  const handleCreateRoom = async () => {
    try {
      const response = await axios.post("http://localhost:8000/chat/rooms/", {
        name: roomName,
      });
      setRoomName("");
      onRoomCreated(response.data);
    } catch (error) {
      setError(error.response?.data?.detail || "Failed to create room");
    }
  };

  return (
    <Box mb={2}>
      <Typography variant="h6" gutterBottom>
        Create a New Chat Room
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        variant="outlined"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Enter room name"
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleCreateRoom}>
        Create Room
      </Button>
    </Box>
  );
};

export default CreateChatRoom;
