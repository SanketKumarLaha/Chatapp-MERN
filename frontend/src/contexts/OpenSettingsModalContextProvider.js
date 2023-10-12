import { createContext, useRef } from "react";
import { useOpenProfileContext } from "../hooks/useOpenProfileContext";

export const openSettingsModalContext = createContext(null);

export const OpenSettingsModalContextProvider = ({ children }) => {
  const modalRef = useRef(null);
  const { setOpenProfile } = useOpenProfileContext();

  const handleClick = () => {
    modalRef.current.showModal();
  };

  const handleCancel = () => {
    modalRef.current.close();
    setOpenProfile(false);
  };

  return (
    <openSettingsModalContext.Provider
      value={{ modalRef, handleClick, handleCancel }}
    >
      {children}
    </openSettingsModalContext.Provider>
  );
};
