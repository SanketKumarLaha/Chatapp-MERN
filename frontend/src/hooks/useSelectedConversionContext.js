import { useContext } from "react";
import { selectedConversionContext } from "../contexts/SelectedConversionContextProvider";

export const useSelectedConversionContextProvider = () => {
  const context = useContext(selectedConversionContext);
  if (!context) {
    console.error("Outside the scope of this context");
  }
  return context;
};
