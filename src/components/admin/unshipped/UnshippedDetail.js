import React, { useContext, useEffect, useState } from "react";
import { InitDataContext } from "../../../App";
import firebase from "firebase";
import { Link } from "react-router-dom";
import AssignmentIcon from "@material-ui/icons/Assignment";

import { db } from "../../../firebase";
import UnshippedDetailRow from "./UnshippedDetailRow";
import { useHistory } from "react-router";
import Modal from "../../modal/Modal";
import CreditDetails from "../customer/utils/CreditDetails";
import useInputs from "../../../hooks/useInput";

const UnshippedDetail = ({ match }) => {
  const { uid } = match.params;
  const history = useHistory();

  const state = useContext(InitDataContext);
  const { accounts, orders } = state;

  const user = accounts.find(account => account.data.uid === uid);
  const { creditDetails } = user.data;

  const [form, onChange, reset, credit_reset] = useInputs({
    // 크레딧
    handleCredit: 0,
    creditType: "Store-Credit",
    // orderNumberSelect: "",
  });

  const {
    handleCredit,
    creditType,
    //  orderNumberSelect
  } = form;

  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  const saveCredit = () => {
    if (handleCredit === 0) {
      alert("올바른 숫자를 입력해 주세요");
    }
    db.collection("accounts")
      .doc(user.id)
      .update({
        credit: Number(user.data.credit) + Number(handleCredit),
        creditDetails: firebase.firestore.FieldValue.arrayUnion({
          type: creditType,
          amount: Number(handleCredit),
          currency: user.data.currency,
          date: new Date(),
          totalAmount: Number(user.data.credit) + Number(handleCredit),
        }),
      });
    credit_reset();
  };

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

  const cancelItems = async e => {
    e.preventDefault();
    if (checkedInputs.length <= 0) {
      return alert("Please check a item to cancel");
    }

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
                doc2.canceled = true;
                return doc2;
              }),
          ],
        });
    }

    await setCheckedInputs([]);
    await alert("취소되었습니다");
  };
  const [listToMove, setListToMove] = useState([]);
  const [moveToOrderNumber, setMoveToOrderNumber] = useState([]);

  useEffect(() => {
    setListToMove(
      [
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
      ].reduce((a, c, i, t) => {
        if (orderNumberSelect.length > 0) {
          c.orderNumber = orderNumberSelect.trim();
          a.push(c);
          return a;
        }
        // console.log("t",t)
        return t;
      }, [])
    );
  }, [checkedInputs, orderNumberSelect, orders]);

  useEffect(() => {
    setMoveToOrderNumber([
      ...new Set(listToMove.map(li => li.orderNumber.trim())),
    ]);
  }, [listToMove]);

  const moveItems = async e => {
    e.preventDefault();
    if (orderNumberSelect.length <= 0) {
      return alert("Please select the correct order number");
    }

    // 저장
    await db
      .collection("orders")
      .doc("b2b")
      .collection("b2borders")
      .doc(
        orders.find(arr => arr.data.orderNumber.trim() === orderNumberSelect).id
      )
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
            .find(arr => arr.data.orderNumber.trim() === orderNumberSelect)
            .data.list.filter(
              li => !checkedInputs.includes(li.childOrderNumber.trim())
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
    setCheckedInputs([]);
    alert("이동되었습니다.");
    history.replace(
      `/orderdetail/${
        orders.find(arr => arr.data.orderNumber.trim() === orderNumberSelect).id
      }`
    );
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
        .filter(
          arr3 =>
            arr3.moved === false &&
            arr3.canceled === false &&
            arr3.shipped === false
        )
    );
  }, [orders, uid, customerId, accounts]);

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
                  <div key={index}>{(doc * 100).toFixed(0)} %</div>
                ))}
              </div>

              <div className="grid grid-cols-7 bg-gray-600 text-center text-gray-100 rounded-sm px-1">
                {Object.keys(
                  accounts.find(acc => acc.data.uid === uid)?.data.dcAmount
                ).map((doc, index) => (
                  <div key={index}>{doc}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 text-center border-b px-1 border-l border-r text-sm">
                {Object.values(
                  accounts.find(acc => acc.data.uid === uid)?.data.dcAmount
                ).map((doc, index) => (
                  <div key={index}>{doc.toFixed(0)} </div>
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
        <div className="w-full mb-12 flex flex-col items-center">
          <div
            className="text-center text-md bg-gray-800 
          rounded text-gray-100 mb-5 mt-5 w-1/3 py-1"
          >
            CREDIT
          </div>
          <div className="grid grid-cols-2 text-center mb-3">
            <div>CREDIT :</div>
            <div>
              {Math.round(user.data.credit).toLocaleString("ko-KR")}{" "}
              {user.data.currency}
            </div>
          </div>
          <div className="grid grid-cols-2 mb-6">
            <Modal
              open={modalOpen}
              close={closeModal}
              header={"CREDIT DETAILS"}
            >
              <CreditDetails creditDetails={creditDetails} reset={reset} />
            </Modal>

            <select
              name="creditType"
              className="border p-1 m-1"
              value={creditType}
              onChange={onChange}
            >
              <option value="Store-Credit">Store-Credit</option>
              <option value="Shipped-Amount">Shipped-Amount</option>
              <option value="Refund">Refund</option>
              <option value="Compensate">Compensate</option>
              <option value="Adjustment">Adjustment</option>
            </select>
            <input
              type="number"
              name="handleCredit"
              value={handleCredit}
              onChange={onChange}
              placeholder="Amount"
              className="border p-1 m-1 outline-none"
              onKeyPress={e => {
                if (e.key === "Enter") {
                  saveCredit();
                  return false;
                }
              }}
            />
          </div>
          <button
            className="bg-gray-600 p-1 rounded text-gray-200 m-2 w-52"
            onClick={openModal}
          >
            Credit Details
          </button>
        </div>
        <div className="w-full mb-12 flex flex-col items-center text-sm">
          <div className="w-full text-center">상품별 수량 합계</div>
          <div
            className="grid grid-cols-12 text-center bg-gray-800 
                      rounded-sm text-gray-100 text-sm py-1 w-2/3"
          >
            <div className="col-span-2">바코드</div>
            <div className="col-span-2">SKU</div>
            <div className="col-span-7">앨범명</div>
            <div className="col-span-1">수량</div>
          </div>

          {unshipped &&
            [
              ...new Set(
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
                  .map(li => li.title)
              ),
            ]
              .reduce((acc, cur) => {
                acc.push(
                  unshipped
                    .filter(li => li.title.trim() === cur.trim())
                    .reduce(
                      (a, c) => {
                        return {
                          title: c.title.trim(),
                          quan: Number(a.quan) + Number(c.quan),
                          barcode: c.barcode,
                          sku: c.sku,
                        };
                      },
                      { title: "", quan: 0, barcode: "", sku: "" }
                    )
                );
                return acc;
              }, [])
              .map((li, i) => (
                <div key={i} className="grid grid-cols-12 w-2/3 border py-1">
                  <div className="col-span-2 text-center">{li.barcode}</div>
                  <div className="col-span-2 text-center">{li.sku}</div>
                  <div className="col-span-7">{li.title}</div>
                  <div className="col-span-1 text-center">{li.quan} EA</div>
                </div>
              ))}
        </div>
        <div className="w-full text-center">상품종류</div>
        <div
          className="grid grid-cols-28 text-center bg-gray-800 
        rounded-sm text-gray-100 text-sm py-1"
        >
          <div className="col-span-1"></div>
          <div className="col-span-2">
            No.{" "}
            <Link
              to={{
                pathname: "/pickuplist",
                state: checkedInputs,
                orders,
              }}
            >
              <AssignmentIcon />
            </Link>
          </div>
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
      <div className="w-11/12 my-5 flex justify-between">
        <div>
          <button
            onClick={cancelItems}
            className="bg-gray-800 text-gray-200 px-2 py-1 ml-5 rounded-sm"
          >
            CANCEL{" "}
          </button>
        </div>
        <div>
          <select
            name="orderNumberSelect"
            value={orderNumberSelect}
            onChange={e => setorderNumberSelect(e.target.value)}
            // onChange={onChange}
            className="p-1 border"
          >
            {/* 해당 주문자의 미발송 주문 가져와서 이동 */}
            <option>NO.</option>
            {orders
              .filter(
                doc =>
                  doc.data.orderState !== "shipped" &&
                  doc.data.customer === customerId &&
                  !moveToOrderNumber.includes(doc.data.orderNumber.trim())
              )
              .map((doc, index) => (
                <option key={index} value={doc.data.orderNumber.trim()}>
                  {doc.data.orderNumber.trim()}
                </option>
              ))}
            {/* {moveToOrderNumber.map((doc, i) => 
                <option key={i} value={doc}>
                    {doc}
                </option>)} */}
          </select>
          {console.log("orderNumberSelect", orderNumberSelect)}

          <button
            onClick={moveItems}
            className="bg-gray-800 text-gray-200 px-2 py-1 ml-1 rounded-sm"
          >
            MOVE
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnshippedDetail;
