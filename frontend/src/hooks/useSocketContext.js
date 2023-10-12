import { useContext } from "react";
import { socketContext } from "../contexts/SocketContextProvider";

export const useSocketContext = () => {
  const context = useContext(socketContext);
  if (!context) {
    console.error("Outside the scope of this context");
  }
  return context;
};
