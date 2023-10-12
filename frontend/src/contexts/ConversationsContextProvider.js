import { createContext, useState } from "react";

export const conversationsContext = createContext(null);

export const ConversationsContextProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);

  return (
    <conversationsContext.Provider value={{ conversations, setConversations }}>
      {children}
    </conversationsContext.Provider>
  );
};
