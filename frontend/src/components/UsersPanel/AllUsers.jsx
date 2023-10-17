import React, { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { redirect } from "react-router-dom";
import { useConversationsContext } from "../../hooks/useConversationsContext";
import { Contact2, X } from "lucide-react";

const AllUsers = () => {
  const { user, dispatch } = useAuthContext();
  const { conversations, setConversations } = useConversationsContext();

  const [otherUsers, setOtherUsers] = useState([]);
  const [filteredOtherUsers, setFilteredOtherUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");

  const showUsersDialog = useRef(null);

  useEffect(() => {
    if (searchUser.length) {
      setOtherUsers((prev) =>
        prev.filter((item) =>
          item.username.toLowerCase().includes(searchUser.toLowerCase())
        )
      );
    } else {
      setOtherUsers(filteredOtherUsers);
    }
  }, [searchUser, filteredOtherUsers]);

  // all users except yourself
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

  // close allusers modal
  const handleCancel = () => {
    showUsersDialog.current.close();
    setSearchUser("");
  };

  // open allusers modal
  const handleUserClick = (item) => {
    let exists = false;

    conversations.forEach((convo) => {
      if (convo.participants.some((user) => user === item._id)) exists = true;
    });

    const mockConvo = {
      _id: -1,
      participants: [item._id, user?.newUser._id],
      lastMessage: {
        seen: false,
        sender: user?.newUser._id,
        text: "",
      },
      createdAt: null,
    };

    if (!exists) setConversations((prev) => [...prev, mockConvo]);
    showUsersDialog.current.close();
  };

  return (
    <>
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
    </>
  );
};

export default AllUsers;
