import { useContext } from "react";
import { clickedUserContext } from "../contexts/ClickedUserContextProvider";

export const useClickedUserContext = () => {
  const context = useContext(clickedUserContext);
  if (!context) {
    console.error("Outside the scope of this context");
  }
  return context;
};
