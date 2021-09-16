import React from "react";

const InAdminChatMessages = ({ selectedMessages, user }) => {
  return (
    <div
      className="flex flex-col pb-32 rounded-md h-4/6
     bg-gray-300 overflow-y-scroll scrollbar-hide"
    >
      {selectedMessages.messages &&
        selectedMessages.messages.map((doc, i) => (
          <div
            key={i}
            className={`${
              user.email === doc.data.user
                ? "self-end pr-10"
                : "self-start pl-10"
            } p-3`}
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
    </div>
  );
};

export default InAdminChatMessages;
