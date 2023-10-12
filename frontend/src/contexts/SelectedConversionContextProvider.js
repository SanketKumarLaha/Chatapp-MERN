import { createContext, useState } from "react";

export const selectedConversionContext = createContext(null);

export const SelectedConversionContextProvider = ({ children }) => {
  const [selectedConversion, setSelectedConversion] = useState({});

  return (
    <selectedConversionContext.Provider
      value={{ selectedConversion, setSelectedConversion }}
    >
      {children}
    </selectedConversionContext.Provider>
  );
};
