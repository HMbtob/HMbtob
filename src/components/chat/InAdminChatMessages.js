import React, { useEffect, useRef } from "react";
import { InitDataContext, InitDispatchContext } from "../../App";

const InAdminChatMessages = ({ selectedMessages, user }) => {
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current.scrollIntoView({
      behavior: "smooth",
    });
  }, [selectedMessages]);

  return (
    <div
      className="flex flex-col h-xlg pb-32 overflow-y-auto
     bg-gray-200"
    >
      {selectedMessages.messages &&
        selectedMessages.messages.map(doc => (
          <div
            className={`${
              user.email === doc.data.user
                ? "self-end pr-10"
                : "self-start pl-10"
            } p-3 `}
          >
            <div
              className={`${
                user.email === doc.data.user
                  ? "bg-white text-gray-800"
                  : "bg-gray-600 text-white"
              } rounded-md p-2`}
            >
              {doc.data.message}
            </div>
            <div className="text-xs">{doc.data.user}</div>
            <div className="text-xs">
              {new Date(doc?.data?.createdAt?.toDate()).toLocaleString()}
            </div>
          </div>
        ))}
      <div ref={chatRef}></div>
    </div>
  );
};

export default InAdminChatMessages;
