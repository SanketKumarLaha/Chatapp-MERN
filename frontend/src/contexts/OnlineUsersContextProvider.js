import { createContext, useState } from "react";

export const onlineUsersContext = createContext(null);

export const OnlineUsersContextProvider = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  return (
    <onlineUsersContext.Provider value={{ onlineUsers, setOnlineUsers }}>
      {children}
    </onlineUsersContext.Provider>
  );
};
