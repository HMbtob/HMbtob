import React, { useContext, useState } from "react";
import useInputs from "../../../hooks/useInput";
import { InitDataContext } from "../../../App";
import { db } from "../../../firebase";
import CreditDetails from "../../admin/customer/CreditDetails";
import Modal from "../../modal/Modal";

const MyInfo = ({ match }) => {
  const { uid } = match.params;
  const state = useContext(InitDataContext);
  const { accounts } = state;
  const user = accounts.find(account => account.data.uid === uid);
  const inCharges = accounts.filter(account => account.data.type === "admin");
  const { creditDetails } = user.data;
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  console.log(user);
  const [form, onChange] = useInputs({
    recipientEmail: user.data.recipientEmail,
    recipientPhoneNumber: user.data.recipientPhoneNumber,
    address1: user.data.address1,
    address2: user.data.address2,
    address3: user.data.address3,
    country: user.data.country,
    zipcode: user.data.zipcode,
    recipient: user.data.recipient,
    shippingMessage: user.data.shippingMessage,
  });

  const {
    recipientEmail,
    recipientPhoneNumber,
    address1,
    address2,
    address3,
    country,
    zipcode,
    recipient,
    shippingMessage,
  } = form;

  const saveDetails = () => {
    db.collection("accounts").doc(user.id).update({
      recipientEmail,
      recipientPhoneNumber,
      address1,
      address2,
      address3,
      country,
      zipcode,
      recipient,
      shippingMessage,
    });
    alert("수정 완료");
  };

  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-11/12 flex-col mt-20">
        <div
          className="text-center text-md bg-gray-800 
    rounded-sm text-gray-100 mb-5 w-full"
        >
          내 정보
        </div>
        <div className="flex flex-row justify-evenly">
          {/* 주문내용 확인 */}
          <div className="flex-col mb-10 flex space-y-2 w-1/2">
            <div className="grid grid-cols-2">
              <div>이메일</div>
              <div>{user.id}</div>
            </div>

            <div className="grid grid-cols-2">
              <div>이름</div>
              <div>{user.data.displayName}</div>
            </div>

            <div className="grid grid-cols-2">
              <div>전화번호</div>
              {user.data.phoneNumber}
            </div>
            <div className="grid grid-cols-2">
              <div>담당자</div>
            </div>

            <div className="grid grid-cols-2">
              <div>CREDIT</div>
              <div>{user.data.credit} 원</div>
            </div>
            <div className="grid grid-cols-3">
              <Modal
                open={modalOpen}
                close={closeModal}
                header={"CREDIT DETAILS"}
              >
                <CreditDetails creditDetails={creditDetails} />
              </Modal>
              <button onClick={openModal}>사용내역</button>
            </div>
          </div>
          {/* 수령인 파트 */}

          <div className="flex-col mb-10 flex space-y-2">
            <div className="text-center">수령인</div>
            <div className="grid grid-cols-2">
              <div>email</div>
              <input
                name="recipientEmail"
                value={recipientEmail}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2">
              <div>전화번호</div>
              <input
                name="recipientPhoneNumber"
                value={recipientPhoneNumber}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2">
              <div>주소1</div>
              <input
                name="address1"
                value={address1}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2">
              <div>주소2</div>
              <input
                name="address2"
                value={address2}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2">
              <div>주소3</div>
              <input
                name="address3"
                value={address3}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2">
              <div>국가</div>
              <input
                name="country"
                value={country}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2">
              <div>우편번호</div>
              <input
                name="zipcode"
                value={zipcode}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2">
              <div>이름</div>
              <input
                name="recipient"
                value={recipient}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2">
              <div>요청사항</div>
              <input
                name="shippingMessage"
                value={shippingMessage}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <button onClick={saveDetails}>수정하기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyInfo;
