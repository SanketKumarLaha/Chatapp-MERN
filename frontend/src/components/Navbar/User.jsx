import React from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

const User = () => {
  const { user } = useAuthContext();

  return (
    <div className="flex justify-between items-center">
      <img
        src={
          user?.newUser?.profilePic ||
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
        }
        alt=""
        className="w-10 h-10 mr-2 object-cover object-center rounded-full"
      />
      <div className="hidden lg:block lg:w-fit">
        <h1 className="font-medium text-base">{user?.newUser?.username}</h1>
        <h1 className="text-sm text-slate-400">{user?.newUser?.email}</h1>
      </div>
    </div>
  );
};

export default User;
