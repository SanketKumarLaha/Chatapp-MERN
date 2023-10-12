import { useContext } from "react";
import { usersContext } from "../contexts/UsersContextProvider";

export const useUsersContext = () => {
  const context = useContext(usersContext);
  if (!context) {
    console.error("Outside the scope of this context");
  }
  return context;
};
