import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./contexts/AuthContextProvider";
import { UsersContextProvider } from "./contexts/UsersContextProvider";
import { ClickedUserContextProvider } from "./contexts/ClickedUserContextProvider";
import { OpenSettingsModalContextProvider } from "./contexts/OpenSettingsModalContextProvider";
import { OpenProfileContextProvider } from "./contexts/OpenProfileContextProvider";
import { SocketContextProvider } from "./contexts/SocketContextProvider";
import { ConversationsContextProvider } from "./contexts/ConversationsContextProvider";
import { SelectedConversionContextProvider } from "./contexts/SelectedConversionContextProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <UsersContextProvider>
      <ClickedUserContextProvider>
        <OpenProfileContextProvider>
          <OpenSettingsModalContextProvider>
            <SocketContextProvider>
              <ConversationsContextProvider>
                <SelectedConversionContextProvider>
                  <App />
                </SelectedConversionContextProvider>
              </ConversationsContextProvider>
            </SocketContextProvider>
          </OpenSettingsModalContextProvider>
        </OpenProfileContextProvider>
      </ClickedUserContextProvider>
    </UsersContextProvider>
  </AuthContextProvider>
);
