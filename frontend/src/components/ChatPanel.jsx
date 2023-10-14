import { ArrowLeft, CheckCheck, SendHorizonal } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useClickedUserContext } from "../hooks/useClickedUserContext";
import { useUsersContext } from "../hooks/useUsersContext";
import { format } from "date-fns";
import { useSocketContext } from "../hooks/useSocketContext";
import { useConversationsContext } from "../hooks/useConversationsContext";
import { useSelectedConversionContextProvider } from "../hooks/useSelectedConversionContext";
import { redirect } from "react-router-dom";

const ChatPanel = () => {
  const { user, dispatch } = useAuthContext();
  const { clickedUser, setClickedUser } = useClickedUserContext();
  const { setUsers } = useUsersContext();
  const { socket } = useSocketContext();
  const { selectedConversion } = useSelectedConversionContextProvider();

  const [message, setMessage] = useState("");
  const [showChatMessages, setShowChatMessages] = useState([]);

  const [loading, setLoading] = useState(false);

  const { setConversations } = useConversationsContext();

  const clickedUserId = clickedUser;
  const userId = user.newUser._id;

  const clickedUserLength = clickedUser.length;
  const [clickedUserDetails, setClickedUserDetails] = useState("");

  const showLastMessage = useRef(null);

  // scroll to new messages 👍
  useEffect(() => {
    showLastMessage.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [showChatMessages]);

  // when clicked back setting the clickedUser context state to empty 👍
  const goBack = () => {
    setClickedUser("");
  };

  // getting all the messages of the user 👍
  useEffect(() => {
    const callMessagesApi = async () => {
      setShowChatMessages([]);

      // getting the last 15 messages of the current user
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

      // if (response.ok)
      // else setShowChatMessages([]);

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
  }, [socket, setConversations, selectedConversion._id, setUsers]);

  // sending message 👍
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

  useEffect(() => {
    const fetchAllOtherUsers = async () => {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/api/users/getUser",
        {
          method: "POST",
          body: JSON.stringify({ userId: clickedUserId }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const json = await response.json();
      if (response.status === 200) {
        setClickedUserDetails(json);
      }
    };
    fetchAllOtherUsers();
  }, [clickedUserId, dispatch, user.token]);

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
      <div className="flex justify-between items-center p-3 h-14 bg-primary-color border-b border-secondary-color box-border">
        <div className="flex items-center">
          <div onClick={goBack} className="cursor-pointer mr-2">
            <ArrowLeft />
          </div>
          <div
            className="bg-[image:var(--display-pic)] bg-cover w-10 h-10 border-2 border-third-color rounded-full bg-red-400"
            style={{
              "--display-pic": `url('${
                clickedUserDetails?.profilePic
                  ? clickedUserDetails.profilePic
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
              }')`,
            }}
          ></div>
          <div className="pl-3 ">
            <h1 className="font-semibold text-lg">
              {clickedUserDetails?.username}
            </h1>
          </div>
        </div>
        <div>{/* <MoreVertical /> */}</div>
      </div>

      <div className="w-full h-[calc(100%-8.5rem)] relative flex flex-col overflow-y-auto  overflow-x-hidden">
        {showChatMessages.length ? (
          showChatMessages.map((item, index) => {
            const date = new Date(item.updatedAt);
            const formattedTime = format(date, "h:mmaaa");
            return (
              <div
                key={index}
                className={`flex p-2 ${
                  item.sender === user?.newUser?._id && "justify-end"
                }`}
              >
                <div
                  className={`m-1 max-w-[70%] rounded-lg flex justify-between ${
                    item.sender === user?.newUser?._id
                      ? "bg-gradient-to-r from-pink-700 to-pink-600"
                      : "bg-gradient-to-r from-slate-700 to-slate-600"
                  }`}
                >
                  <div className="p-1 whitespace-pre-wrap break-words">
                    <h1
                      className={`text-lg px-3 ${
                        item.sender === user?.newUser?._id
                          ? "text-white"
                          : "text-third-color"
                      }`}
                    >
                      {item.message}
                    </h1>
                  </div>
                  <div className="flex items-end justify-end">
                    <h1
                      className={`p-1 text-xs ${
                        item.sender === user?.newUser?._id
                          ? "text-white"
                          : "text-third-color"
                      }`}
                    >
                      {formattedTime}
                    </h1>
                    <CheckCheck
                      size={17}
                      color={`${item.seen ? "#2ae7ff" : "#ffffff"}`}
                    />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <></>
        )}
        <div ref={showLastMessage}></div>
      </div>

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
    </div>
  );
};

export default ChatPanel;
