import React, { useState, useEffect, useCallback } from "react";
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
} from "@mui/material";
import { tokenLoader } from "../../utils/token"; // Ensure this function is defined

const ChatRoom = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);

  const connect = useCallback(() => {
    const token = tokenLoader();
    const wsUrl = `ws://localhost:8000/ws/chat/user/${user.id}/?token=${token}`;
    console.log("Connecting to WebSocket URL:", wsUrl);

    const chatSocket = new WebSocket(wsUrl);

    chatSocket.onopen = () => {
      console.log("WebSocket connection established");
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "system", content: "Connected to chat" },
      ]);
    };

    chatSocket.onmessage = (e) => {
      console.log("Received message:", e.data);
      try {
        const data = JSON.parse(e.data);
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "message", content: data.message },
        ]);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    chatSocket.onclose = (e) => {
      console.error("WebSocket closed unexpectedly:", e.code, e.reason);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "error",
          content: `Connection closed: ${e.reason || "No reason"}`,
        },
      ]);
      setTimeout(() => connect(), 3000);
    };

    chatSocket.onerror = (error) => {
      console.error("WebSocket error:", error.message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "error", content: `WebSocket error: ${error.message}` },
      ]);
    };

    setSocket(chatSocket);

    return () => {
      if (chatSocket) {
        chatSocket.close();
      }
    };
  }, [user.id]);

  useEffect(() => {
    connect();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [connect]);

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN && newMessage.trim()) {
      console.log("Sending message:", newMessage);
      socket.send(JSON.stringify({ message: newMessage }));
      setNewMessage("");
    } else {
      console.error("WebSocket is not open. ReadyState:", socket?.readyState);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "error", content: "Unable to send message. Please try again." },
      ]);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          display: "flex",
          flexDirection: "column",
          height: "80vh",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Chat with {user.username}
        </Typography>
        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          <List>
            {messages.map((msg, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={msg.content}
                  sx={{
                    color:
                      msg.type === "error"
                        ? "red"
                        : msg.type === "system"
                        ? "blue"
                        : "inherit",
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <TextField
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            fullWidth
            variant="outlined"
            sx={{ mr: 1 }}
          />
          <Button onClick={sendMessage} variant="contained" color="primary">
            Send
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChatRoom;
