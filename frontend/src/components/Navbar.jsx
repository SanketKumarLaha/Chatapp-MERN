import React, { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { MoreVertical, PawPrint, X } from "lucide-react";
import Profile from "./Profile";
import { useOpenSettingsContext } from "../hooks/useOpenSettingsModalContext";
import { useOpenProfileContext } from "../hooks/useOpenProfileContext";

const Navbar = () => {
  const { user, dispatch } = useAuthContext();
  const { modalRef, handleClick, handleCancel } = useOpenSettingsContext();
  const { openProfile, setOpenProfile } = useOpenProfileContext();

  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
    setLoading(false);
  };

  const handleProfile = () => {
    setOpenProfile(true);
  };

  return (
    <div className="w-full h-16 flex justify-between items-center px-4 bg-primary-color border-b border-secondary-color box-border">
      <div className="flex items-center w-48">
        <h1 className="font-sans text-3xl font-semibold text-third-color tracking-wider">
          CatComms
        </h1>
        <div className="text-third-color ml-2">
          <PawPrint />
        </div>
      </div>

      <div className="relative flex justify-between items-center p-1 rounded-lg bg-primary-color text-third-color">
        <div className="flex justify-between items-center">
          <div
            className="bg-[image:var(--display-pic)] bg-cover w-10 h-10 mr-2 rounded-full"
            style={{
              "--display-pic": `url('${
                user?.newUser?.profilePic !== ""
                  ? user?.newUser?.profilePic
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
              }'
              )`,
            }}
          />
          <div className="hidden lg:block lg:w-fit">
            <h1 className="font-medium text-base">{user?.newUser?.username}</h1>
            <h1 className="text-sm text-slate-400">{user?.newUser?.email}</h1>
          </div>
        </div>
        <div onClick={handleClick} className="lg:ml-10 cursor-pointer">
          <MoreVertical />
        </div>
        <dialog
          ref={modalRef}
          className="min-w-[300px] p-8 bg-slate-300 absolute top-0 right-0 backdrop:bg-black backdrop:opacity-60 rounded"
        >
          {openProfile ? (
            <Profile />
          ) : (
            <form action="" onSubmit={handleLogout} className="">
              <h1
                onClick={handleCancel}
                className="cursor-pointer absolute top-1 right-1 rounded"
              >
                <X />
              </h1>
              <div
                onClick={handleProfile}
                className="w-full mt-5 p-2 rounded text-white bg-black flex items-center justify-center cursor-pointer"
              >
                Profile
              </div>
              <div className="w-full pt-2">
                <button type="submit" className="bg-red-500 p-2 rounded w-full">
                  {loading ? "Logging out..." : "Log out"}
                </button>
              </div>
            </form>
          )}
        </dialog>
      </div>
    </div>
  );
};

export default Navbar;
