import React, { useContext, useEffect, useState } from "react";
import firebase from "firebase";
import { useHistory } from "react-router";
import { InitDataContext } from "../../../App";
import { db } from "../../../firebase";
import OrderDetailRow from "./OrderDetailRow";
import ShippingList from "../shipping/ShippingList";
import useInputs from "../../../hooks/useInput";
import CancelIcon from "@material-ui/icons/Cancel";
import UndoIcon from "@material-ui/icons/Undo";
import LocalAirportIcon from "@material-ui/icons/LocalAirport";
import { useCallback } from "react";
import Modal from "../../modal/Modal";
import CreditDetails from "../customer/utils/CreditDetails";
import AddDetailRow from "./AddDetailRow";

const OrderDetail = ({ match }) => {
  const today = new Date();
  const { id } = match.params;
  const state = useContext(InitDataContext);
  const { orders, shippings, exchangeRate, dhlShippingFee, accounts } = state;
  const { z } = dhlShippingFee;
  const order = orders.find(order => order.id === id);
  const user = accounts.find(account => account.id === order.data.customer);
  const { creditDetails } = user.data;

  const shipping = shippings.filter(arr => arr.data.orderId === id);
  const history = useHistory();
  const [form, onChange, reset, credit_reset] = useInputs({
    orderState: order?.data.orderState,
    paymentMethod: order?.data.paymentMethod,
    shippingType: order?.data.shippingType,
    recipientEmail: order?.data.recipientEmail,
    recipientPhoneNumber: order?.data.recipientPhoneNumber,
    street: order?.data.street,
    city: order?.data.city,
    states: order?.data.states,
    country: order?.data.country,
    zipcode: order?.data.zipcode,
    recipient: order?.data.recipient,
    shippingMessage: order?.data.shippingMessage,
    orderNumberSelect: "",
    memo: order?.data.memo,
    taxId: order?.data.taxId,
    companyName: order?.data.companyName,
    address: order?.data.address,
    detailAddress: order?.data.detailAddress,
    // 크레딧
    handleCredit: 0,
    creditType: "Store-Credit",
  });
  const {
    orderState,
    paymentMethod,
    shippingType,
    recipientEmail,
    recipientPhoneNumber,
    street,
    city,
    states,
    country,
    zipcode,
    recipient,
    shippingMessage,
    orderNumberSelect,
    taxId,
    memo,
    companyName,
    address,
    detailAddress,
    handleCredit,
    creditType,
  } = form;

  const krwComma = (num, cur) => {
    let calNum;
    cur === "KRW"
      ? (calNum = Number(num.toString().replaceAll(",", ""))
          .toFixed(0)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ","))
      : (calNum = Number(num.toString().replaceAll(",", ""))
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ","));

    return calNum;
  };

  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  const saveDetails = () => {
    db.collection("orders").doc("b2b").collection("b2borders").doc(id).update({
      orderState,
      paymentMethod,
      shippingType,
      recipientEmail,
      recipientPhoneNumber,
      street,
      city,
      states,
      country,
      zipcode,
      recipient,
      shippingMessage,
      taxId,
      memo,
      companyName,
      address,
      detailAddress,
    });
    alert("저장 완료");
  };

  // 트래킹넘버 / textarea
  const [trackingNumber, setTrackingNumber] = useState([]);
  const handleTrackingNumber = e => {
    setTrackingNumber(e.target.value);
  };

  const [checkedInputs, setCheckedInputs] = useState([]);

  const changeHandler = (checked, id) => {
    if (checked) {
      setCheckedInputs([...checkedInputs, id]);
    } else {
      // 체크 해제
      setCheckedInputs(checkedInputs.filter(el => el !== id));
    }
  };

  const idArray = [];
  const handleAllCheck = checked => {
    if (
      checkedInputs.length !==
      order?.data?.list.filter(
        li =>
          li.moved === false && li.canceled === false && li.shipped === false
      ).length
    ) {
      // 전체 체크 박스가 체크 되면 id를 가진 모든 elements를 배열에 넣어주어서,
      // 전체 체크 박스 체크

      order?.data?.list
        .filter(
          li =>
            li.moved === false && li.canceled === false && li.shipped === false
        )
        .forEach(el => idArray.push(el.childOrderNumber));
      setCheckedInputs(idArray);
    }
    // 반대의 경우 전체 체크 박스 체크 삭제
    else if (
      checkedInputs.length ===
      order?.data?.list.filter(
        li =>
          li.moved === false && li.canceled === false && li.shipped === false
      ).length
    ) {
      setCheckedInputs([]);
    }
  };
  // 배송국가 전체 for select option
  const countries = [].concat(
    ...z
      ?.map(zo => Object.values(zo).map(co => co.country))
      .map(doc => [].concat(...doc))
  );
  // 전체상품

  // 운임, 총무게
  const totalWeight =
    order.data.list &&
    order.data.list
      .filter(
        list =>
          list.canceled === false &&
          list.moved === false &&
          list.shipped === false
      )
      .reduce((i, c) => {
        return i + c.weight * c.quan;
      }, 0) / 1000;
  // 체크된 상품 총무게
  const checkedWeight =
    order.data.list
      .filter(item => checkedInputs.includes(item.childOrderNumber))
      .filter(
        list =>
          list.canceled === false &&
          list.moved === false &&
          list.shipped === false
      )
      .reduce((i, c) => {
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

  let num2 = 1;
  for (let i = 1; i < 31; i++) {
    let j = i * 0.5;
    if (j > checkedWeight) {
      break;
    }
    num2++;
  }

  // 어느나라에 걸리는지
  const zone =
    z && country.length > 0 && country !== "korea"
      ? Object.keys(
          z.find(doc =>
            Object.values(doc).find(asd => asd.country.includes(country))
          )
        )
      : ["zone1"];
  // 배송비 가격
  const [preFee, setPreFee] = useState(order?.data.shippingFee);
  const handleFee = e => {
    setPreFee(Number(e.target.value));
  };

  // 재계산 배송비
  const fee =
    z &&
    country.length > 0 &&
    totalWeight < 30 &&
    totalWeight > 0 &&
    country !== "korea"
      ? Number(
          Object.values(z.find(doc => Object.keys(doc)[0] === zone[0]))[0]
            .fee[num - 1].split(",")
            .join("")
        ) / exchangeRate[order.data.currency]
      : totalWeight === 0
      ? 0
      : country === "korea"
      ? ((parseInt(totalWeight / 15) + 1) * 4500) /
        exchangeRate[order.data.currency]
      : (totalWeight * order.data.shippingRate[shippingType]) /
        exchangeRate[order.data.currency];

  // 입력 배송비
  const [inputedFee, setInputedFee] = useState("");
  const [checkedRadio, setCheckedRadio] = useState("cal");

  const [calFee, setCalFee] = useState("");
  const [inputWeight, setInputWeight] = useState(0);
  let num3 = 1;
  for (let i = 1; i < 31; i++) {
    let j = i * 0.5;
    if (j > inputWeight) {
      break;
    }
    num3++;
  }
  const handleCalFee = e => {
    setInputWeight(Number(Number(e.target.value)));
  };

  // 체크된 상품 배송비
  const [checkedItemsFee, setCheckedItemsFee] = useState("");
  const handleCheckedItemFee = e => {
    setCheckedItemsFee(Number(e.target.value));
  };

  // 상품 total price
  const [preTotalPrice, setPreTotalPrice] = useState(order?.data.totalPrice);
  const handlePreTotalPrice = e => {
    setPreTotalPrice(Number(e.target.value));
  };

  // 재계산 totalPrice
  const totalPrice = order.data.list
    .filter(
      list =>
        list.canceled === false &&
        list.moved === false &&
        list.shipped === false
    )
    .reduce((i, c) => {
      return i + c.price * c.quan;
    }, 0);

  // 체크된 상품 가격
  const [checkedItemPrice, setCheckedItemPrice] = useState("");
  const handleCheckedItemPrice = e => {
    setCheckedItemPrice(Number(e.target.value));
  };

  // amount price
  const [preAmountPrice, setPreAmountPrice] = useState(order?.data.amountPrice);
  const handlePreAmountPrice = e => {
    setPreAmountPrice(Number(e.target.value));
  };

  // 재계산 amount
  const amountPrice = totalPrice + fee;
  // 체크된 아이템 더하기
  const plusCheckedItem = price => {
    return krwComma(
      Number(checkedItemPrice.replaceAll(",", "")) +
        Number(price.toString().replaceAll(",", "")),
      order.data.currency
    );
  };

  // 체크된 아이템 총액
  const checkItemAmountPrice =
    checkedRadio === "cal"
      ? inputWeight > 0
        ? plusCheckedItem(calFee)
        : plusCheckedItem(checkedItemsFee)
      : plusCheckedItem(inputedFee);

  // 재계산 버튼
  const saveRecal = () => {
    setPreTotalPrice(totalPrice);
    setPreFee(fee);
    setPreAmountPrice(amountPrice);
    db.collection("orders")
      .doc("b2b")
      .collection("b2borders")
      .doc(id)
      .update({
        shippingType,
        country,
        shippingFee: Number(fee.toFixed(2)),
        amountPrice: Number(amountPrice.toFixed(2)),
        totalPrice: Number(totalPrice.toFixed(2)),
      });
    alert("재계산 완료");
  };
  // 직접 입력 수정
  const savePre = () => {
    db.collection("orders")
      .doc("b2b")
      .collection("b2borders")
      .doc(id)
      .update({
        shippingType,
        country,
        shippingFee: Number(preFee.toFixed(2)),
        amountPrice: Number(preAmountPrice.toFixed(2)),
        totalPrice: Number(preTotalPrice.toFixed(2)),
      });
    alert("직접 수정 완료");
  };
  // console.log(orderNumberSelect)
  const [listToMove, setListToMove] = useState([]);
  useEffect(() => {
    setListToMove(
      [
        ...checkedInputs.map(doc =>
          order.data.list.find(arr => arr.childOrderNumber === doc)
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
  }, [checkedInputs, orderNumberSelect]);
  // console.log(listToMove)

  // 주문간 상품 이동
  const moveList = async e => {
    e.preventDefault();
    if (orderNumberSelect.length <= 0) {
      return alert("Please select the correct order number");
    }

    await db
      .collection("orders")
      .doc("b2b")
      .collection("b2borders")
      .doc(orders.find(arr => arr.data.orderNumber === orderNumberSelect).id)
      .update({
        list: [
          ...listToMove,
          ...orders.find(arr => arr.data.orderNumber === orderNumberSelect).data
            .list,
        ],
      });
    // 기존엔 이동된 상품들은 기존 주문에서 지움 -> moved true로 바꿔서 취소선 그어지고 체크박스 못쓰게
    await db
      .collection("orders")
      .doc("b2b")
      .collection("b2borders")
      .doc(id)
      .update({
        list: [
          ...order.data.list.filter(
            item => !checkedInputs.includes(item.childOrderNumber)
          ),
          ...checkedInputs
            .map(doc =>
              order.data.list.find(arr => arr.childOrderNumber === doc)
            )
            .map(doc2 => {
              doc2.moveTo = orderNumberSelect;
              doc2.moved = true;
              return doc2;
            }),
        ],
      });

    await setCheckedInputs([]);
    await alert("이동되었습니다");
    history.replace(
      `/orderdetail/${
        orders.find(arr => arr.data.orderNumber === orderNumberSelect).id
      }`
    );
    // await reset();
  };
  // 부분 최소
  const makeCancel = async () => {
    await db
      .collection("orders")
      .doc("b2b")
      .collection("b2borders")
      .doc(id)
      .update({
        list: [
          ...order.data.list.filter(
            item => !checkedInputs.includes(item.childOrderNumber)
          ),
          ...checkedInputs
            .map(doc =>
              order.data.list.find(arr => arr.childOrderNumber === doc)
            )
            .map(doc2 => {
              doc2.canceled = true;
              return doc2;
            }),
        ],
      });
    // await reset();
    await setCheckedInputs([]);
    await alert("취소되었습니다");
  };

  // shipping number 만들기
  // order number를 위한 0 포함된 숫자 만드는 함수
  const addZeros = (n, digits) => {
    let zero = "";
    n = n.toString();
    if (n.length < digits) {
      for (var i = 0; i < digits - n.length; i++) zero += "0";
    }
    return zero + n;
  };

  const forShippingNumber = shippings
    .filter(ship => ship.data.customer === order.data.customer)
    .filter(
      ship =>
        new Date(ship.data.shippedDate.seconds * 1000)
          .toISOString()
          .substring(0, 10) === new Date(today).toISOString().substring(0, 10)
    )
    ? shippings
        .filter(ship => ship.data.customer === order.data.customer)
        .filter(
          ship =>
            new Date(ship.data.shippedDate.seconds * 1000)
              .toISOString()
              .substring(0, 10) ===
            new Date(today).toISOString().substring(0, 10)
        ).length
    : 0;

  const makeShipping = async e => {
    e.preventDefault();
    if (trackingNumber.length < 1) {
      alert("Tracking Number를 입력해 주세요.");
    } else if (checkedInputs.length === 0) {
      alert("발송할 상품을 선택해 주세요.");
    } else {
      await db
        .collection("shipping")
        .doc()
        .set({
          orderId: id,
          orderNumber: order.data.orderNumber,
          currency: order.data.currency,
          shippingNumber: `${order.data.orderNumber
            .replaceAll("-", "")
            .replaceAll(" ", "")}-${addZeros(forShippingNumber, 3)}`,
          shippedDate: new Date(),
          shippingType,
          customer: order.data.customer,
          orderCreatedAt: order.data.createdAt,
          recipientEmail,
          recipientPhoneNumber,
          street,
          city,
          states,
          country,
          zipcode,
          recipient,
          shippingMessage,
          shippingRate: order.data.shippingRate,
          list: order.data.list.filter(item =>
            checkedInputs.includes(item.childOrderNumber)
          ),
          checkedItemsFee:
            checkedRadio === "cal"
              ? inputWeight > 0
                ? calFee
                : checkedItemsFee
              : inputedFee,
          checkedItemPrice,
          checkItemAmountPrice,
          trackingNumber,
          inputWeight,
          taxId,
          companyName,
          nickName: order.data.nickName || "",
        });
      await db
        .collection("accounts")
        .doc(order.data.customer)
        .update({
          credit:
            user.data.credit - Number(checkItemAmountPrice.replaceAll(",", "")),
          creditDetails: firebase.firestore.FieldValue.arrayUnion({
            type: "Shipped Amount",
            currency: user.data.currency,
            amount: Number(checkItemAmountPrice.replaceAll(",", "")),
            date: new Date(),
            totalAmount:
              Number(user.data.credit) -
              Number(checkItemAmountPrice.replaceAll(",", "")),
          }),
        });
      await db
        .collection("orders")
        .doc("b2b")
        .collection("b2borders")
        .doc(id)
        .update({
          list: [
            ...order.data.list.filter(
              item => !checkedInputs.includes(item.childOrderNumber)
            ),
            ...checkedInputs
              .map(doc =>
                order.data.list.find(arr => arr.childOrderNumber === doc)
              )
              .map(doc2 => {
                doc2.shipped = true;
                return doc2;
              }),
          ],
        });

      await setInputWeight("");
      await setTrackingNumber([]);
      await setCheckedInputs([]);
    }
  };

  const ItemPrice = useCallback(async () => {
    setCheckedItemPrice(() =>
      krwComma(
        Number(
          order.data.list
            .filter(item => checkedInputs.includes(item.childOrderNumber))
            .filter(
              list =>
                list.canceled === false &&
                list.moved === false &&
                list.shipped === false
            )
            .reduce((i, c) => {
              return i + c.price * c.quan;
            }, 0)
        ),
        order.data.currency
      )
    );
  }, [checkedInputs, order.data.list]);

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

  useEffect(() => {
    ItemPrice();

    setCheckedItemsFee(() =>
      z &&
      country.length > 0 &&
      checkedWeight < 30 &&
      checkedWeight > 0 &&
      country !== "korea"
        ? krwComma(
            Number(
              Object.values(z.find(doc => Object.keys(doc)[0] === zone[0]))[0]
                .fee[num - 1].split(",")
                .join("")
            ) / exchangeRate[order.data.currency],
            order.data.currency
          )
        : totalWeight === 0
        ? 0
        : country === "korea"
        ? krwComma(
            ((parseInt(checkedWeight / 15) + 1) * 4500) /
              exchangeRate[order.data.currency],
            order.data.currency
          )
        : krwComma(
            (checkedWeight * order.data.shippingRate[shippingType]) /
              exchangeRate[order.data.currency],
            order.data.currency
          )
    );

    setCalFee(
      z &&
        country.length > 0 &&
        inputWeight < 30 &&
        inputWeight > 0 &&
        country !== "korea"
        ? krwComma(
            Number(
              Object.values(z.find(doc => Object.keys(doc)[0] === zone[0]))[0]
                .fee[num3 - 1].split(",")
                .join("")
            ) / exchangeRate[order.data.currency],
            order.data.currency
          )
        : inputWeight === 0
        ? 0
        : country === "korea"
        ? krwComma(
            ((parseInt(inputWeight / 15) + 1) * 4500) /
              exchangeRate[order.data.currency],
            order.data.currency
          )
        : krwComma(
            (inputWeight * order.data.shippingRate[shippingType]) /
              exchangeRate[order.data.currency],
            order.data.currency
          )
    );
  }, [
    inputWeight,
    z,
    country.length,
    checkedWeight,
    zone,
    num2,
    num3,
    order.data.currency,
    exchangeRate,
    order.data.shippingRate,
    shippingType,
    ItemPrice,
  ]);
  return (
    // dep-1
    <div className="w-full h-full flex justify-center">
      {/* dep-2 */}
      <div className="w-11/12 flex-col mt-20">
        {/* dep-3-1 */}
        <div
          className="text-center text-md bg-gray-800 
        rounded-sm text-gray-100 mb-5 w-full"
        >
          Order Details{" "}
        </div>

        {user && order && (
          <>
            <div className="flex flex-row justify-evenly">
              {/* 주문내용 확인 */}
              <div
                className="flex-col mb-10 flex space-y-2 text-sm w-7/12
                "
              >
                <div className="grid grid-cols-2 items-center h-8">
                  <div className="text-right pr-5">No.</div>
                  <div>{order.data.orderNumber}</div>
                </div>
                <div className="grid grid-cols-2 items-center h-8">
                  <div className="text-right pr-5">Status</div>
                  <select
                    name="orderState"
                    value={orderState}
                    onChange={onChange}
                    className="border p-1"
                  >
                    <option value="Order">Order</option>
                    <option value="Pre-Order">Pre Order</option>
                    <option value="Special-Order">Special Order</option>
                    <option value="Confirmed-Order">Confirmed Order</option>
                    <option value="Ready-to-ship">Ready to ship</option>
                    <option value="Patially-shipped">Patially shipped</option>
                    <option value="Shipped">Shipped</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 items-center h-8">
                  <div className="text-right pr-5">Email</div>
                  <div>{order.data.customer}</div>
                </div>
                <div className="grid grid-cols-2 items-center h-8">
                  <div className="text-right pr-5">Date</div>
                  {new Date(order.data.createdAt.toDate()).toLocaleString()}
                </div>
                <div className="grid grid-cols-2 items-center h-8">
                  <div className="text-right pr-5">PaymentMethod</div>

                  <select
                    name="paymentMethod"
                    value={paymentMethod}
                    onChange={onChange}
                    className="border p-1"
                  >
                    <option value="credit">transfer(credit)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 items-center h-8">
                  <div className="text-right pr-5">ShippingType</div>
                  <select
                    name="shippingType"
                    value={shippingType}
                    onChange={onChange}
                    className="border p-1"
                  >
                    <option value="dhl">DHL</option>
                    <option value="EMS">EMS</option>
                    <option value="UMAC(PH)">UMAC(PH)</option>
                    <option value="CJ Logisticd">CJ Logisticd</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 h-8 items-center">
                  <div className="text-right pr-5">Phone Number</div>
                  {user?.data?.phoneNumber}
                </div>
                <div className="grid grid-cols-2 h-30">
                  <div className="text-right pr-5">Staff Memo</div>
                  <textarea
                    rows="5"
                    cols="19"
                    name="memo"
                    value={memo}
                    onChange={onChange}
                    className="border p-1 pl-2"
                  />{" "}
                </div>
                {/* 할인율 */}
                <div className="grid grid-cols-1 ">
                  <div className="text-center my-1 font-semibold">DC Rates</div>
                  <div
                    className="grid grid-cols-7 bg-gray-600 text-center 
                  text-xs text-gray-100 rounded-sm px-1"
                  >
                    {Object.keys(order?.data.dcRates)
                      .sort()
                      .map((doc, index) => (
                        <div key={index}>{doc.toUpperCase()}</div>
                      ))}
                  </div>
                  <div className="grid grid-cols-7 text-center border-b px-1 border-l border-r text-xs">
                    {Object.keys(order?.data.dcRates)
                      .sort()
                      .map((doc, index) => (
                        <div key={index}>
                          {Number((order?.data.dcRates[doc] * 100).toFixed(2))}{" "}
                          %
                        </div>
                      ))}
                  </div>
                  <div className="grid grid-cols-7 text-center border-b px-1 border-l border-r text-xs">
                    {Object.keys(order?.data.dcAmount)
                      .sort()
                      .map((doc, index) => (
                        <div key={index}>
                          {Number((order?.data.dcAmount[doc]).toFixed(2))}{" "}
                          {order?.data.currency}
                        </div>
                      ))}
                  </div>
                  <div className="text-center my-1 font-semibold mt-3">
                    Shipping Fee
                  </div>
                  <div
                    className="grid grid-cols-6 bg-gray-600 text-center 
                  text-xs text-gray-100 rounded-sm px-1"
                  >
                    {" "}
                    {Object.keys(order?.data.shippingRate).map((doc, index) => (
                      <div key={index}>{doc.toUpperCase()}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-6 text-center border-b px-1 border-l border-r text-sm">
                    {Object.values(order?.data.shippingRate).map(
                      (doc, index) => (
                        <div key={index}>{doc} 원</div>
                      )
                    )}
                  </div>
                </div>
              </div>
              {/* 수령인 파트 */}

              <div
                className="flex-col mb-10 flex space-y-2 text-sm 
               w-7/12 items-center"
              >
                <div className="grid grid-cols-2 w-5/6 items-center">
                  <div className="text-right pr-5">Company Name</div>
                  <input
                    name="companyName"
                    value={companyName}
                    onChange={onChange}
                    className="border p-1 pl-2"
                  />{" "}
                </div>
                <div className="grid grid-cols-2 w-5/6 items-center">
                  <div className="text-right pr-5">Tax Id</div>
                  <input
                    name="taxId"
                    value={taxId}
                    onChange={onChange}
                    className="border p-1 pl-2"
                    placeholder="Optional"
                  />{" "}
                </div>
                <div className="grid grid-cols-2 w-5/6 items-center">
                  <div className="text-right pr-5">Recipient</div>
                  <input
                    name="recipient"
                    value={recipient}
                    onChange={onChange}
                    className="border p-1 pl-2"
                  />{" "}
                </div>
                <div className="grid grid-cols-2 w-5/6 items-center">
                  <div className="text-right pr-5">Recipient Email</div>
                  <input
                    name="recipientEmail"
                    value={recipientEmail}
                    onChange={onChange}
                    className="border p-1 pl-2"
                  />{" "}
                </div>
                <div className="grid grid-cols-2 w-5/6 items-center">
                  <div className="text-right pr-5">Recipient PhoneNumber</div>
                  <input
                    name="recipientPhoneNumber"
                    value={recipientPhoneNumber}
                    onChange={onChange}
                    className="border p-1 pl-2"
                  />{" "}
                </div>
                {country === "korea" && (
                  <>
                    <div className="grid grid-cols-2 w-5/6 items-center">
                      <div className="text-right pr-5">Address</div>
                      <input
                        name="address"
                        value={address}
                        onChange={onChange}
                        className="border p-1 pl-2"
                      />{" "}
                    </div>
                    <div className="grid grid-cols-2 w-5/6 items-center">
                      <div className="text-right pr-5">Detail Address</div>
                      <input
                        name="detailAddress"
                        value={detailAddress}
                        onChange={onChange}
                        className="border p-1 pl-2"
                      />{" "}
                    </div>
                    <div className="grid grid-cols-2 w-5/6 items-center">
                      <div className="text-right pr-5">Zip code</div>
                      <input
                        name="zipcode"
                        value={zipcode}
                        onChange={onChange}
                        className="border p-1 pl-2"
                      />{" "}
                    </div>
                    <div className="grid grid-cols-2 w-5/6 items-center">
                      <div className="text-right pr-5">Shipping Message</div>
                      <textarea
                        rows="7"
                        cols="19"
                        name="shippingMessage"
                        value={shippingMessage}
                        onChange={onChange}
                        className="border p-1 pl-2"
                      />{" "}
                    </div>
                  </>
                )}
                {country !== "korea" && (
                  <>
                    <div className="grid grid-cols-2 w-5/6 items-center">
                      <div className="text-right pr-5">Street</div>
                      <input
                        name="street"
                        value={street}
                        onChange={onChange}
                        className="border p-1 pl-2"
                      />{" "}
                    </div>
                    <div className="grid grid-cols-2 w-5/6 items-center">
                      <div className="text-right pr-5">City</div>
                      <input
                        name="city"
                        value={city}
                        onChange={onChange}
                        className="border p-1 pl-2"
                      />{" "}
                    </div>
                    <div className="grid grid-cols-2 w-5/6 items-center">
                      <div className="text-right pr-5">State</div>
                      <input
                        name="states"
                        value={states}
                        onChange={onChange}
                        className="border p-1 pl-2"
                      />{" "}
                    </div>
                    <div className="grid grid-cols-2 w-5/6 items-center">
                      <div className="text-right pr-5">Country</div>
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
                    <div className="grid grid-cols-2 w-5/6 items-center">
                      <div className="text-right pr-5">Zipcode</div>
                      <input
                        name="zipcode"
                        value={zipcode}
                        onChange={onChange}
                        className="border p-1 pl-2"
                      />{" "}
                    </div>
                    <div className="grid grid-cols-2 w-5/6 items-center">
                      <div className="text-right pr-5">Shipping Message</div>
                      <textarea
                        rows="7"
                        cols="19"
                        name="shippingMessage"
                        value={shippingMessage}
                        onChange={onChange}
                        className="border p-1 pl-2"
                      />{" "}
                    </div>
                  </>
                )}

                <button
                  onClick={saveDetails}
                  className="bg-gray-800 rounded text-gray-200 w-1/3 items-center py-2"
                >
                  SAVE
                </button>
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
            {/* // dep-3-2 */}
            <div className="w-full text-center mb-1 font-semibold">
              Ordered Items
            </div>
            <div className="flex flex-col items-end text-xs mb-3 rounded-md">
              <div className="bg-red-100 w-44 pl-3 rounded-md mb-1">
                &nbsp;&nbsp;&nbsp;&nbsp;: Items not yet released{" "}
              </div>
              <div className="bg-gray-100 w-44 pl-3 rounded-md  mb-1">
                <CancelIcon style={{ fontSize: "small" }} />: canceled item
              </div>
              <div className="bg-green-100 w-44 pl-3 rounded-md  mb-1">
                <UndoIcon style={{ fontSize: "small" }} />: moved item
              </div>
              <div className="bg-blue-100 w-44 pl-3 rounded-md  mb-1">
                <LocalAirportIcon style={{ fontSize: "small" }} />: shipped item
              </div>
            </div>
            {/* dep-3-3 */}
            <div
              className="grid grid-cols-28 text-center bg-gray-800
            text-sm font-semibold rounded-sm text-gray-100"
            >
              <div>
                <input
                  type="checkbox"
                  className=" ml-2"
                  onChange={e => handleAllCheck(e.currentTarget.checked)}
                  checked={
                    checkedInputs.length ===
                    order?.data?.list.filter(
                      li =>
                        li.moved === false &&
                        li.canceled === false &&
                        li.shipped === false
                    ).length
                      ? true
                      : false
                  }
                />
              </div>
              <div className="col-span-3">No.</div>
              <div className="col-span-2">DATE</div>
              <div className="col-span-2">RELEASE</div>
              <div className="col-span-10">TITLE</div>
              <div className="col-span-2">PRICE</div>
              <div className="col-span-2">EA</div>
              <div className="col-span-2">WEIGHT</div>

              <div className="col-span-2">AMOUNT</div>
              <div className="col-span-2">MEMO</div>
            </div>
            {/* dep-3-4 */}
            {order.data.list
              .filter(list => new Date(list.relDate.toDate()) < new Date())
              .sort()
              .map((doc, i) => (
                <OrderDetailRow
                  key={i}
                  id={doc.childOrderNumber}
                  title={doc.title}
                  createdAt={new Date(
                    order.data.createdAt.toDate()
                  ).toLocaleDateString()}
                  relDate={doc.relDate}
                  price={doc.price}
                  quan={doc.quan}
                  weight={doc.weight}
                  totalWeight={doc.weight * doc.quan}
                  dcRate={doc.dcRate}
                  changeHandler={changeHandler}
                  checkedInputs={checkedInputs}
                  order={order}
                  aList={doc}
                />
              ))}
            {order.data.list
              .filter(list => new Date(list.relDate.toDate()) >= new Date())
              .sort()
              .map((doc, i) => (
                <OrderDetailRow
                  key={i}
                  id={doc.childOrderNumber}
                  title={doc.title}
                  createdAt={new Date(
                    order.data.createdAt.toDate()
                  ).toLocaleDateString()}
                  relDate={doc.relDate}
                  price={doc.price}
                  quan={doc.quan}
                  weight={doc.weight}
                  totalWeight={doc.totalWeight}
                  dcRate={doc.dcRate}
                  changeHandler={changeHandler}
                  checkedInputs={checkedInputs}
                  order={order}
                  aList={doc}
                />
              ))}
            <AddDetailRow order={order} />
            {/* dep-3-5 */}
            <div className="text-center items-center justify-between flex flex-row mt-6 text-sm">
              <div>
                <button
                  onClick={makeCancel}
                  className="bg-gray-800 text-gray-200 px-2 py-1 ml-5 rounded-sm"
                >
                  CANCEL{" "}
                </button>
              </div>
              <div>
                <select
                  name="orderNumberSelect"
                  value={orderNumberSelect}
                  onChange={onChange}
                  className="p-1 border"
                >
                  {/* 해당 주문자의 미발송 주문 가져와서 이동 */}
                  <option value="">NO.</option>
                  {orders
                    .filter(
                      doc =>
                        doc.data.customer === order.data.customer &&
                        doc.data.orderNumber !== order.data.orderNumber
                      // &&
                      // (doc.data.orderState === "Order" ||
                      //   doc.data.orderState === "Pre-Order" ||
                      //   doc.data.orderState === "Special-Order")
                    )
                    .map((doc, index) => (
                      <option key={index} value={doc.data.orderNumber}>
                        {doc.data.orderNumber}
                      </option>
                    ))}
                </select>
                <button
                  onClick={moveList}
                  className="bg-gray-800 text-gray-200 px-2 py-1 ml-1 rounded-sm"
                >
                  MOVE
                </button>
              </div>
            </div>

            {/* dep-3-6 */}

            <div className="flex flex-row justify-between ">
              {/* ship 하는(체크됨) 상품들 가격들 */}
              <div className="text-right flex flex-col items-center mt-6 text-lg w-1/2">
                <div className="grid grid-cols-2 mb-3 w-full">
                  <div className="w-full pr-2">PRICE</div>
                  <div className="flex flex-row w-full">
                    <div className="border flex flex-row bg-white text-sm p-1 w-2/3">
                      <input
                        type="text"
                        value={checkedItemPrice}
                        onChange={handleCheckedItemPrice}
                        className="w-full text-center outline-none text-sm"
                      />
                      {order?.data.currency}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 mb-3 items-center w-full">
                  <div className="w-full pr-2">
                    <input
                      className="mr-2"
                      type="radio"
                      value="cal"
                      name="fee"
                      defaultChecked
                      onChange={e => setCheckedRadio(e.target.value)}
                    />
                    계산된 SHIPPING FEE
                  </div>
                  <div className="flex flex-row w-full ">
                    <div
                      className="border flex flex-row bg-white w-2/3
                   items-center justify-end text-sm p-1"
                    >
                      {inputWeight > 0 ? (
                        <input
                          type="text"
                          value={calFee}
                          onChange={handleCalFee}
                          className="w-full text-center outline-none text-sm"
                        />
                      ) : (
                        <input
                          type="text"
                          value={checkedItemsFee}
                          onChange={handleCheckedItemFee}
                          className="w-full text-center outline-none text-sm"
                        />
                      )}
                      {order?.data.currency}
                    </div>
                    <div
                      className="border flex flex-row bg-white w-1/3
                   items-center justify-end text-sm p-1"
                    >
                      <input
                        type="number"
                        value={inputWeight}
                        onChange={handleCalFee}
                        className="w-full text-center outline-none text-sm"
                      />
                      KG
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 mb-3 items-center w-full">
                  <div className="w-full pr-2">
                    <input
                      className="mr-2"
                      type="radio"
                      value="inputed"
                      name="fee"
                      onChange={e => setCheckedRadio(e.target.value)}
                    />
                    입력한 SHIPPING FEE
                  </div>
                  <div className="flex flex-row w-full ">
                    {/* 무게입력시 배송비 계산 */}
                    <div
                      className="border flex flex-row bg-white w-2/3
                   items-center justify-end text-sm p-1"
                    >
                      <input
                        type="text"
                        value={inputedFee}
                        onChange={e =>
                          setInputedFee(
                            krwComma(
                              e.target.value.replaceAll(",", ""),
                              order.data.currency
                            )
                          )
                        }
                        className="w-full text-center outline-none text-sm"
                      />

                      {order?.data.currency}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 w-full items-center">
                  <div className="w-full">AMOUNT</div>
                  <div className="flex flex-row w-full">
                    <div className="pl-10 w-full text-center">
                      {checkItemAmountPrice} {order?.data.currency}
                    </div>
                  </div>
                </div>
                <form
                  className="grid grid-cols-4 w-full mt-3"
                  onSubmit={makeShipping}
                >
                  <textarea
                    required
                    cols="25"
                    rows="5"
                    value={trackingNumber}
                    onChange={handleTrackingNumber}
                    className="col-span-3 ml-20 outline-none border pl-2 text-sm"
                    placeholder="tracking number / 2개 이상은 엔터로 구분 "
                  ></textarea>
                  <button
                    type="submit"
                    onClick={makeShipping}
                    className="bg-gray-800 text-gray-200
                 text-sm rounded-sm h-10 m-auto px-12 "
                  >
                    SHIP
                  </button>
                </form>
                {/* 남아있는 상품 가격 */}
              </div>
              <div className="text-right flex flex-col items-end mt-6 text-lg w-1/2">
                <div className="grid grid-cols-2 mb-3 items-center w-full">
                  <div className="pr-2 w-full text-right">PRICE</div>
                  <div className="flex flex-row items-center justify-end w-full">
                    <div
                      className="border flex flex-row bg-white
                   items-center justify-end text-sm p-1 w-1/2"
                    >
                      <input
                        type="number"
                        value={preTotalPrice}
                        onChange={handlePreTotalPrice}
                        className="w-full text-center outline-none text-sm"
                      />
                      {order?.data.currency}
                    </div>
                    <div className="text-xs w-1/2 text-left">
                      ({totalPrice.toLocaleString("ko-KR")}{" "}
                      {order?.data.currency})
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 mb-3 items-center w-full">
                  <div className="pr-2 w-full text-right">SHIPPING FEE</div>
                  <div className="flex flex-row items-center justify-end w-full">
                    <div
                      className="border flex flex-row bg-white
                   items-center justify-end text-sm p-1 w-1/2 "
                    >
                      <input
                        type="number"
                        value={preFee}
                        onChange={handleFee}
                        className="w-full text-center outline-none text-sm"
                      />
                      {order?.data.currency}
                    </div>
                    <div className="text-xs w-1/2 text-left">
                      ({fee.toLocaleString("ko-KR")} {order?.data.currency})
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 mb-3 items-center w-full">
                  <div className="pr-2 w-full text-right">AMOUNT</div>
                  <div className="flex flex-row items-center justify-end w-full">
                    <div
                      className="flex flex-row 
                   items-center justify-end text-sm p-1 w-1/2 "
                    >
                      <div className="w-full text-center outline-none text-sm">
                        {krwComma(preTotalPrice + preFee, order.data.currency)}
                      </div>
                      {order?.data.currency}
                    </div>
                    <div className="text-xs  w-1/2 text-left">
                      ({amountPrice.toLocaleString("ko-KR")}{" "}
                      {order?.data.currency})
                    </div>
                  </div>
                </div>
                <div className="flex flex-row w-full justify-end pr-60">
                  <button
                    onClick={savePre}
                    className="cursor-pointer bg-gray-800 p-1 px-2 rounded-sm
                     text-gray-200 text-sm mr-10 mt-3"
                  >
                    수정하기
                  </button>{" "}
                  <button
                    onClick={saveRecal}
                    className="cursor-pointer bg-gray-800 p-1 px-2 rounded-sm
                     text-gray-200 text-sm mt-3"
                  >
                    재계산
                  </button>{" "}
                </div>
              </div>
            </div>

            <ShippingList shipping={shipping} from="detail" />
          </>
        )}

        {/*  */}
      </div>
    </div>
  );
};

export default OrderDetail;
