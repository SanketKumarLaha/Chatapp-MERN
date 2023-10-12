import { createContext, useState } from "react";

export const clickedUserContext = createContext(null);

export const ClickedUserContextProvider = ({ children }) => {
  const [clickedUser, setClickedUser] = useState({});

  return (
    <clickedUserContext.Provider value={{ clickedUser, setClickedUser }}>
      {children}
    </clickedUserContext.Provider>
  );
};
