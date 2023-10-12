import { useContext } from "react";
import { openSettingsModalContext } from "../contexts/OpenSettingsModalContextProvider";

export const useOpenSettingsContext = () => {
  const context = useContext(openSettingsModalContext);
  if (!context) {
    console.error("Outside the scope of this context");
  }
  return context; 
};
