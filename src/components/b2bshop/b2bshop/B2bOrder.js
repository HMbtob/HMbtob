import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import { InitDataContext } from "../../../App";
import useInputs from "../../../hooks/useInput";
import { db } from "../../../firebase";
import firebase from "firebase";

const B2bOrder = () => {
  const state = useContext(InitDataContext);

  const history = useHistory();

  const { user, simpleLists } = state;
  // 약관 체크
  const [confirmChecked, setConfirmCheck] = useState(false);

  const checkHandler = e => {
    const { checked } = e.target;
    if (checked) {
      setConfirmCheck(true);
    } else {
      setConfirmCheck(false);
    }
  };

  //  인풋
  const [form, onChange, reset] = useInputs({
    recipient: "",
    address1: "",
    address2: "",
    address3: "",
    country: "",
    zipcode: "",
    recipientPhoneNumber: "",
    recipientEmail: "",
    shippingMessage: "",
    paymentMethod: "transfer",
    shippingType: "dhl",
  });

  const {
    recipient,
    address1,
    address2,
    address3,
    country,
    zipcode,
    recipientPhoneNumber,
    recipientEmail,
    shippingMessage,
    paymentMethod,
    shippingType,
  } = form;

  const inputsName = [
    "수령인",
    "주소1",
    "주소2",
    "주소3",
    "국가",
    "우편번호",
    "수령인번호",
    "수령인이메일",
    "배송매세지",
    "결제방법",
    "배송방법",
  ];

  const options = [
    [{ transfer: "계좌이체" }, { credit: "크레딧" }],
    [{ dhl: "DHL" }, { ems: "EMS" }],
  ];

  const confirmOrder = async () => {
    await db.collection("orders").doc("b2b").collection("b2borders").add({
      orderState: "confirmOrder",
      paymentMethod,
      recipient,
      shippingType,
      address1,
      address2,
      address3,
      country,
      zipcode,
      recipientPhoneNumber,
      recipientEmail,
      shippingMessage,
      orderNumber: state.orderNumber,
      createdAt: new Date(),
      customer: user.email,
      list: simpleLists,
      dcRates: user.dcRates,
      shippingRate: user.shippingRate,
    });
    await db
      .collection("forNumberedId")
      .doc("b2bOrder")
      .set({ counts: state.orderCounts + 1 });
    await db
      .collection("accounts")
      .doc(user.email)
      .update({
        credit:
          user.credit -
          (simpleLists.reduce((i, c) => {
            return i + (c.price - c.dcRate * c.price) * c.quan;
          }, 0) +
            (simpleLists.reduce((i, c) => {
              return i + c.weight * c.quan;
            }, 0) /
              1000) *
              user.shippingRate[shippingType]),
        creditDetails: firebase.firestore.FieldValue.arrayUnion({
          type: "makeOrder",
          amount: Number(
            simpleLists.reduce((i, c) => {
              return i + (c.price - c.dcRate * c.price) * c.quan;
            }, 0) +
              (simpleLists.reduce((i, c) => {
                return i + c.weight * c.quan;
              }, 0) /
                1000) *
                user.shippingRate[shippingType]
          ),
          date: new Date(),
          totalAmount:
            Number(user.credit) -
            Number(
              simpleLists.reduce((i, c) => {
                return i + (c.price - c.dcRate * c.price) * c.quan;
              }, 0) +
                (simpleLists.reduce((i, c) => {
                  return i + c.weight * c.quan;
                }, 0) /
                  1000) *
                  user.shippingRate[shippingType]
            ),
        }),
      });

    await reset();
    await alert("주문 완료");
    if (user.type === "admin") {
      history.push("/orderlist");
    }
    history.push("/myorderlist");
  };

  return (
    // dep-1
    <div className="w-full h-full flex justify-center">
      {/* dep-2 */}
      <div className="w-4/5 flex-col mt-20 flex items-center">
        {/* dep-3-1 */}
        <div
          className="text-center text-xl bg-gray-800 py-1 
        rounded-sm font-bold text-gray-100 mb-5 w-full"
        >
          주문 내용 확인
        </div>
        {/* dep-3-2 주문자 / 수령인*/}
        <div className="w-full flex flex-row justify-evenly">
          {/*   dep-3-2-1 주문자 */}
          <div className="flex-col mb-10 flex space-y-2">
            <div className="grid grid-cols-2">
              <div>주문번호</div>
              {state.orderNumber && <div>{state.orderNumber}</div>}
            </div>
            {user && (
              <>
                <div className="grid grid-cols-2">
                  <div>주문자</div>
                  <div>{user.displayName}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div>주문자 연락처</div>
                  <div>{user.phoneNumber}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div>주문자 이메일</div>
                  <div>{user.email}</div>
                </div>
              </>
            )}
          </div>
          {/* 세로선 */}
          <div className="border mb-10"></div>
          {/*   dep-3-2-2 수령인 */}
          <div className="flex-col mb-10 flex space-y-2">
            {Object.keys(form).map((doc, index) => (
              <div key={index} className="grid grid-cols-2">
                <div className="p-1">{inputsName[index]}</div>
                {doc !== "paymentMethod" && doc !== "shippingType" ? (
                  <input
                    className="border h-8"
                    type="text"
                    name={doc}
                    value={form[index]}
                    onChange={onChange}
                  />
                ) : (
                  <select
                    name={doc}
                    value={form[index]}
                    onChange={onChange}
                    className="border"
                  >
                    {doc === "paymentMethod"
                      ? options[0].map((option, index) => (
                          <option key={index} value={Object.keys(option)}>
                            {Object.values(option)}
                          </option>
                        ))
                      : doc === "shippingType"
                      ? options[1].map((option, index) => (
                          <option key={index} value={Object.keys(option)}>
                            {Object.values(option)}
                          </option>
                        ))
                      : ""}
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* dep-3-3 */}
        <div className="flex-col mb-10 w-full">
          {/* 번호/앨범명/판매가/할인가/금액 */}
          <div className="grid grid-cols-12 text-center bg-gray-800 rounded-sm text-gray-100">
            <div>No.</div>
            <div className="col-span-5">앨범명</div>
            <div className="col-span-1">출시일</div>
            <div className="col-span-1">주문마감일</div>
            <div>판매가</div>
            <div>할인가</div>
            <div>수량</div>
            <div>금액</div>
          </div>
          {simpleLists && (
            <>
              {simpleLists.map((doc, index) => (
                <div
                  className="grid grid-cols-12 text-center text-sm bg-white
                  border-b border-r border-l py-1"
                  key={index}
                >
                  <div>{doc.childOrderNumber}</div>
                  <div className="col-span-5">{doc.title}</div>
                  <div className="col-span-1">
                    {new Date(doc.relDate.toDate()).toLocaleDateString()}
                  </div>
                  <div className="col-span-1">
                    {new Date(
                      doc.preOrderDeadline.toDate()
                    ).toLocaleDateString()}
                  </div>
                  <div>{doc.price} 원</div>
                  <div>
                    {doc.price - doc.dcRate * doc.price} 원
                    {` [${doc.dcRate * 100} %]`}
                  </div>
                  <div>{doc.quan} 개</div>
                  <div>
                    {(doc.price - doc.dcRate * doc.price) * doc.quan} 원
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* dep-3-4 */}
        <div className="flex-col mb-10 w-full flex items-end">
          <div className="grid grid-cols-2 w-1/2 text-right">
            <div>총액가액</div>
            <div>
              {simpleLists &&
                simpleLists.reduce((i, c) => {
                  return i + (c.price - c.dcRate * c.price) * c.quan;
                }, 0)}{" "}
              원
            </div>
          </div>
          <div className="grid grid-cols-2 w-1/2 text-right">
            <div>총무게</div>
            <div>
              {simpleLists &&
                simpleLists.reduce((i, c) => {
                  return i + c.weight * c.quan;
                }, 0) / 1000}{" "}
              KG
            </div>
          </div>
          <div className="grid grid-cols-2 w-1/2 text-right">
            <div>예상운송비</div>
            <div>
              {(simpleLists.reduce((i, c) => {
                return i + c.weight * c.quan;
              }, 0) /
                1000) *
                user.shippingRate[shippingType]}
              원
            </div>
          </div>
          <div className="grid grid-cols-2 w-1/2 text-right">
            <div>합계</div>
            <div>
              {simpleLists.reduce((i, c) => {
                return i + (c.price - c.dcRate * c.price) * c.quan;
              }, 0) +
                (simpleLists.reduce((i, c) => {
                  return i + c.weight * c.quan;
                }, 0) /
                  1000) *
                  user.shippingRate[shippingType]}
              원
            </div>
          </div>
        </div>

        <div className="grid grid-cols-6 items-center mb-96 w-full place-items-center">
          <div className="col-span-3">기본 약관/안내 체크하면 버튼 활성화</div>
          <input
            className="col-span-1"
            type="checkbox"
            checked={confirmChecked ? true : false}
            onChange={checkHandler}
          />
          <button
            className={`${
              confirmChecked &&
              recipient.length > 0 &&
              address1.length > 0 &&
              address2.length > 0 &&
              address3.length > 0 &&
              country.length > 0 &&
              zipcode.length > 0 &&
              recipientPhoneNumber.length > 0 &&
              recipientEmail.length > 0 &&
              shippingMessage.length > 0
                ? "col-span-2 bg-gray-800 py-2 px-8 rounded-sm text-gray-100"
                : "col-span-2 bg-gray-100 py-2 px-8 rounded-sm text-gray-100"
            }`}
            disabled={!confirmChecked}
            onClick={confirmOrder}
          >
            주문하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default B2bOrder;
