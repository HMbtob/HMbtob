import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { InitDataContext, InitDispatchContext } from "../../App";
import { db } from "../../firebase";
import SendIcon from "@material-ui/icons/Send";

const InAdminChat = () => {
  const chatRef = useRef(null);

  const state = useContext(InitDataContext);
  const dispatch = useContext(InitDispatchContext);
  const { rooms, user, accounts } = state;
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRoom, setSelectedRoom] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);

  // const filteredAccounts = accounts.filter(
  //   us => us.data.inCharge === user.inCharge
  // );
  console.log("filteredAccounts", filteredAccounts);
  console.log("filteredRooms", filteredRooms);
  console.log("selectedRoom", selectedRoom.id);
  console.log("selectedUser", selectedUser);
  console.log("selectedMessages", selectedMessages);
  useEffect(() => {
    setFilteredAccounts(
      accounts.filter(us => us.data.inCharge === user.inCharge)
    );
    setFilteredRooms(
      rooms.filter(room =>
        filteredAccounts.map(ac => ac.data.email).includes(room.data.userName)
      )
    );
    setSelectedRoom(
      selectedUser.length > 0
        ? rooms.find(room => room.data.userName === selectedUser)
        : []
    );
    db.collection("rooms")
      .doc(selectedRoom.id)
      .collection("messages")
      .orderBy("createdAt", "asc")
      .onSnapshot(snapshot =>
        setSelectedMessages({
          messages: snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
          })),
        })
      );
    chatRef.current.scroll({
      behavior: "smooth",
    });
  }, [accounts, user, selectedUser, rooms, selectedRoom]);
  return (
    <div className="flex flex-row w-full h-xlg">
      <div className="w-1/5 border-r">
        {filteredRooms &&
          filteredRooms.map(room => (
            <div onClick={() => setSelectedUser(room.data.userName)}>
              {room.data.userName}
            </div>
          ))}
      </div>
      <div className="flex-auto bg-pink-300">
        <div className="bg-purple-400 flex flex-col h-xlg pb-32 overflow-y-auto">
          {console.log(selectedMessages.messages)}
          {selectedMessages.messages &&
            selectedMessages.messages.map(doc => (
              <div
                className={`${
                  user.email === doc.data.user ? "self-end" : "self-start"
                } p-3 `}
              >
                <div className="bg-white rounded-md p-2">
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
        <div className=" bottom-8 absolute w-8/12 h-12">
          <div
            className="flex flex-row items-center justify-between w-full h-full
           border bg-white
          "
          >
            <input
              type="text"
              className="p-1 w-5/6 pl-3 outline-none"
              placeholder="Send a Message"
            />
            <button>
              <SendIcon style={{ color: "gray", marginRight: "10px" }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InAdminChat;
