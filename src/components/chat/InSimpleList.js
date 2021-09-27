import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import InSimpleListChatMessages from "./InSimpleListChatMessages";
import SendIcon from "@material-ui/icons/Send";
import RestoreIcon from "@material-ui/icons/Restore";

const InSimpleList = ({ user, selectedMessages, selectedRoom, refresh }) => {
  const [message, setMessage] = useState("");
  const handleMessage = e => {
    setMessage(e.target.value);
  };
  const sendMessage = () => {
    db.collection("rooms").doc(selectedRoom.id).collection("messages").add({
      createdAt: new Date(),
      message: message,
      user: user.email,
      readed: false,
      to: user.inCharge,
    });
    setMessage("");
  };

  function onKeyDown(keyEvent) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
      sendMessage();
    }
  }
  return (
    <>
      <div className="top-0 h-12 w-3/4 ml-32 mb-5 sticky">
        {/* <div className="flex flex-row"> */}
        <div
          className="flex flex-row items-center justify-between w-full h-full
            border bg-white ml-8"
        >
          <input
            type="text"
            className="p-1 w-5/6 pl-3 outline-none"
            placeholder="Send a Message"
            onChange={handleMessage}
            value={message}
            onKeyDown={onKeyDown}
          />
          <button onClick={sendMessage}>
            <SendIcon style={{ color: "gray" }} />
          </button>
          <button onClick={refresh} className=" mr-3">
            <RestoreIcon style={{ color: "gray" }} />
          </button>
        </div>
        {/* </div> */}
      </div>
      <InSimpleListChatMessages
        selectedMessages={selectedMessages}
        user={user}
      />
    </>
  );
};

export default InSimpleList;
