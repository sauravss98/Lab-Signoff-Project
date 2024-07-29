import React, { useState } from "react";
import UserList from "./UserList";
import ChatRoom from "./ChatRoom";

const ChatComponent = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <UserList onSelectUser={handleUserSelect} style={{ width: "30%" }} />
      {selectedUser && (
        <div style={{ flexGrow: 1 }}>
          <ChatRoom user={selectedUser} />
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
