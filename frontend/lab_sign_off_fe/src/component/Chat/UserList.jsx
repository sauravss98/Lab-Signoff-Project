import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import axiosInstance from "../../utils/Axios";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Container,
} from "@mui/material";

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let results = [];
        let nextPageUrl = "users/chat/users/";
        while (nextPageUrl) {
          const response = await axiosInstance.get(nextPageUrl);
          results = results.concat(response.data.results);
          nextPageUrl = response.data.next;
        }
        setUsers(Array.isArray(results) ? results : []);
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
    };

    fetchUsers();
  }, []);

  return (
    <Container maxWidth="xs" sx={{ p: 2, borderRight: "1px solid #ccc" }}>
      <Paper
        elevation={2}
        sx={{ padding: 2, height: "100%", overflowY: "auto" }}
      >
        <Typography variant="h6" gutterBottom>
          Users
        </Typography>
        <List>
          {users.length > 0 ? (
            users.map((user) => (
              <ListItem button key={user.id} onClick={() => onSelectUser(user)}>
                <ListItemText primary={user.username} />
              </ListItem>
            ))
          ) : (
            <ListItem>No users available</ListItem>
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default UserList;
