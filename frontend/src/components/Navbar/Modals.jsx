import React from "react";
import { useOpenSettingsContext } from "../../hooks/useOpenSettingsModalContext";
import { useOpenProfileContext } from "../../hooks/useOpenProfileContext";
import Profile from "./Profile";
import Logout from "./Logout";

const Modals = () => {
  const { modalRef } = useOpenSettingsContext();
  const { openProfile } = useOpenProfileContext();
  return (
    <dialog
      ref={modalRef}
      className="min-w-[300px] p-8 bg-slate-300 absolute top-0 right-0 backdrop:bg-black backdrop:opacity-60 rounded"
    >
      {openProfile ? <Profile /> : <Logout />}
    </dialog>
  );
};

export default Modals;
