import { auth } from "../../../firebase";
import SimpleListRow from "./SimpleListRow";
import Modal from "../../modal/Modal";
import React, { useState } from "react";
import { useHistory } from "react-router";
import InSimpleList from "../../chat/InSimpleList";
const SimpleList = ({ simpleList, confirmChecked, B2bMakeOrder, state }) => {
  const { user } = state;
  const [modalOpen, setModalOpen] = useState(false);
  const history = useHistory();

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="m-auto h-3/4 w-11/12 mt-12 flex flex-col text-center text-sm font-bold text-gray-800">
      CART LIST
      <div
        className="grid grid-cols-6 place-items-center text-center text-xs bg-gray-800 p-1 
        text-gray-200"
      >
        <div className="col-span-3">TITLE</div>
        <div className="col-span-1">QUAN</div>
        <div className="col-span-1">PRICE</div>
        <div className="col-span-1">TOTAL</div>
      </div>
      <div className="h-2/3 mb-10 overflow-y-auto">
        {simpleList.map(doc => (
          <SimpleListRow
            key={doc.title}
            title={doc.title}
            quan={doc.quan}
            price={doc.price}
            totalPrice={doc.totalPrice}
          />
        ))}
        {/* 버튼들 */}
        <div className="w-full flex flex-col justify-evenly mt-10">
          <div className="w- full flex flex-row justify-evenly">
            {user && (
              <>
                <div>MY CREDIT : </div>
                <div>₩ {Math.round(user.credit).toLocaleString("ko-KR")}</div>
              </>
            )}
          </div>

          <div className="flex justify-evenly mt-2">
            <button
              disabled={!confirmChecked}
              onClick={B2bMakeOrder}
              className={`${
                confirmChecked
                  ? "cursor-pointer bg-gray-800 px-3 py-1 rounded-sm text-gray-100 font-semibold mb-2"
                  : "cursor-pointer bg-gray-200 px-3 py-1 rounded-sm text-gray-300 font-semibold mb-2"
              }`}
            >
              ORDER
            </button>
            <button
              onClick={() => history.push("/myorderlist")}
              className="cursor-pointer bg-gray-800 px-3 
          py-1 rounded-sm text-gray-100 font-semibold
          mb-2"
            >
              My orders
            </button>
            <button
              onClick={() => history.push(`/myinfo/${user.uid}`)}
              className="cursor-pointer bg-gray-800 px-3 
          py-1 rounded-sm text-gray-100 font-semibold
          mb-2"
            >
              My info
            </button>
            <button
              onClick={openModal}
              className="cursor-pointer bg-gray-800 px-3 
          py-1 rounded-sm text-gray-100 font-semibold
          mb-2"
            >
              Contact
            </button>
            <Modal open={modalOpen} close={closeModal} header={"문의하기"}>
              <InSimpleList />
            </Modal>
            <button
              onClick={() => auth.signOut()}
              className="cursor-pointer bg-gray-800 px-3 
          py-1 rounded-sm text-gray-100 font-semibold
          mb-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleList;