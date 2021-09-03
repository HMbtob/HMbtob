import React, { useContext, useState } from "react";
import { InitDataContext } from "../../../App";
import { db } from "../../../firebase";
import Modal from "../../modal/Modal";
import CreditDetails from "../../admin/customer/CreditDetails";
import useInputs from "../../../hooks/useInput";

const MyInfo = ({ match }) => {
  const { uid } = match.params;
  const state = useContext(InitDataContext);
  const { accounts, dhlShippingFee } = state;
  const { z } = dhlShippingFee;
  const countries = [].concat(
    ...z
      ?.map(zo => Object.values(zo).map(co => co.country))
      .map(doc => [].concat(...doc))
  );
  const user = accounts.find(account => account.data.uid === uid);
  const { creditDetails } = user.data;

  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  const [form, onChange] = useInputs({
    recipientEmail: user?.data.recipientEmail,
    recipientPhoneNumber: user?.data.recipientPhoneNumber,
    street: user?.data.street,
    city: user?.data.city,
    states: user?.data.states,
    country: user?.data.country,
    zipcode: user?.data.zipcode,
    recipient: user?.data.recipient,
    shippingMessage: user?.data.shippingMessage,
  });

  const {
    recipientEmail,
    recipientPhoneNumber,
    street,
    city,
    states,
    country,
    zipcode,
    recipient,
    shippingMessage,
  } = form;

  const saveDetails = () => {
    db.collection("accounts").doc(user.id).update({
      recipientEmail,
      recipientPhoneNumber,
      street,
      city,
      states,
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
          MY INFOMATION
        </div>
        <div className="flex flex-row justify-evenly">
          {/* 주문내용 확인 */}
          <div className="flex-col mb-10 flex space-y-2 w-1/2">
            <div className="grid grid-cols-2">
              <div>E-MAIL</div>
              <div>{user?.id}</div>
            </div>

            <div className="grid grid-cols-2">
              <div>NAME</div>
              <div>{user?.data.displayName}</div>
            </div>

            <div className="grid grid-cols-2">
              <div>NUMBER</div>
              {user?.data.phoneNumber}
            </div>

            <div className="grid grid-cols-2">
              <div>CREDIT</div>
              <div>
                {Math.round(user?.data.credit).toLocaleString("ko-KR")}{" "}
                {user?.data.currency}
              </div>
            </div>
            <div className="grid grid-cols-3">
              <Modal
                open={modalOpen}
                close={closeModal}
                header={"CREDIT DETAILS"}
              >
                <CreditDetails creditDetails={creditDetails} />
              </Modal>
              <button
                onClick={openModal}
                className="bg-gray-500 p-1 rounded text-gray-200"
              >
                details
              </button>
            </div>
          </div>
          {/* 수령인 파트 */}

          <div className="flex-col mb-10 flex space-y-2">
            <div className="grid grid-cols-2">
              <div>Email</div>
              <input
                name="recipientEmail"
                value={recipientEmail}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2">
              <div>PhoneNumber</div>
              <input
                name="recipientPhoneNumber"
                value={recipientPhoneNumber}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2">
              <div>Street</div>
              <input
                name="street"
                value={street}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2">
              <div>City</div>
              <input
                name="city"
                value={city}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2">
              <div>state</div>
              <input
                name="states"
                value={states}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2">
              <div>Country</div>
              <select
                name="country"
                value={country}
                onChange={onChange}
                className="border p-1 pl-2"
              >
                {countries.sort().map((co, i) => (
                  <option key={i} value={co}>
                    {co}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2">
              <div>Zipcode</div>
              <input
                name="zipcode"
                value={zipcode}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2">
              <div>Recipient</div>
              <input
                name="recipient"
                value={recipient}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2">
              <div>MEMO</div>
              <textarea
                required
                rows="5"
                cols="19"
                name="shippingMessage"
                value={shippingMessage}
                onChange={onChange}
                className="border p-1"
              />
            </div>
            <button
              onClick={saveDetails}
              className="bg-gray-500 p-1 rounded text-gray-200"
            >
              FIX
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyInfo;
