import React, { useEffect, useState } from "react";
import { tokenLoader } from "../../utils/token";
import axiosInstance from "../../utils/Axios";

const token = tokenLoader();

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get("notifications/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id}>
              <p>{notification.message}</p>
              <small>
                {new Date(notification.created_at).toLocaleString()}
              </small>
              {notification.extra_data && (
                <div>
                  {Object.entries(notification.extra_data).map(
                    ([key, value]) => (
                      <p key={key}>
                        {key}: {value}
                      </p>
                    )
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationComponent;
