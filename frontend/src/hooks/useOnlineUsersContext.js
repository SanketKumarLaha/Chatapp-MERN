import { useContext } from "react";
import { onlineUsersContext } from "../contexts/OnlineUsersContextProvider";

export const useOnlineUsersContext = () => {
  const context = useContext(onlineUsersContext);
  if (!context) {
    console.error("Outside the scope of this context");
  }
  return context;
};
