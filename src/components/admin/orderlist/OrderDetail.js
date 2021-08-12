import React, { useContext, useState } from "react";
import { InitDataContext } from "../../../App";
import { db } from "../../../firebase";
import useInputs from "../../../hooks/useInput";
import OrderDetailRow from "./OrderDetailRow";
import { useHistory } from "react-router";
import ShippingList from "../shipping/ShippingList";

const OrderDetail = ({ match }) => {
  const { id } = match.params;
  const state = useContext(InitDataContext);
  const { orders, user, shippingCounts, shippings, dhlShippingFee } = state;
  const { z } = dhlShippingFee;

  const order = orders.find(order => order.id === id);
  const shipping = shippings.filter(arr => arr.data.orderId === id);
  const history = useHistory();

  const [form, onChange, reset] = useInputs({
    orderState: order.data.orderState,
    paymentMethod: order.data.paymentMethod,
    shippingType: order.data.shippingType,
    recipientEmail: order.data.recipientEmail,
    recipientPhoneNumber: order.data.recipientPhoneNumber,
    street: order.data.street,
    city: order.data.city,
    states: order.data.states,
    country: order.data.country,
    zipcode: order.data.zipcode,
    recipient: order.data.recipient,
    shippingMessage: order.data.shippingMessage,
    orderNumberSelect: "",
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
  } = form;

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
    });
    alert("Done");
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

  // 배송국가 전체 for select option
  const countries = [].concat(
    ...z
      ?.map(zo => Object.values(zo).map(co => co.country))
      .map(doc => [].concat(...doc))
  );

  // 운임, 총무게
  const totalWeight =
    order.data.list &&
    order.data.list.reduce((i, c) => {
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

  const moveList = async e => {
    e.preventDefault();
    if (orderNumberSelect.length <= 0) {
      return alert("Please select the correct order number");
    }

    await db
      .collection("orders")
      .doc("b2b")
      .collection("b2borders")
      .doc(
        orders.find(arr => arr.data.orderNumber === Number(orderNumberSelect))
          .id
      )
      .update({
        list: [
          ...checkedInputs.map(doc =>
            order.data.list.find(arr => arr.childOrderNumber === doc)
          ),
          ...orders.find(
            arr => arr.data.orderNumber === Number(orderNumberSelect)
          ).data.list,
        ],
      });

    await db
      .collection("orders")
      .doc("b2b")
      .collection("b2borders")
      .doc(id)
      .update({
        list: order.data.list.filter(
          item => !checkedInputs.includes(item.childOrderNumber)
        ),
      });

    await reset();
    await alert("Done");

    history.go(
      `/orderdetail/${
        orders.find(arr => arr.data.orderNumber === Number(orderNumberSelect))
          .id
      }`
    );
  };

  // TODO:  쉬핑 넘버 없이 카운츠로 넘버만들어서 저장-> 되면 오더에도 적용
  const makeShipping = async e => {
    e.preventDefault();
    await db
      .collection("shipping")
      .doc()
      .set({
        orderId: id,
        orderNumber: order.data.orderNumber,
        shippingNumber: shippingCounts + 1,
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
      });

    await db
      .collection("orders")
      .doc("b2b")
      .collection("b2borders")
      .doc(id)
      .update({
        list: order.data.list.filter(
          item => !checkedInputs.includes(item.childOrderNumber)
        ),
      });

    await db
      .collection("forNumberedId")
      .doc("shipping")
      .set({ counts: state.shippingCounts + 1 });
  };

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
                className="flex-col mb-10 flex space-y-2 text-sm w-5/12
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
                    <option value="makeOrder">주문서작성중</option>
                    <option value="confirmOrder">주문완료</option>
                    <option value="packaging">포장중</option>
                    <option value="shipping">배송중</option>
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
                    <option value="transfer">transfer</option>
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
                    <option value="ems">EMS</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 h-8">
                  <div className="text-right pr-5">Phone Number</div>
                  {user?.phoneNumber}
                </div>
                {/* 할인율 */}
                <div className="grid grid-cols-1 ">
                  <div className="text-center my-1 font-semibold">DC Rates</div>
                  <div
                    className="grid grid-cols-6 bg-gray-600 text-center 
                  text-xs text-gray-100 rounded-sm px-1"
                  >
                    {Object.keys(order?.data.dcRates).map((doc, index) => (
                      <div key={index}>{doc.toUpperCase()}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-6 text-center border-b px-1 border-l border-r text-sm">
                    {Object.values(order?.data.dcRates).map((doc, index) => (
                      <div key={index}>{doc * 100} %</div>
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
               w-6/12 items-center"
              >
                <div className="grid grid-cols-2 w-3/4 items-center">
                  <div className="text-right pr-5">Email</div>
                  <input
                    name="recipientEmail"
                    value={recipientEmail}
                    onChange={onChange}
                    className="border p-1 pl-2"
                  />{" "}
                </div>
                <div className="grid grid-cols-2 w-3/4 items-center">
                  <div className="text-right pr-5">PhoneNumber</div>
                  <input
                    name="recipientPhoneNumber"
                    value={recipientPhoneNumber}
                    onChange={onChange}
                    className="border p-1 pl-2"
                  />{" "}
                </div>
                <div className="grid grid-cols-2 w-3/4 items-center">
                  <div className="text-right pr-5">Street</div>
                  <input
                    name="street"
                    value={street}
                    onChange={onChange}
                    className="border p-1 pl-2"
                  />{" "}
                </div>
                <div className="grid grid-cols-2 w-3/4 items-center">
                  <div className="text-right pr-5">City</div>
                  <input
                    name="city"
                    value={city}
                    onChange={onChange}
                    className="border p-1 pl-2"
                  />{" "}
                </div>
                <div className="grid grid-cols-2 w-3/4 items-center">
                  <div className="text-right pr-5">State</div>
                  <input
                    name="states"
                    value={states}
                    onChange={onChange}
                    className="border p-1 pl-2"
                  />{" "}
                </div>
                <div className="grid grid-cols-2 w-3/4 items-center">
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
                <div className="grid grid-cols-2 w-3/4 items-center">
                  <div className="text-right pr-5">Zipcode</div>
                  <input
                    name="zipcode"
                    value={zipcode}
                    onChange={onChange}
                    className="border p-1 pl-2"
                  />{" "}
                </div>
                <div className="grid grid-cols-2 w-3/4 items-center">
                  <div className="text-right pr-5">Recipient</div>
                  <input
                    name="recipient"
                    value={recipient}
                    onChange={onChange}
                    className="border p-1 pl-2"
                  />{" "}
                </div>
                <div className="grid grid-cols-2 w-3/4 items-center">
                  <div className="text-right pr-5">Memo</div>
                  <textarea
                    rows="5"
                    cols="19"
                    name="shippingMessage"
                    value={shippingMessage}
                    onChange={onChange}
                    className="border p-1 pl-2"
                  />{" "}
                </div>
                <button
                  onClick={saveDetails}
                  className="bg-gray-800 rounded text-gray-200 w-1/3 items-center py-2"
                >
                  FIX
                </button>
              </div>
            </div>
            {/* // dep-3-2 */}
            <div className="w-full text-center mb-3 font-semibold">
              PRODUCTS
            </div>
            {/* dep-3-3 */}
            <div
              className="grid grid-cols-28 text-center bg-gray-800
            text-sm py-1 rounded-sm text-gray-100"
            >
              <div></div>
              <div>No.</div>
              <div className="col-span-2">DATE</div>
              <div className="col-span-2">RELEASE</div>
              <div className="col-span-12">TITLE</div>
              <div className="col-span-2">PRICE</div>
              <div className="col-span-2">SALE</div>
              <div className="col-span-2">EA</div>
              <div className="col-span-2">WEIGHT</div>

              <div className="col-span-2">AMOUNT</div>
            </div>
            {/* dep-3-4 */}
            {order.data.list
              .filter(list => new Date(list.relDate.toDate()) < new Date())
              .sort()
              .map(doc => (
                <OrderDetailRow
                  key={doc.childOrderNumber}
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
                />
              ))}
            {order.data.list
              .filter(list => new Date(list.relDate.toDate()) >= new Date())
              .sort()
              .map(doc => (
                <OrderDetailRow
                  key={doc.childOrderNumber}
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
                />
              ))}

            {/* dep-3-5 */}
            <div className="text-center items-center justify-between flex flex-row mt-6 text-sm">
              <div>
                <button
                  onClick={makeShipping}
                  className="bg-gray-800 text-gray-200 px-2 py-1 ml-5 rounded-sm"
                >
                  SHIP
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
                        doc.data.orderState === "confirmOrder"
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
            <div className="text-right flex flex-col items-end mt-6 text-lg">
              <div className="grid grid-cols-2 w-96 mb-3">
                <div>PRICE</div>
                <div>
                  {Math.round(
                    order.data.list.reduce((i, c) => {
                      return i + (c.price - c.dcRate * c.price) * c.quan;
                    }, 0)
                  ).toLocaleString("ko-KR")}{" "}
                  {order.data.currency}
                </div>
              </div>

              <div className="grid grid-cols-2 w-96  mb-3">
                <div>SHIPPING FEE</div>
                <div>
                  {/* FIXME: 초과분 */}
                  {/* 30키로 미만 */}
                  {fee &&
                    `${Math.round(fee).toLocaleString("ko-KR")} ${
                      order.data.currency
                    }`}
                  {/* 30키로 초과 */}
                </div>
              </div>
              <div className="grid grid-cols-2 w-96 ">
                <div>AMOUNT</div>
                <div>
                  {Math.round(
                    order.data.list.reduce((i, c) => {
                      return i + (c.price - c.dcRate * c.price) * c.quan;
                    }, 0) + fee
                  ).toLocaleString("ko-KR")}{" "}
                  {order.data.currency}
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
