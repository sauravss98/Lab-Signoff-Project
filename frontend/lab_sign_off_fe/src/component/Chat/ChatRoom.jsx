// src/components/ChatRoom.jsx
import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Container,
  Divider,
  Grid,
  Chip,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { tokenLoader } from "../../utils/token";
import axiosInstance from "../../utils/Axios";

const ChatRoom = ({ user, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);

  const fetchMessages = useCallback(async () => {
    if (user && currentUser) {
      try {
        const token = tokenLoader();
        const roomName = `chat_user_${Math.min(
          user.id,
          currentUser.id
        )}_${Math.max(user.id, currentUser.id)}`;
        const response = await axiosInstance.get(
          `/chat/messages/room/${roomName}/`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }
  }, [user, currentUser]);

  const connectWebSocket = useCallback(() => {
    if (user && currentUser) {
      const token = tokenLoader();
      const wsUrl = `ws://localhost:8000/ws/chat/user/${user.id}/?token=${token}`;
      const socketInstance = new WebSocket(wsUrl);

      socketInstance.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            content: data.message,
            user: data.sender,
            timestamp: new Date().toISOString(),
          },
        ]);
      };

      socketInstance.onclose = () => {
        console.log("WebSocket closed");
      };

      setSocket(socketInstance);
    }
  }, [user, currentUser]);

  useEffect(() => {
    fetchMessages();
    connectWebSocket();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [fetchMessages, connectWebSocket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (socket && newMessage.trim()) {
      socket.send(
        JSON.stringify({
          message: newMessage,
          sender: currentUser.username,
        })
      );
      setNewMessage("");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom align="center">
          Chat Room
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box
          sx={{
            maxHeight: "500px",
            overflowY: "auto",
            mb: 2,
            p: 1,
            borderRadius: 1,
            border: "1px solid #ddd",
            bgcolor: "#f5f5f5",
          }}
        >
          <List>
            {messages.map((msg, index) => (
              <ListItem
                key={index}
                sx={{
                  mb: 1,
                  justifyContent:
                    msg.user === currentUser.username
                      ? "flex-end"
                      : "flex-start",
                }}
              >
                <Box
                  sx={{
                    maxWidth: "60%",
                    p: 1,
                    borderRadius: 1,
                    bgcolor:
                      msg.user === currentUser.username ? "#d0f0c0" : "#b3e5fc",
                    color: "#000",
                    display: "flex",
                    flexDirection: "column",
                    alignItems:
                      msg.user === currentUser.username
                        ? "flex-end"
                        : "flex-start",
                  }}
                >
                  <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                    {msg.content}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    align={msg.user === currentUser.username ? "right" : "left"}
                  >
                    {msg.timestamp
                      ? new Date(msg.timestamp).toLocaleString()
                      : ""}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <form onSubmit={handleSubmit}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs>
              <TextField
                fullWidth
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item>
              <IconButton
                type="submit"
                color="primary"
                aria-label="send"
                size="large"
              >
                <SendIcon />
              </IconButton>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

ChatRoom.propTypes = {
  user: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default ChatRoom;
