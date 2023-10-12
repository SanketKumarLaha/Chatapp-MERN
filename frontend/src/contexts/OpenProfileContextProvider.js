import { createContext, useState } from "react";

export const openProfileContext = createContext(null);

export const OpenProfileContextProvider = ({ children }) => {
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <openProfileContext.Provider value={{ openProfile, setOpenProfile }}>
      {children}
    </openProfileContext.Provider>
  );
};
