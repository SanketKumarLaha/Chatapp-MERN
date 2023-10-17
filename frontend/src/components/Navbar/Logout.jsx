import React, { useState } from "react";
import { useOpenSettingsContext } from "../../hooks/useOpenSettingsModalContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useOpenProfileContext } from "../../hooks/useOpenProfileContext";
import { X } from "lucide-react";

const Logout = () => {
  const { handleCancel } = useOpenSettingsContext();
  const { dispatch } = useAuthContext();
  const { setOpenProfile } = useOpenProfileContext();

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
    <form onSubmit={handleLogout}>
      <h1
        onClick={handleCancel}
        className="cursor-pointer absolute top-1 right-1 rounded"
      >
        <X />
      </h1>
      <button
        type="button"
        onClick={handleProfile}
        className="w-full mt-5 my-2 p-2 rounded text-white bg-black flex items-center justify-center cursor-pointer"
      >
        Profile
      </button>
      <button type="submit" className="w-full pt-2 bg-red-500 p-2 rounded">
        {loading ? "Logging out..." : "Log out"}
      </button>
    </form>
  );
};

export default Logout;
