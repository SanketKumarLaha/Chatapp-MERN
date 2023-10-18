import React, { useEffect } from "react";
import UserCard from "./UserCard";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useUsersContext } from "../../hooks/useUsersContext";
import { useClickedUserContext } from "../../hooks/useClickedUserContext";
import { useConversationsContext } from "../../hooks/useConversationsContext";
import { redirect } from "react-router-dom";
import AllUsers from "./AllUsers";
import { useSocketContext } from "../../hooks/useSocketContext";
import { useOnlineUsersContext } from "../../hooks/useOnlineUsersContext";

const UsersPanel = () => {
  const { users } = useUsersContext();
  const { user, dispatch } = useAuthContext();
  const { clickedUser } = useClickedUserContext();
  const { socket } = useSocketContext();
  const { conversations, setConversations } = useConversationsContext();
  const { setOnlineUsers } = useOnlineUsersContext();

  // filtering Conversations
  useEffect(() => {
    const fetchConversations = async () => {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/api/messages/getConversations",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const json = await response.json();

      if (response.status === 200) {
        setConversations(json);
      } else {
        alert("Your token has been expired, login again");
        dispatch({ type: "LOGOUT" });
        localStorage.removeItem("user");
        return redirect("/login");
      }
    };
    fetchConversations();
  }, [user, setConversations, users, dispatch]);

  useEffect(() => {
    const onlineFn = (users) => {
      setOnlineUsers(Object.keys(users));
    };

    socket.on("online", onlineFn);

    return () => socket.off("online", onlineFn);
  }, [socket, setOnlineUsers]);

  if (!conversations) return;

  return (
    <div
      className={`${
        clickedUser.length ? "w-0" : "w-full"
      } lg:w-1/4 h-full relative overflow-hidden box-border bg-green-500 border-r-2 border-secondary-color`}
    >
      <AllUsers />
      <div className="w-full h-full overflow-auto bg-primary-color">
        {conversations &&
          conversations.map((conversation) => (
            <UserCard key={conversation._id} conversation={conversation} />
          ))}
      </div>
    </div>
  );
};

export default UsersPanel;
