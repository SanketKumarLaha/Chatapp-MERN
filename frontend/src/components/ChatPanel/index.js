import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useClickedUserContext } from "../../hooks/useClickedUserContext";
import { redirect } from "react-router-dom";
import Header from "./Header";
import Chatbox from "./Chatbox";
import Inputbox from "./Inputbox";
import { useUsersContext } from "../../hooks/useUsersContext";
import { useSocketContext } from "../../hooks/useSocketContext";
import { useSelectedConversionContextProvider } from "../../hooks/useSelectedConversionContext";
import { useConversationsContext } from "../../hooks/useConversationsContext";

const ChatPanel = () => {
  const { user, dispatch } = useAuthContext();
  const { clickedUser } = useClickedUserContext();

  const [showChatMessages, setShowChatMessages] = useState([]);

  const clickedUserId = clickedUser;
  const userId = user.newUser._id;

  const clickedUserLength = clickedUser.length;

  const { setUsers } = useUsersContext();
  const { socket } = useSocketContext();
  const { selectedConversion } = useSelectedConversionContextProvider();
  const { setConversations } = useConversationsContext();



  // getting all the messages of the user
  useEffect(() => {
    const callMessagesApi = async () => {
      setShowChatMessages([]);

      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `/api/messages/getMessages`,
        {
          method: "POST",
          body: JSON.stringify({ receiverId: clickedUserId }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const json = await response.json();

      if (response.status === 200) {
        setShowChatMessages(json);
      } else if (response.status === 407) {
        alert("Your token has been expired, login again");
        dispatch({ type: "LOGOUT" });
        localStorage.removeItem("user");
        return redirect("/login");
      } else {
        setShowChatMessages([]);
      }
    };
    if (userId) callMessagesApi();
  }, [userId, clickedUserId, dispatch, user.token]);

  // getting new message from socket 👍
  useEffect(() => {
    socket.on("newMessage", (newMessage) => {
      console.log("selectedConversionid", selectedConversion._id);
      if (selectedConversion._id === newMessage.conversationId) {
        console.log("newMessage", newMessage);
        setShowChatMessages((prev) => [...prev, newMessage]);
      }
      setConversations((prev) => {
        const updatedConvos = prev.map((item) => {
          if (item._id === newMessage.conversationId) {
            return {
              ...item,
              lastMessage: {
                text: newMessage.message,
                sender: newMessage.sender,
              },
            };
          }
          return item;
        });
        return updatedConvos;
      });
      setUsers((prev) => !prev);
    });

    return () => socket.off("newMessage");
  }, [
    socket,
    setConversations,
    setShowChatMessages,
    selectedConversion._id,
    setUsers,
  ]);

  return !clickedUserLength ? (
    <div
      className={`lg:w-3/4 ${
        clickedUserLength ? "w-full" : "w-0"
      } h-full bg-primary-color
      `}
    ></div>
  ) : (
    <div
      className={`lg:w-3/4 ${
        clickedUserLength ? "w-full" : "w-0"
      } h-full bg-primary-color text-third-color`}
    >
      <Header />
      <Chatbox
        showChatMessages={showChatMessages}
        setShowChatMessages={setShowChatMessages}
      />
      <Inputbox setShowChatMessages={setShowChatMessages} />
    </div>
  );
};

export default ChatPanel;
