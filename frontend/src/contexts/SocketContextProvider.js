import { createContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuthContext } from "../hooks/useAuthContext";

export const socketContext = createContext(null);

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState();
  const { user } = useAuthContext();

  useEffect(() => {
    const socket = io(process.env.REACT_APP_BACKEND_URL, {
      query: {
        userId: user?.newUser._id,
      },
    });

    setSocket(socket);

    return () => socket && socket.close();
  }, [user?.newUser._id]);

  return (
    <socketContext.Provider value={{ socket }}>
      {children}
    </socketContext.Provider>
  );
};
