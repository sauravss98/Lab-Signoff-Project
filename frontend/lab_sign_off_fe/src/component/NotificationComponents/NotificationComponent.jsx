import { useEffect, useState } from "react";
import { tokenLoader } from "../../utils/token";
import axiosInstance from "../../utils/Axios";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Paper,
} from "@mui/material";
import { Info as InfoIcon } from "@mui/icons-material";

const token = tokenLoader();

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get("/notifications/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      // Extract the `results` array from the response data
      if (Array.isArray(response.data.results)) {
        setNotifications(response.data.results);
      } else {
        console.error("Unexpected data format", response.data);
        setNotifications([]); // Set to empty array to avoid map error
      }
    } catch (error) {
      console.error("Error fetching notifications", error);
      setNotifications([]); // Optionally set to empty array on error
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>
      {notifications.length === 0 ? (
        <Typography variant="body1">No notifications</Typography>
      ) : (
        <List>
          {notifications.map((notification) => (
            <Paper key={notification.id} elevation={3} sx={{ marginBottom: 2 }}>
              <ListItem>
                <ListItemText
                  primary={notification.message}
                  secondary={
                    <>
                      <Typography variant="body2" color="textSecondary">
                        {new Date(notification.created_at).toLocaleString()}
                      </Typography>
                      {notification.extra_data && (
                        <div>
                          {Object.entries(notification.extra_data).map(
                            ([key, value]) => (
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                key={key}
                              >
                                {key}: {value}
                              </Typography>
                            )
                          )}
                        </div>
                      )}
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="info">
                    <InfoIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </Paper>
          ))}
        </List>
      )}
    </Container>
  );
};

export default NotificationComponent;
