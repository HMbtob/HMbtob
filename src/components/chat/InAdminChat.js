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
import InAdminChatMessages from "./InAdminChatMessages";

const InAdminChat = () => {
  const state = useContext(InitDataContext);
  const dispatch = useContext(InitDispatchContext);
  const { rooms, user, accounts } = state;
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedMessages, setSelectedMessages] = useState([]);

  // 확인 안한 메시지
  const [unReaded, setUnReaded] = useState([]);

  const [message, setMessage] = useState("");
  const handleMessage = e => {
    setMessage(e.target.value);
  };
  const sendMessage = e => {
    e.preventDefault();
    db.collection("rooms").doc(selectedRoom.id).collection("messages").add({
      createdAt: new Date(),
      message: message,
      user: user.email,
      readed: false,
    });
    setMessage("");
  };

  useEffect(() => {
    db.collectionGroup("messages")
      .where(`to`, "==", `${user.email}`)
      .onSnapshot(snapshot =>
        setUnReaded({
          messages: snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
          })),
        })
      );
  }, [user.email]);

  useEffect(() => {
    setFilteredAccounts(accounts.filter(us => us.data.inCharge === user.email));
  }, [accounts]);

  useEffect(() => {
    setFilteredRooms(
      rooms.filter(room =>
        filteredAccounts.map(ac => ac.data.email).includes(room.data.userName)
      )
    );
  }, [rooms, filteredAccounts]);

  useEffect(() => {
    setSelectedRoom(
      selectedUser.length > 0
        ? rooms.find(room => room.data.userName === selectedUser)
        : []
    );
  }, [selectedUser]);

  const selectMessage = async () => {
    // await db
    //   .collection("rooms")
    //   .doc(selectedRoom.id)
    //   .collection("messages")
    //   .orderBy("createdAt", "asc")
    //   .get(snapshot =>
    //     setSelectedMessages({
    //       messages: snapshot.docs.map(doc => ({
    //         id: doc.id,
    //         data: doc.data(),
    //       })),
    //     })
    //   );
    const mesRef = db
      .collection("rooms")
      .doc(selectedRoom.id)
      .collection("messages");
    const snapshot = await mesRef.orderBy("createdAt", "asc").get();
    setSelectedMessages({
      messages: snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data(),
      })),
    });

    if (unReaded.messages) {
      await unReaded.messages
        .filter(
          mes => mes.data.user === selectedUser && mes.data.readed === false
        )
        .map(unre =>
          db
            .collection("rooms")
            .doc(selectedRoom.id)
            .collection("messages")
            .doc(unre.id)
            .update({
              readed: true,
            })
        );
    }
  };
  useEffect(() => {
    selectMessage();
  }, [selectedRoom]);

  return (
    <div className="flex flex-row w-full h-xlg pt-12">
      <div className="w-1/5">
        {filteredRooms &&
          filteredRooms.map((room, i) => (
            <div
              key={i}
              className={`${
                room.data.userName === selectedUser ? "bg-gray-300" : ""
              } p-3 py-4 cursor-pointer border-b`}
              onClick={() => setSelectedUser(room.data.userName)}
            >
              <div className=" text-md flex flex-row items-center">
                <div>
                  {accounts.find(ac => ac.data.email === room.data.userName)
                    .data.nickName
                    ? accounts.find(ac => ac.data.email === room.data.userName)
                        .data.nickName
                    : "닉네임을 설정해주세요"}
                </div>

                {unReaded.messages &&
                  unReaded.messages.filter(
                    mes =>
                      mes.data.user === room.data.userName &&
                      mes.data.readed === false
                  ).length > 0 && (
                    <div className="bg-gray-600 text-white p-1 rounded-2xl text-xs ml-2">
                      {
                        unReaded.messages.filter(
                          mes =>
                            mes.data.user === room.data.userName &&
                            mes.data.readed === false
                        ).length
                      }{" "}
                    </div>
                  )}
              </div>
              <div className="text-xs">{room.data.userName}</div>
            </div>
          ))}
      </div>
      <div className="flex-auto">
        <InAdminChatMessages selectedMessages={selectedMessages} user={user} />

        <div className="bottom-8 absolute w-8/12 h-12">
          <form
            onSubmit={sendMessage}
            className="flex flex-row items-center justify-between w-full h-full
           border bg-white ml-5"
          >
            <input
              type="text"
              className="p-1 w-5/6 pl-3 outline-none"
              placeholder="Send a Message"
              onChange={handleMessage}
              value={message}
            />
            <button type="submit">
              <SendIcon style={{ color: "gray", marginRight: "10px" }} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InAdminChat;
