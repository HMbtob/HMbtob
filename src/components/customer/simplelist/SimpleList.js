import React, { useState } from "react";
import { auth } from "../../../firebase";
import SimpleListRow from "./SimpleListRow";
import Modal from "../../modal/Modal";
// import CustomerChat from "../../chat/CustomerChat";

const SimpleList = ({
  confirmChecked,
  makeBtobOrder,
  userData,
  inputs,
  product,
  form,
}) => {
  console.log(form);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  const truncate = (string, n) => {
    return string?.length > n ? string.substr(0, n - 1) + " . . ." : string;
  };

  let list = [];
  if (inputs && product) {
    // 반목문에서 인덱스로 사용
    for (let key in inputs) {
      if (inputs[key]) {
        list.push({
          title: truncate(key, 50),
          quan: Number(inputs[key]),
          price:
            Number(product.filter(x => x.data.title === key)[0].data.price) ||
            0,
          totalPrice:
            Number(product.filter(x => x.data.title === key)[0].data.price) *
              Number(inputs[key]) || 0,
        });
      }
    }
  }

  return (
    <div className=" h-2/3 w-1/5 mt-32 flex flex-col text-center text-sm font-bold text-gray-800">
      CHECKED LIST
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
        {list.map(doc => (
          <SimpleListRow
            key={doc.title}
            title={doc.title}
            quan={doc.quan}
            price={doc.price}
            totalPrice={doc.totalPrice}
          />
        ))}
        {/* 버튼들 */}
        <div className="w-full flex justify-evenly mt-10">
          {userData && (
            <button
              disabled={!confirmChecked}
              onClick={makeBtobOrder}
              className={`${
                confirmChecked
                  ? "cursor-pointer bg-gray-800 px-3 py-1 rounded-sm text-gray-100 font-semibold mb-2"
                  : "cursor-pointer bg-gray-200 px-3 py-1 rounded-sm text-gray-300 font-semibold mb-2"
              }`}
            >
              주문하기
            </button>
          )}

          <button
            className="cursor-pointer bg-gray-800 px-3 
          py-1 rounded-sm text-gray-100 font-semibold
          mb-2"
          >
            내주문
          </button>

          <button
            onClick={openModal}
            className="cursor-pointer bg-gray-800 px-3 
          py-1 rounded-sm text-gray-100 font-semibold
          mb-2"
          >
            문의하기
          </button>
          <Modal open={modalOpen} close={closeModal} header={"헤더"}>
            {/* <CustomerChat userData={userData} />{" "} */}
          </Modal>
          <button
            onClick={() => auth.signOut()}
            className="cursor-pointer bg-gray-800 px-3 
          py-1 rounded-sm text-gray-100 font-semibold
          mb-2"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleList;
