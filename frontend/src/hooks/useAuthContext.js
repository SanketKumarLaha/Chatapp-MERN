import { useContext } from "react";
import { authContext } from "../contexts/AuthContextProvider";

export const useAuthContext = () => {
  const context = useContext(authContext);
  if (!context) {
    console.error("Outside the scope of this context");
  }
  return context;
};
