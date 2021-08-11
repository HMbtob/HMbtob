import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { InitDataContext } from "../../../App";
import useInputs from "../../../hooks/useInput";
import { db } from "../../../firebase";
import firebase from "firebase";

const B2bOrder = () => {
  const state = useContext(InitDataContext);
  const history = useHistory();

  const { user, simpleLists, products, dhlShippingFee } = state;
  const { z } = dhlShippingFee;

  // 배송국가 전체 for select option
  const countries = [].concat(
    ...z
      ?.map(zo => Object.values(zo).map(co => co.country))
      .map(doc => [].concat(...doc))
  );

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
    street: "",
    city: "",
    states: "",
    country: "",
    zipcode: "",
    recipientPhoneNumber: "",
    recipientEmail: "",
    shippingMessage: "",
    paymentMethod: "",
    shippingType: "",
    orderEmail: user?.email,
  });

  const {
    recipient,
    street,
    city,
    states,
    country,
    zipcode,
    recipientPhoneNumber,
    recipientEmail,
    shippingMessage,
    paymentMethod,
    shippingType,
  } = form;

  const { orderEmail } = form;
  const inputsName = [
    "recipient",
    "street",
    "city",
    "state",
    "country",
    "zipcode",
    "PhoneNumber",
    "Email",
    "Memo",
    "Payment Method",
    "Shipping Type",
  ];

  const options = [
    [{ transfer: "계좌이체" }, { credit: "크레딧" }],
    [
      { dhl: "DHL" },
      // { ems: "EMS" }
    ],
  ];

  // 운임, 총무게
  const totalWeight =
    simpleLists &&
    simpleLists.reduce((i, c) => {
      return i + c.weight * c.quan;
    }, 0) / 1000;

  // 몇번재 구간에 걸리는지 num 에서 1빼야함
  let num = 1;
  for (let i = 1; i < 31; i++) {
    let j = i * 0.5;
    if (j > totalWeight) {
      break;
    }
    num++;
  }

  // 어느나라에 걸리는지
  const zone =
    z &&
    country.length > 0 &&
    Object.keys(
      z.find(doc =>
        Object.values(doc).find(asd => asd.country.includes(country))
      )
    );

  // 가격
  const fee =
    z &&
    country.length > 0 &&
    Number(
      Object.values(z.find(doc => Object.keys(doc)[0] === zone[0]))[0]
        .fee[num - 1].split(",")
        .join("")
    );

  const confirmOrder = async () => {
    await db.collection("orders").doc("b2b").collection("b2borders").add({
      orderState: "confirmOrder",
      paymentMethod,
      recipient,
      shippingType,
      street,
      city,
      states,
      country,
      zipcode,
      recipientPhoneNumber,
      recipientEmail,
      shippingMessage,
      orderNumber: state.orderNumber,
      createdAt: new Date(),
      customer: orderEmail,
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
            fee),
        creditDetails: firebase.firestore.FieldValue.arrayUnion({
          type: "makeOrder",
          amount: Number(
            simpleLists.reduce((i, c) => {
              return i + (c.price - c.dcRate * c.price) * c.quan;
            }, 0) + fee
          ),
          date: new Date(),
          totalAmount:
            Number(user.credit) -
            Number(
              simpleLists.reduce((i, c) => {
                return i + (c.price - c.dcRate * c.price) * c.quan;
              }, 0) + fee
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
          <div className="flex-col mb-10 flex space-y-2  w-2/5">
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
                  {user.type === "admin" ? (
                    <input
                      type="text"
                      name="orderEmail"
                      className="border h-8 pl-2"
                      value={orderEmail}
                      onChange={onChange}
                    />
                  ) : (
                    <div>{user.email}</div>
                  )}
                </div>
              </>
            )}
          </div>
          {/* 세로선 */}
          <div className="border mb-10"></div>
          {/*   dep-3-2-2 수령인 */}
          <div className="flex-col mb-10 flex space-y-2 w-2/5">
            {Object.keys(form)
              .slice(0, -1)
              .map((doc, index) => (
                <div key={index} className="grid grid-cols-2">
                  <div className="p-1">{inputsName[index]}</div>
                  {doc !== "paymentMethod" &&
                  doc !== "shippingType" &&
                  doc !== "shippingMessage" &&
                  doc !== "country" ? (
                    <input
                      className="border h-8  pl-2"
                      type="text"
                      name={doc}
                      value={form[index]}
                      onChange={onChange}
                    />
                  ) : doc === "shippingMessage" ? (
                    <textarea
                      rows="5"
                      cols="19"
                      name="shippingMessage"
                      value={shippingMessage}
                      onChange={onChange}
                      className="border p-1"
                    />
                  ) : (
                    <select
                      name={doc}
                      value={form[index]}
                      onChange={onChange}
                      className="border"
                    >
                      {doc === "paymentMethod" ? (
                        <>
                          <option value="">필수선택</option>
                          {options[0].map((option, index) => (
                            <option key={index} value={Object.keys(option)}>
                              {Object.values(option)}
                            </option>
                          ))}
                        </>
                      ) : doc === "shippingType" ? (
                        <>
                          <option value="">필수선택</option>
                          {options[1].map((option, index) => (
                            <option key={index} value={Object.keys(option)}>
                              {Object.values(option)}
                            </option>
                          ))}
                        </>
                      ) : doc === "country" ? (
                        <>
                          <option value="">필수선택</option>
                          {countries.map((co, i) => (
                            <option key={i} value={co}>
                              {co}
                            </option>
                          ))}
                        </>
                      ) : (
                        ""
                      )}
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
            <div>SKU</div>
            <div className="col-span-5">앨범명</div>
            <div className="col-span-1">출시일</div>
            <div>판매가</div>
            <div className="col-span-1">할인가</div>
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
                  <div>
                    {
                      products?.find(product => product.id === doc.productId)
                        .data.sku
                    }
                  </div>
                  <div className="col-span-5">{doc.title}</div>
                  <div className="col-span-1">
                    {new Date(doc.relDate.toDate()).toLocaleDateString()}
                  </div>

                  <div>{doc.price} 원</div>
                  <div className="col-span-1">
                    {doc.price - doc.dcRate * doc.price} 원
                    {/* {` [${doc.dcRate * 100} %]`} */}
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
            <div>총액</div>
            <div>
              {simpleLists &&
                simpleLists.reduce((i, c) => {
                  return i + (c.price - c.dcRate * c.price) * c.quan;
                }, 0)}{" "}
              원
            </div>
          </div>
          {/* <div className="grid grid-cols-2 w-1/2 text-right">
            <div>총무게</div>
            <div>
              {simpleLists &&
                simpleLists.reduce((i, c) => {
                  return i + c.weight * c.quan;
                }, 0) / 1000}{" "}
              KG
            </div>
          </div> */}
          <div className="grid grid-cols-2 w-1/2 text-right">
            <div>예상운송비</div>
            <div>
              {/* FIXME: 초과분 */}
              {/* 30키로 미만 */}
              {fee && fee}
              {/* 30키로 초과 */}원
            </div>
          </div>
          <div className="grid grid-cols-2 w-1/2 text-right">
            <div>합계</div>
            <div>
              {fee &&
                simpleLists.reduce((i, c) => {
                  return i + (c.price - c.dcRate * c.price) * c.quan;
                }, 0) + fee}
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
              street.length > 0 &&
              city.length > 0 &&
              state.length > 0 &&
              country.length > 0 &&
              zipcode.length > 0 &&
              paymentMethod.length > 0 &&
              shippingType.length > 0 &&
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
