import { useContext } from "react";
import { openProfileContext } from "../contexts/OpenProfileContextProvider";

export const useOpenProfileContext = () => {
  const context = useContext(openProfileContext);
  if (!context) {
    console.error("Outside the scope of this context");
  }
  return context;
};
