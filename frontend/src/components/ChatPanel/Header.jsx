import React, { useEffect, useState } from "react";
import { useClickedUserContext } from "../../hooks/useClickedUserContext";
import { ArrowLeft } from "lucide-react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useOnlineUsersContext } from "../../hooks/useOnlineUsersContext";

const Header = () => {
  const { user, dispatch } = useAuthContext();
  const { clickedUser, setClickedUser } = useClickedUserContext();

  const [clickedUserDetails, setClickedUserDetails] = useState("");

  const clickedUserId = clickedUser;

  const { onlineUsers } = useOnlineUsersContext();

  // fetch clickedUser details
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

  // when clicked back setting the clickedUser context state to empty
  const goBack = () => {
    setClickedUser("");
  };
  return (
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
        <div className="pl-3 flex flex-col justify-center">
          <h1 className="font-semibold text-lg">
            {clickedUserDetails?.username}
          </h1>
          <h1 className="text-xs">
            {onlineUsers.includes(clickedUserDetails?._id) ? "online" : ""}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Header;
