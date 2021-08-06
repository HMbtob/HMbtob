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
    address1: user.data.address1,
    address2: user.data.address2,
    address3: user.data.address3,
    country: user.data.country,
    zipcode: user.data.zipcode,
    recipient: user.data.recipient,
    shippingMessage: user.data.shippingMessage,
    // 담당자
    inCharge: user.data.inCharge,
    cd: user.data.dcRates.cd * 100,
    dvd: user.data.dcRates.dvd * 100,
    goods: user.data.dcRates.goods * 100,
    limited: user.data.dcRates.limited * 100,
    per: user.data.dcRates.per * 100,
    beauty: user.data.dcRates.beauty * 100,
    dhl: user.data.shippingRate.dhl,
    ems: user.data.shippingRate.ems,
    // 추후 기입
    nickName: user.data.nickName,
    memo: user.data.memo,
    // 크레딧
    handleCredit: "",
  });

  const {
    type,
    recipientEmail,
    recipientPhoneNumber,
    address1,
    address2,
    address3,
    country,
    zipcode,
    recipient,
    shippingMessage,
    inCharge,
    cd,
    dvd,
    goods,
    limited,
    per,
    beauty,
    dhl,
    ems,
    nickName,
    memo,
    handleCredit,
  } = form;

  const dcValues = { cd, dvd, goods, limited, per, beauty };
  const shippingRate = { dhl, ems };

  const saveDetails = () => {
    db.collection("accounts")
      .doc(user.id)
      .update({
        recipientEmail,
        recipientPhoneNumber,
        address1,
        address2,
        address3,
        country,
        zipcode,
        recipient,
        shippingMessage,
        dcRates: {
          cd: cd > 0 ? cd / 100 : 0,
          dvd: dvd > 0 ? dvd / 100 : 0,
          goods: goods > 0 ? goods / 100 : 0,
          limited: limited > 0 ? limited / 100 : 0,
          per: per > 0 ? per / 100 : 0,
          beauty: beauty > 0 ? per / 100 : 0,
        },
        shippingRate: { dhl, ems },
        nickName,
        inCharge,
        memo,
        type,
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
          주문 내용 확인
        </div>
        <div className="flex flex-row justify-evenly">
          {/* 주문내용 확인 */}
          <div className="flex-col mb-10 flex space-y-2 w-1/2">
            <div className="grid grid-cols-2">
              <div>이메일</div>
              <div>{user.id}</div>
            </div>
            <div className="grid grid-cols-2">
              <div>권한</div>
              <select name="type" value={type} onChange={onChange}>
                <option value="">권한선택</option>
                <option value="none">none</option>
                <option value="customer">customer</option>
                <option value="admin">admin</option>
              </select>
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
              <div>nick name</div>
              <input
                name="nickname"
                value={nickName}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2">
              <div>memo</div>
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
              <button onClick={saveCredit}>충전하기</button>
              <input
                name="handleCredit"
                value={handleCredit}
                onChange={onChange}
                className="border p-1"
              />
            </div>
            {/* 할인율 */}
            <div className="grid grid-cols-1">
              <div className="text-center my-1 font-semibold">
                할인율 {`[ % ]`}
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

export default CustomerDetail;
