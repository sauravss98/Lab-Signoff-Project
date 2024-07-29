import UserList from "./UserList";
import ChatRoom from "./ChatRoom";
import { tokenLoader } from "../../utils/token";
import axiosInstance from "../../utils/Axios";
import { useEffect, useState } from "react";

const ChatComponent = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = tokenLoader();
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("users/user_details", {
          headers: {
            Authorization: "Token " + token,
          },
        });
        if (response.status === 200) {
          const data = {
            id: response.data.id,
            username: response.data.username,
          };
          setCurrentUser(data);
        } else {
          console.error("Failed to fetch user details", response);
        }
      } catch (error) {
        console.error("Error fetching user details", error);
      }
    };

    fetchData();
  }, []);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <UserList onSelectUser={handleUserSelect} style={{ width: "30%" }} />
      {selectedUser && (
        <div style={{ flexGrow: 1 }}>
          <ChatRoom user={selectedUser} currentUser={currentUser} />
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
