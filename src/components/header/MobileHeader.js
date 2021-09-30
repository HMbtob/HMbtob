import React, { useState, useEffect, useContext } from "react";
import { InitDataContext, InitDispatchContext } from "../../App";
import { useHistory } from "react-router";
import { auth, db } from "../../firebase";
import DehazeIcon from "@material-ui/icons/Dehaze";
import ChatIcon from "@material-ui/icons/Chat";
import NotificationsIcon from "@material-ui/icons/Notifications";
import InSimpleList from "../chat/InSimpleList";
import Modal from "../modal/Modal";

const MobileHeader = () => {
  const history = useHistory();
  const state = useContext(InitDataContext);
  const { user, rooms } = state;
  // message
  const [selectedRoom, setSelectedRoom] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const refresh = async () => {
    await db
      .collection("rooms")
      .doc(selectedRoom?.id)
      .collection("messages")
      .orderBy("createdAt", "desc")
      .onSnapshot(snapshot =>
        setSelectedMessages({
          messages: snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
          })),
        })
      );
  };

  const [toggleMenu, setToggleMenu] = useState(false);

  const onMenuClick = () => {
    setToggleMenu(!toggleMenu);
  };

  const navMenues = [
    { "My Info": `/myinfo/${user?.uid}` },
    { "My Orders": `/myorderlist` },
    { "Special Order": `/b2bspecialorder` },
  ];

  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    setSelectedRoom(
      user?.email ? rooms?.find(room => room.data.userName === user?.email) : []
    );
  }, [user, rooms]);

  useEffect(() => {
    refresh();
  }, [selectedRoom]);

  return (
    <div className="flex flex-col">
      <div
        className=" bg-blue-900 w-screen p-2 absolute top-0 z-30 
      flex flex-row justify-between"
      >
        <div className="flex flex-row items-center">
          <DehazeIcon style={{ color: "white" }} onClick={onMenuClick} />
          <div
            className="text-gray-200 font-semibold text-left
           mr-10 cursor-pointer w-20 ml-3"
            onClick={() => history.replace("/b2bshop")}
          >
            INTERASIA
          </div>
        </div>
        <div className="flex flex-row items-center">
          {/* <NotificationsIcon
            style={{ color: "white" }}
            className="mr-3"
            // onClick={openModal}
          /> */}
          <ChatIcon
            style={{ color: "white" }}
            className="mr-3"
            onClick={openModal}
          />
          <Modal open={modalOpen} close={closeModal} header={"Message"}>
            <InSimpleList
              user={user}
              selectedMessages={selectedMessages}
              selectedRoom={selectedRoom}
              refresh={refresh}
            />
          </Modal>
        </div>
      </div>
      {toggleMenu && (
        <div className="border-b mt-10 absolute w-full z-10">
          {navMenues.map((menu, i) => (
            <div
              key={i}
              onClick={() => history.push(`${Object.values(menu)}`)}
              className="border-b bg-blue-600 text-gray-200
           p-2 text-lg font-semibold"
            >
              {Object.keys(menu)}
            </div>
          ))}
          <div
            className="border-b bg-blue-600 text-gray-200
           p-2 text-lg font-semibold"
            onClick={async () => {
              await auth.signOut();
              await history.replace("/");
            }}
          >
            Log Out
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileHeader;
