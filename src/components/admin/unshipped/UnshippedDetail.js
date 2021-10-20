import React, { useContext, useEffect, useState } from "react";
import { InitDataContext } from "../../../App";
import { db } from "../../../firebase";
import UnshippedDetailRow from "./UnshippedDetailRow";

const UnshippedDetail = ({ match }) => {
  const { uid } = match.params;
  const state = useContext(InitDataContext);
  const { accounts, orders } = state;
  const [customerId, setCustomerId] = useState("");
  const [orderNumberSelect, setorderNumberSelect] = useState("");
  const [unshipped, setUnshipped] = useState([]);

  const [checkedInputs, setCheckedInputs] = useState([]);
  const changeHandler = (checked, id) => {
    if (checked) {
      setCheckedInputs([...checkedInputs, id]);
    } else {
      // 체크 해제
      setCheckedInputs(checkedInputs.filter(el => el !== id));
    }
  };

  const orderNumbers = checkedInputs.map(input => input.slice(0, 13));
  const settedNumbers = [...new Set(orderNumbers)];

  const moveItems = async e => {
    e.preventDefault();
    if (orderNumberSelect.length <= 0) {
      return alert("Please select the correct order number");
    }

    // const orderNumbers = checkedInputs.map(input => input.slice(0, 13));
    // console.log("orderNumbers", orderNumbers);
    // const settedNumbers = [...new Set(orderNumbers)];
    // console.log("settedNumbers", settedNumbers);

    // 저장
    await db
      .collection("orders")
      .doc("b2b")
      .collection("b2borders")
      .doc(orders.find(arr => arr.data.orderNumber === orderNumberSelect).id)
      .update({
        list: [
          ...[].concat.apply(
            [],
            settedNumbers.map(num =>
              checkedInputs
                .map(doc =>
                  orders
                    .find(order => order.data.orderNumber.trim() === num)
                    .data.list.find(arr => arr.childOrderNumber === doc)
                )
                .filter(input => input !== undefined)
            )
          ),
          ...orders
            .find(arr => arr.data.orderNumber === orderNumberSelect)
            .data.list.filter(
              li => !checkedInputs.includes(li.childOrderNumber)
            ),
        ],
      });
    for (let i = 0; i < settedNumbers.length; i++) {
      const order = orders.find(
        order => order.data.orderNumber.trim() === settedNumbers[i]
      );

      await db
        .collection("orders")
        .doc("b2b")
        .collection("b2borders")
        .doc(order.id)
        .update({
          list: [
            ...order.data.list.filter(
              item => !checkedInputs.includes(item.childOrderNumber)
            ),
            ...checkedInputs
              .map(doc =>
                order.data.list.find(arr => arr.childOrderNumber === doc)
              )
              .filter(input => input !== undefined)
              .map(doc2 => {
                doc2.moveTo = orderNumberSelect;
                doc2.moved = true;
                return doc2;
              }),
          ],
        });
    }
    // 삭제
  };

  useEffect(() => {
    setCustomerId(accounts.find(acc => acc.data.uid === uid).id);
    setUnshipped(
      [].concat
        .apply(
          [],
          orders
            .filter(arr1 => arr1.data.customer === customerId)
            .map(arr2 => arr2.data.list)
        )
        .filter(arr3 => arr3.shipped === false)
    );
  }, [orders, uid, customerId]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-11/12 flex-col mt-20">
        <div
          className="text-center text-xl bg-gray-800 py-1 
        rounded-sm font-bold text-gray-100 mb-5 w-full"
        >
          미발송 내용 확인
        </div>
        {/* 좌 / 우 */}
        <div className="flex flex-row justify-evenly">
          {/* 좌 */}
          <div className="flex-col mb-10 flex space-y-2">
            <div className="grid grid-cols-2">
              <div>이메일</div>
              <div>{accounts.find(acc => acc.data.uid === uid).id}</div>
            </div>
            {/* 할인율 */}
            <div className="grid grid-cols-1">
              <div className="text-center my-1 font-semibold">할인율</div>
              <div className="grid grid-cols-7 bg-gray-600 text-center text-gray-100 rounded-sm px-1">
                {Object.keys(
                  accounts.find(acc => acc.data.uid === uid)?.data.dcRates
                ).map((doc, index) => (
                  <div key={index}>{doc}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 text-center border-b px-1 border-l border-r text-sm">
                {Object.values(
                  accounts.find(acc => acc.data.uid === uid)?.data.dcRates
                ).map((doc, index) => (
                  <div key={index}>{doc * 100} %</div>
                ))}
              </div>
              <div className="text-center my-1 font-semibold mt-3">
                배송요율
              </div>
              <div className="grid grid-cols-6 bg-gray-600 text-center text-gray-100 rounded-sm px-1">
                {" "}
                {Object.keys(
                  accounts.find(acc => acc.data.uid === uid)?.data.shippingRate
                ).map((doc, index) => (
                  <div key={index}>{doc}</div>
                ))}
              </div>
              <div className="grid grid-cols-6 text-center border-b px-1 border-l border-r text-sm">
                {Object.values(
                  accounts.find(acc => acc.data.uid === uid)?.data.shippingRate
                ).map((doc, index) => (
                  <div key={index}>{doc} 원</div>
                ))}
              </div>
            </div>
          </div>
          {/* 우 */}
          <div className="flex-col mb-10 flex space-y-2">
            <div className="grid grid-cols-2">기타 주문인 정보/통계</div>
            <div className="grid grid-cols-2">
              <div>전화번호</div>
              <input
              // name="recipientPhoneNumber"
              // value={recipientPhoneNumber}
              // onChange={onChange}
              />{" "}
            </div>
          </div>
        </div>
        <div className="w-full text-center">상품종류</div>
        <div
          className="grid grid-cols-28 text-center bg-gray-800 
        rounded-sm text-gray-100 text-sm py-1"
        >
          <div className="col-span-1"></div>
          <div className="col-span-2">No.</div>
          <div className="col-span-2">주문일</div>
          <div className="col-span-2">발매일</div>
          <div className="col-span-2">바코드</div>
          <div className="col-span-2">SKU</div>
          <div className="col-span-7">앨범명</div>
          <div className="col-span-3">할인가</div>
          <div className="col-span-2">수량</div>
          <div className="col-span-2">총무게</div>
          <div className="col-span-3">총액</div>
        </div>

        {unshipped &&
          unshipped
            .filter(
              doc =>
                doc.moved === false &&
                doc.canceled === false &&
                doc.shipped === false
            )
            .sort((a, b) => {
              return a?.title?.trim() < b?.title?.trim()
                ? -1
                : a?.title?.trim() > b?.title?.trim()
                ? 1
                : 0;
            })
            .map(arr4 => (
              <UnshippedDetailRow
                key={arr4.childOrderNumber}
                list={arr4}
                checkedInputs={checkedInputs}
                changeHandler={changeHandler}
              />
            ))}
      </div>
      <div className="w-11/12 my-5 flex justify-end">
        <select
          name="orderNumberSelect"
          value={orderNumberSelect}
          onChange={e => setorderNumberSelect(e.target.value)}
          className="p-1 border"
        >
          {/* 해당 주문자의 미발송 주문 가져와서 이동 */}
          <option>NO.</option>

          {orders
            .filter(
              doc =>
                doc.data.orderState !== "shipped" &&
                doc.data.customer === customerId &&
                !settedNumbers.includes(doc.data.orderNumber.trim())
            )
            .map((doc, index) => (
              <option key={index} value={doc.data.orderNumber}>
                {doc.data.orderNumber}
              </option>
            ))}
        </select>
        <button
          onClick={moveItems}
          className="bg-gray-800 text-gray-200 px-2 py-1 ml-1 rounded-sm"
        >
          MOVE
        </button>
      </div>
    </div>
  );
};

export default UnshippedDetail;
