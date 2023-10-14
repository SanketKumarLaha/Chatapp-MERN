import React, { useEffect, useRef, useState } from "react";
import UserCard from "./UserCard";
import { useAuthContext } from "../hooks/useAuthContext";
import { useUsersContext } from "../hooks/useUsersContext";
import { Contact2, X } from "lucide-react";
import { useClickedUserContext } from "../hooks/useClickedUserContext";
import { useConversationsContext } from "../hooks/useConversationsContext";
import { redirect } from "react-router-dom";

const UsersPanel = () => {
  const { users } = useUsersContext();
  const { user, dispatch } = useAuthContext();
  const { clickedUser } = useClickedUserContext();
  const clickedUserLength = Object.keys(clickedUser).length;

  const [searchUser, setSearchUser] = useState("");
  const showUsersDialog = useRef(null);

  const userId = user?.newUser._id;

  const { conversations, setConversations } = useConversationsContext();
  const [otherUsers, setOtherUsers] = useState([]);
  const [filteredOtherUsers, setFilteredOtherUsers] = useState([]);

  console.log({ conversations });

  // filtering Conversations 👍
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

    console.log("fetching all convos of the user");
    fetchConversations();
  }, [userId, setConversations, users, dispatch, user.token]);

  // all users except yourself 👍
  const handleAllUsers = async () => {
    showUsersDialog.current.showModal();

    const response = await fetch(
      process.env.REACT_APP_BACKEND_URL + "/api/users/allUsers",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();
    if (response.status === 200) {
      setOtherUsers(json);
      setFilteredOtherUsers(json);
    } else {
      alert("Your token has been expired, login again");
      dispatch({ type: "LOGOUT" });
      localStorage.removeItem("user");
      return redirect("/login");
    }
  };

  // close allusers modal 👍
  const handleCancel = () => {
    showUsersDialog.current.close();
  };

  // open allusers modal 👍
  const handleUserClick = (item) => {
    let exists = false;

    conversations.forEach((convo) => {
      if (convo.participants.some((user) => user === item._id)) exists = true;
    });

    const mockConvo = {
      _id: -1,
      participants: [item._id, userId],
      lastMessage: {
        seen: false,
        sender: userId,
        text: "",
      },
      createdAt: null,
    };

    if (!exists) setConversations((prev) => [...prev, mockConvo]);

    showUsersDialog.current.close();
  };

  useEffect(() => {
    console.log({ searchUser });
    if (searchUser.length) {
      setOtherUsers((prev) =>
        prev.filter((item) => item.username.toLowerCase().includes(searchUser))
      );
    } else {
      setOtherUsers(filteredOtherUsers);
    }
  }, [searchUser, filteredOtherUsers]);

  if (!conversations) return;

  return (
    <div
      className={`${
        clickedUserLength ? "w-0" : "w-full"
      } lg:w-1/4 h-full relative overflow-hidden box-border bg-green-500 border-r-2 border-secondary-color`}
    >
      <div
        className="bg-gradient-to-r from-purple-300 to-red-400 p-3 absolute bottom-5 right-5 rounded-lg cursor-pointer"
        onClick={handleAllUsers}
      >
        <Contact2 size={30} />
      </div>
      <dialog
        ref={showUsersDialog}
        className="min-w-[200px] w-[300px] h-1/2 overflow-hidden p-2 bg-slate-300 absolute top-0 right-0 backdrop:bg-black backdrop:opacity-60 rounded"
      >
        <h1
          onClick={handleCancel}
          className="cursor-pointer absolute top-1 right-1 rounded"
        >
          <X />
        </h1>
        <div className="mt-6 mb-2 w-full h-10 flex justify-center">
          <input
            type="text"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="w-[80%] p-5 rounded outline-none"
          />
        </div>
        <div className="w-full h-[calc(100%-5rem)] p-2 flex flex-col overflow-auto overflow-x-hidden ">
          {otherUsers.map((item) => (
            <div
              key={item._id}
              onClick={() => handleUserClick(item)}
              className="flex mb-2 p-1 cursor-pointer bg-slate-500 hover:bg-slate-300"
            >
              <div
                className="bg-[image:var(--display-pic)] bg-cover w-12 h-12 ml-1 rounded-full"
                style={{
                  "--display-pic": `url(
                '${
                  item?.profilePic
                    ? item?.profilePic
                    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                }')`,
                }}
              />
              <div
                key={item._id}
                className="flex justify-center flex-col ml-4 w-2/3 break-words"
              >
                <h1 className="text-lg font-semibold">{item.username}</h1>
              </div>
            </div>
          ))}
        </div>
      </dialog>
      {/* <div className="h-14  bg-primary-color p-2">
        <input
          type="text"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          placeholder="Search..."
          className="w-full h-full p-5 rounded-lg outline-none border border-secondary-color bg-primary-color text-third-color"
        />
      </div> */}
      <div className="w-full h-full overflow-auto bg-primary-color">
        {conversations &&
          conversations.map((conversation, index) => {
            return (
              <UserCard key={conversation._id} conversation={conversation} />
            );
          })}
      </div>
    </div>
  );
};

export default UsersPanel;
