import React from "react";
import { MoreVertical } from "lucide-react";
import { useOpenSettingsContext } from "../../hooks/useOpenSettingsModalContext";
import User from "./User";
import AppName from "./AppName";
import Modals from "./Modals";

const Navbar = () => {
  const { handleClick } = useOpenSettingsContext();

  return (
    <div className="w-full h-16 flex justify-between items-center px-4 bg-primary-color border-b border-secondary-color box-border">
      <div className="flex items-center w-48">
        <AppName />
      </div>
      <div className="relative flex justify-between items-center p-1 rounded-lg bg-primary-color text-third-color">
        <User />
        <MoreVertical
          onClick={handleClick}
          className="lg:ml-10 cursor-pointer"
        />
        <Modals />
      </div>
    </div>
  );
};

export default Navbar;
