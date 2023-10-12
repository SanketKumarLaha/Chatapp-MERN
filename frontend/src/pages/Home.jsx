import React from "react";
import UsersPanel from "../components/UsersPanel";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import ChatPanel from "../components/ChatPanel";

const Home = () => {
  const { user } = useAuthContext();

  if (!user) return <Navigate to="/login" replace={true} />;

  return (
    <div className="w-screen h-[calc(100vh-4rem)] flex bg-gray-500 box-border">
      <UsersPanel />
      <ChatPanel />
    </div>
  );
};

export default Home;
