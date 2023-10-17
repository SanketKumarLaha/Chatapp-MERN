import React, { useEffect, useState } from "react";
import { useClickedUserContext } from "../../hooks/useClickedUserContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useSelectedConversionContextProvider } from "../../hooks/useSelectedConversionContext";
import { format, formatDistance, subDays } from "date-fns";
import { redirect } from "react-router-dom";

const UserCard = ({ conversation }) => {
  const { setClickedUser } = useClickedUserContext();
  const { setSelectedConversion } = useSelectedConversionContextProvider();
  const [userDetails, setUserDetails] = useState(null);
  const { user, dispatch } = useAuthContext();
  const userId = user?.newUser._id;

  const { participants, lastMessage, updatedAt } = conversation;

  const messageTime = () => {
    if (!updatedAt) return;
    // const timeText = formatDistance(new Date(updatedAt), new Date(), {
    //   addSuffix: true,
    // });
    const currentDate = new Date(updatedAt);
    const formattedTime = format(currentDate, "h:mmaaa");
    return formattedTime;
  };
  const messageDate = () => {
    if (!updatedAt) return;

    const currentDate = new Date(updatedAt);
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const entireDate = `${day}-${month}-${year}`;
    return entireDate;
  };

  const [otherUserId, setOtherUserId] = useState("");

  useEffect(() => {
    const filteredConversations = participants.filter(
      (item) => item !== userId
    );
    setOtherUserId(filteredConversations.flat()[0]);
    const fetchAllOtherUsers = async () => {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/api/users/getUser",
        {
          method: "POST",
          body: JSON.stringify({ userId: filteredConversations.flat()[0] }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const json = await response.json();
      if (response.status === 200) {
        setUserDetails(json);
      } else {
        alert("Your token has been expired, login again");
        dispatch({ type: "LOGOUT" });
        localStorage.removeItem("user");
        return redirect("/login");
      }
    };
    fetchAllOtherUsers();
  }, [participants, userId, dispatch, user.token]);

  const handleClick = () => {
    console.log({ userDetails });
    setClickedUser(otherUserId);
    setSelectedConversion(conversation);
    console.log({ conversation });
  };

  return (
    <div
      onClick={handleClick}
      className="h-20 bg-primary-color border-b border-slate-700 hover:bg-slate-800 cursor-pointer text-third-color"
    >
      <div className="flex items-center px-5 h-full rounded-fullr ">
        <div className="w-9/12 flex">
          <div
            className="bg-[image:var(--display-pic)] bg-cover w-12 h-12 rounded-full"
            style={{
              "--display-pic": `url('${
                userDetails?.profilePic
                  ? userDetails?.profilePic
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
              }')`,
            }}
          />
          <div className="flex w-2/3 justify-between flex-col ml-4 truncate">
            <h1 className="text-lg font-semibold">{userDetails?.username}</h1>
            <h1 className="text-xs ">{lastMessage.text}</h1>
          </div>
        </div>
        <div className="w-3/12">
          <div className="py-1 flex flex-col items-center justify-between">
            <h1 className="text-xs text-slate-400 mb-1">{messageDate()}</h1>
            <h1 className="text-xs text-slate-400">{messageTime()}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
