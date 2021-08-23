import React, { useContext, useState } from "react";
import useInputs from "../../../hooks/useInput";
import { InitDataContext } from "../../../App";
import { db } from "../../../firebase";
import firebase from "firebase";
import CreditDetails from "./CreditDetails";
import Modal from "../../modal/Modal";

const CustomerDetail = ({ match }) => {
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

  const [form, onChange, reset, credit_reset] = useInputs({
    type: user.data.type,
    recipientEmail: user.data.recipientEmail,
    recipientPhoneNumber: user.data.recipientPhoneNumber,
    street: user.data.street,
    city: user.data.city,
    states: user.data.states,
    country: user.data.country,
    zipcode: user.data.zipcode,
    recipient: user.data.recipient,
    shippingMessage: user.data.shippingMessage,
    // 담당자
    inCharge: user.data.inCharge,
    cd: user.data.dcRates.cd * 100,
    dvdBlueRay: user.data.dcRates.dvdBlueRay * 100,
    goods: user.data.dcRates.goods * 100,
    photoBook: user.data.dcRates.photoBook * 100,
    officialStore: user.data.dcRates.officialStore * 100,
    beauty: user.data.dcRates.beauty * 100,
    dhl: user.data.shippingRate.dhl,
    // 추후 기입
    nickName: user.data.nickName,
    memo: user.data.memo,
    // 크레딧
    handleCredit: "",
    // 커런시
    currency: user.data.currency,
    // alias
    alias: user.data.alias,
  });

  const {
    type,
    recipientEmail,
    recipientPhoneNumber,
    street,
    city,
    states,
    country,
    zipcode,
    recipient,
    shippingMessage,
    inCharge,
    cd,
    dvdBlueRay,
    goods,
    photoBook,
    officialStore,
    beauty,
    dhl,
    nickName,
    memo,
    handleCredit,
    currency,
    alias,
  } = form;

  const dcValues = { cd, dvdBlueRay, goods, photoBook, officialStore, beauty };
  const shippingRate = { dhl };

  const saveDetails = () => {
    db.collection("accounts")
      .doc(user.id)
      .update({
        recipientEmail,
        recipientPhoneNumber,
        street,
        city,
        states,
        country,
        zipcode,
        recipient,
        shippingMessage,
        dcRates: {
          cd: Number(cd) / 100,
          dvdBlueRay: Number(dvdBlueRay) / 100,
          photoBook: Number(goods) / 100,
          goods: Number(photoBook) / 100,
          officialStore: Number(officialStore) / 100,
          beauty: Number(beauty) / 100,
        },
        shippingRate: { dhl },
        nickName,
        inCharge,
        memo,
        type,
        currency,
        alias,
      });
    alert("수정 완료");
  };

  const saveCredit = () => {
    db.collection("accounts")
      .doc(user.id)
      .update({
        credit: Number(user.data.credit) + Number(handleCredit),
        creditDetails: firebase.firestore.FieldValue.arrayUnion({
          type: "charge",
          amount: Number(handleCredit),
          currency: user.data.currency,
          date: new Date(),
          totalAmount: Number(user.data.credit) + Number(handleCredit),
        }),
      });
    credit_reset();
  };

  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-11/12 flex-col mt-20">
        <div
          className="text-center text-md bg-gray-800 
        rounded-sm text-gray-100 mb-5 w-full"
        >
          USER DETAILS{" "}
        </div>
        <div className="flex flex-row justify-evenly">
          {/* 주문내용 확인 */}
          <div className="flex-col mb-10 flex space-y-2 w-1/2">
            <div className="grid grid-cols-2">
              <div>Email</div>
              <div>{user.id}</div>
            </div>
            <div className="grid grid-cols-2">
              <div>Permission</div>
              <select
                name="type"
                className="border p-1"
                value={type}
                onChange={onChange}
              >
                <option value="">권한선택</option>
                <option value="none">none</option>
                <option value="customer">customer</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <div className="grid grid-cols-2">
              <div>Name</div>
              <div>{user.data.displayName}</div>
            </div>

            <div className="grid grid-cols-2">
              <div>Number</div>
              {user.data.phoneNumber}
            </div>
            <div className="grid grid-cols-2">
              <div>In Charge</div>
              <select name="inCharge" value={inCharge} onChange={onChange}>
                <option>담당자선택</option>
                {inCharges &&
                  inCharges.map((inCharge, index) => (
                    <option key={index} value={inCharge.id}>
                      {inCharge.id}
                    </option>
                  ))}
              </select>
            </div>
            <div className="grid grid-cols-2">
              <div>Currency</div>
              <select
                name="currency"
                value={currency}
                onChange={onChange}
                className="border p-1"
              >
                <option value="KRW">KRW</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="SGD">SGD</option>
                <option value="JPY">JPY</option>
                <option value="CNY">CNY</option>
              </select>
            </div>
            <div className="grid grid-cols-2">
              <div>Nick name</div>
              <input
                name="nickname"
                value={nickName}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2">
              <div>Alias</div>
              <input
                name="alias"
                value={alias}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2">
              <div>Memo About Customer</div>
              <textarea
                name="memo"
                cols="40"
                rows="5"
                value={memo}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2">
              <div>CREDIT</div>
              <div>
                {Math.round(user.data.credit).toLocaleString("ko-KR")}{" "}
                {user.data.currency}
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
                className="bg-gray-700 p-1 rounded text-gray-200 m-2"
                onClick={openModal}
              >
                Details
              </button>
              <button
                className="bg-gray-700 p-1 rounded text-gray-200 m-2"
                onClick={saveCredit}
              >
                Charge
              </button>
              <input
                name="handleCredit"
                value={handleCredit}
                onChange={onChange}
                placeholder="charge"
                className="border p-1 m-1"
              />
            </div>
            {/* 할인율 */}
            <div className="grid grid-cols-1">
              <div className="text-center my-1 font-semibold">
                DC Rate {`[ % ]`}
              </div>
              <div
                className={`grid grid-cols-${
                  Object.keys(user.data.dcRates).length
                } border mb-10`}
              >
                {Object.keys(user.data.dcRates)
                  .sort()
                  .map((doc, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1  bg-gray-600 text-center"
                    >
                      <div className="text-gray-100">{doc}</div>
                      <input
                        type="number"
                        name={doc}
                        value={dcValues[doc]}
                        onChange={onChange}
                        className="text-center text-gray-800"
                      />
                    </div>
                  ))}
              </div>
              <div className="text-center my-1 font-semibold">
                배송요율 {`[ 원 ]`}
              </div>
              <div
                className={`grid grid-cols-${
                  Object.keys(user.data.shippingRate).length
                } border mb-10`}
              >
                {Object.keys(user.data.shippingRate)
                  .sort()
                  .map((doc, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1  bg-gray-600 text-center  "
                    >
                      <div className="text-gray-100">{doc}</div>
                      <input
                        type="number"
                        name={doc}
                        value={shippingRate[doc]}
                        onChange={onChange}
                        className="text-center text-gray-800"
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
          {/* 수령인 파트 */}

          <div className="flex-col mb-10 flex space-y-2">
            <div className="grid grid-cols-2">
              <div>Recipient Email</div>
              <input
                name="recipientEmail"
                value={recipientEmail}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2">
              <div>Recipient PhoneNumber</div>
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
              <div>State</div>
              <input
                name="states"
                value={states}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2">
              <div>Country</div>
              <input
                name="country"
                value={country}
                onChange={onChange}
                className="border p-1"
              />{" "}
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
              <div>Shipping Message</div>
              <textarea
                rows="5"
                cols="30"
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

export default CustomerDetail;
