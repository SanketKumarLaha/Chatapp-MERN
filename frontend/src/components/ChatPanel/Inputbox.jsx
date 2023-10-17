import React, { useState } from "react";
import { useClickedUserContext } from "../../hooks/useClickedUserContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { redirect } from "react-router-dom";
import { useConversationsContext } from "../../hooks/useConversationsContext";
import { SendHorizonal } from "lucide-react";

const Inputbox = ({ setShowChatMessages }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { clickedUser } = useClickedUserContext();

  const clickedUserId = clickedUser;

  const { user, dispatch } = useAuthContext();

  const { setConversations } = useConversationsContext();

  // sending message
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("sending message");
    const body = {
      receiverId: clickedUserId,
      message: message,
    };

    if (!message.length) {
      return;
    }
    setLoading(true);

    const response = await fetch(
      process.env.REACT_APP_BACKEND_URL + "/api/messages/sendMessage",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const newMessage = await response.json();

    console.log("after sending", newMessage);

    if (response.status !== 200) {
      alert("Your token has been expired, login again");
      dispatch({ type: "LOGOUT" });
      localStorage.removeItem("user");
      return redirect("/login");
    }

    setShowChatMessages((prev) => [...prev, newMessage]);

    setConversations((prev) => {
      const updatedConvos = prev.map((item) => {
        if (item._id === newMessage.conversationId) {
          return {
            ...item,
            lastMessage: {
              text: newMessage.message,
              sender: newMessage.sender,
            },
            updatedAt: newMessage.updatedAt,
          };
        }
        if (item._id === -1) {
          item._id = newMessage.conversationId;
          return {
            ...item,
            lastMessage: {
              text: newMessage.message,
              sender: newMessage.sender,
            },
            updatedAt: newMessage.updatedAt,
          };
        }
        return item;
      });
      return updatedConvos;
    });
    setLoading(false);
    setMessage("");
  };

  return (
    <div className="">
      <form
        action=""
        onSubmit={handleSubmit}
        className=" h-20 p-1 bg-primary-color flex justify-around items-center"
      >
        <div className="w-10/12 h-2/3 mr-5 px-10 flex items-center rounded-full bg-slate-800">
          <input
            type="text"
            value={message}
            placeholder="Type a message..."
            onChange={(e) => setMessage(e.target.value)}
            className="w-full outline-none bg-slate-800"
          />
        </div>
        <div className=" flex justify-center items-start">
          <button
            disabled={loading}
            className="flex justify-around items-center rounded-full cursor-pointer  w-full p-2 bg-gradient-to-r from-blue-300 to-yellow-300"
          >
            <h1 className="text-sm font-semibold text-black mr-1">
              {loading ? "Sending..." : "Send"}
            </h1>
            <SendHorizonal size={26} strokeWidth={2} className="text-black" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Inputbox;
