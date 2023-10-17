import React, { useEffect, useRef } from "react";
import { format } from "date-fns";
import { useAuthContext } from "../../hooks/useAuthContext";
import { CheckCheck } from "lucide-react";

const Chatbox = ({ showChatMessages, setShowChatMessages }) => {
  const { user } = useAuthContext();

  const showLastMessage = useRef(null);

  // scroll to new messages 👍
  useEffect(() => {
    showLastMessage.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [showChatMessages]);

  return (
    <div className="w-full h-[calc(100%-8.5rem)] relative flex flex-col overflow-y-auto  overflow-x-hidden">
      {showChatMessages.length ? (
        showChatMessages.map((item, index) => {
          const date = new Date(item.updatedAt);
          const formattedTime = format(date, "h:mmaaa");
          return (
            <div
              key={index}
              className={`flex p-2 ${
                item.sender === user?.newUser?._id && "justify-end"
              }`}
            >
              <div
                className={`m-1 max-w-[70%] rounded-lg flex justify-between ${
                  item.sender === user?.newUser?._id
                    ? "bg-gradient-to-r from-pink-700 to-pink-600"
                    : "bg-gradient-to-r from-slate-700 to-slate-600"
                }`}
              >
                <div className="p-1 whitespace-pre-wrap break-words">
                  <h1
                    className={`text-lg px-3 ${
                      item.sender === user?.newUser?._id
                        ? "text-white"
                        : "text-third-color"
                    }`}
                  >
                    {item.message}
                  </h1>
                </div>
                <div className="flex items-end justify-end">
                  <h1
                    className={`p-1 text-xs ${
                      item.sender === user?.newUser?._id
                        ? "text-white"
                        : "text-third-color"
                    }`}
                  >
                    {formattedTime}
                  </h1>
                  <CheckCheck
                    size={17}
                    color={`${item.seen ? "#2ae7ff" : "#ffffff"}`}
                  />
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <></>
      )}
      <div ref={showLastMessage}></div>
    </div>
  );
};

export default Chatbox;
