import { useContext } from "react";
import { conversationsContext } from "../contexts/ConversationsContextProvider";

export const useConversationsContext = () => {
  const context = useContext(conversationsContext);
  if (!context) {
    console.error("Outside the scope of this context");
  }
  return context;
};
