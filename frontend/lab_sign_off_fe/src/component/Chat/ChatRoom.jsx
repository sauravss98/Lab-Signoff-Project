import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";
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
        console.log(roomName);
        const response = await axiosInstance.get(
          `/chat/messages/room/${roomName}/`
          // {
          //   headers: {
          //     Authorization: "Token " + token,
          //   },
          // }
        );
        // const response = await axios.get(
        //   `http://localhost:8000/chat/messages/room/?room_name=${roomName}`
        // );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }
  }, [user, currentUser]);

  const connect = useCallback(() => {
    if (user && currentUser) {
      const token = tokenLoader();
      const wsUrl = `ws://localhost:8000/ws/chat/user/${user.id}/?token=${token}`;
      console.log("Connecting to WebSocket URL:", wsUrl);

      const chatSocket = new WebSocket(wsUrl);

      chatSocket.onopen = () => {
        console.log("WebSocket connection established");
        fetchMessages();
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
    }
  }, [fetchMessages, user, currentUser]);

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
          {user ? `Chat with ${user.username}` : "Chat"}
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

ChatRoom.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
};

export default ChatRoom;
