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
  const { orders, user, shippingCounts, shippings } = state;
  const order = orders.find(order => order.id === id);
  const shipping = shippings.filter(arr => arr.data.orderId === id);
  const history = useHistory();

  const [form, onChange, reset] = useInputs({
    orderState: order.data.orderState,
    paymentMethod: order.data.paymentMethod,
    shippingType: order.data.shippingType,
    recipientEmail: order.data.recipientEmail,
    recipientPhoneNumber: order.data.recipientPhoneNumber,
    address1: order.data.address1,
    address2: order.data.address2,
    address3: order.data.address3,
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
    address1,
    address2,
    address3,
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

  const [checkedInputs, setCheckedInputs] = useState([]);

  const changeHandler = (checked, id) => {
    if (checked) {
      setCheckedInputs([...checkedInputs, id]);
    } else {
      // 체크 해제
      setCheckedInputs(checkedInputs.filter(el => el !== id));
    }
  };

  const moveList = async e => {
    e.preventDefault();
    if (orderNumberSelect.length <= 0) {
      return alert("올바른 주문번호를 선택하세여");
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
    await alert("이동 완료");

    history.push(
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
        address1,
        address2,
        address3,
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
          주문 내용 확인
        </div>

        {user && order && (
          <>
            <div className="flex flex-row justify-evenly">
              {/* 주문내용 확인 */}
              <div className="flex-col mb-10 flex space-y-2">
                <div className="grid grid-cols-2">
                  <div>주문번호</div>
                  <div>{order.data.orderNumber}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div>주문상태</div>
                  <select
                    name="orderState"
                    value={orderState}
                    onChange={onChange}
                  >
                    <option value="makeOrder">주문서작성중</option>
                    <option value="confirmOrder">주문완료</option>
                    <option value="packaging">포장중</option>
                    <option value="shipping">배송중</option>
                  </select>
                </div>
                <div className="grid grid-cols-2">
                  <div>이메일</div>
                  <div>{order.data.customer}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div>주문일</div>
                  {new Date(order.data.createdAt.toDate()).toLocaleString()}
                </div>
                <div className="grid grid-cols-2">
                  <div>결제방법</div>

                  <select
                    name="paymentMethod"
                    value={paymentMethod}
                    onChange={onChange}
                  >
                    <option value="transfer">계좌이체</option>
                  </select>
                </div>
                <div className="grid grid-cols-2">
                  <div>발송방법</div>
                  <select
                    name="shippingType"
                    value={shippingType}
                    onChange={onChange}
                  >
                    <option value="dhl">DHL</option>
                    <option value="ems">EMS</option>
                  </select>
                </div>
                <div className="grid grid-cols-2">
                  <div>전화번호</div>
                  {user?.phoneNumber}
                </div>
                {/* 할인율 */}
                <div className="grid grid-cols-1">
                  <div className="text-center my-1 font-semibold">할인율</div>
                  <div className="grid grid-cols-6 bg-gray-600 text-center text-gray-100 rounded-sm px-1">
                    {Object.keys(order?.data.dcRates).map((doc, index) => (
                      <div key={index}>{doc}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-6 text-center border-b px-1 border-l border-r text-sm">
                    {Object.values(order?.data.dcRates).map((doc, index) => (
                      <div key={index}>{doc * 100} %</div>
                    ))}
                  </div>
                  <div className="text-center my-1 font-semibold mt-3">
                    배송요율
                  </div>
                  <div className="grid grid-cols-6 bg-gray-600 text-center text-gray-100 rounded-sm px-1">
                    {" "}
                    {Object.keys(order?.data.shippingRate).map((doc, index) => (
                      <div key={index}>{doc}</div>
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

              <div className="flex-col mb-10 flex space-y-2">
                <div className="text-center">수령인</div>
                <div className="grid grid-cols-2">
                  <div>email</div>
                  <input
                    name="recipientEmail"
                    value={recipientEmail}
                    onChange={onChange}
                  />{" "}
                </div>
                <div className="grid grid-cols-2">
                  <div>전화번호</div>
                  <input
                    name="recipientPhoneNumber"
                    value={recipientPhoneNumber}
                    onChange={onChange}
                  />{" "}
                </div>
                <div className="grid grid-cols-2">
                  <div>주소1</div>
                  <input
                    name="address1"
                    value={address1}
                    onChange={onChange}
                  />{" "}
                </div>
                <div className="grid grid-cols-2">
                  <div>주소2</div>
                  <input
                    name="address2"
                    value={address2}
                    onChange={onChange}
                  />{" "}
                </div>
                <div className="grid grid-cols-2">
                  <div>주소3</div>
                  <input
                    name="address3"
                    value={address3}
                    onChange={onChange}
                  />{" "}
                </div>
                <div className="grid grid-cols-2">
                  <div>국가</div>
                  <input
                    name="country"
                    value={country}
                    onChange={onChange}
                  />{" "}
                </div>
                <div className="grid grid-cols-2">
                  <div>우편번호</div>
                  <input
                    name="zipcode"
                    value={zipcode}
                    onChange={onChange}
                  />{" "}
                </div>
                <div className="grid grid-cols-2">
                  <div>이름</div>
                  <input
                    name="recipient"
                    value={recipient}
                    onChange={onChange}
                  />{" "}
                </div>
                <div className="grid grid-cols-2">
                  <div>요청사항</div>
                  <input
                    name="shippingMessage"
                    value={shippingMessage}
                    onChange={onChange}
                  />{" "}
                </div>
                <button onClick={saveDetails}>수정하기</button>
              </div>
            </div>
            {/* // dep-3-2 */}
            <div className="w-full text-center">상품종류</div>
            {/* dep-3-3 */}
            <div
              className="grid grid-cols-28 text-center bg-gray-800
            text-sm py-1 rounded-sm text-gray-100"
            >
              <div></div>
              <div>No.</div>
              <div className="col-span-2">주문일</div>
              <div className="col-span-2">발매일</div>
              <div className="col-span-15">앨범명</div>
              <div>판매가</div>
              <div className="col-span-2">할인가</div>
              <div>무게</div>
              <div>수량</div>
              <div>총무게</div>

              <div>총액</div>
            </div>
            {/* dep-3-4 */}
            {order.data.list.map(doc => (
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
              />
            ))}

            {/* dep-3-5 */}
            <div className="text-right flex flex-col items-end mt-6 text-lg">
              <button onClick={makeShipping}>발송처리</button>
              <button onClick={moveList}>주문이동</button>
              <select
                name="orderNumberSelect"
                value={orderNumberSelect}
                onChange={onChange}
              >
                {/* 해당 주문자의 미발송 주문 가져와서 이동 */}
                <option value="">주문번호</option>
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
            </div>

            {/* dep-3-6 */}
            <div className="text-right flex flex-col items-end mt-6 text-lg">
              <div className="grid grid-cols-2 w-96 mb-3">
                <div>액수</div>
                <div>
                  {order.data.list.reduce((i, c) => {
                    return i + (c.price - c.dcRate * c.price) * c.quan;
                  }, 0)}{" "}
                  원
                </div>
              </div>
              <div className="grid grid-cols-2 w-96 mb-3">
                <div>총무게</div>
                <div>
                  {order.data.list.reduce((i, c) => {
                    return i + c.weight * c.quan;
                  }, 0) / 1000}{" "}
                  kg
                </div>
              </div>
              <div className="grid grid-cols-2 w-96  mb-3">
                <div>예상운송비</div>
                <div>
                  {(Number(
                    order.data.list.reduce((i, c) => {
                      return i + c.weight * c.quan;
                    }, 0)
                  ) /
                    1000) *
                    Number(order.data.shippingRate[shippingType])}{" "}
                  원
                </div>
              </div>
              <div className="grid grid-cols-2 w-96 ">
                <div>총액</div>
                <div>
                  {(Number(
                    order.data.list.reduce((i, c) => {
                      return i + c.weight * c.quan;
                    }, 0)
                  ) /
                    1000) *
                    Number(user.shippingRate.dhl) +
                    order.data.list.reduce((i, c) => {
                      return i + (c.price - c.dcRate * c.price) * c.quan;
                    }, 0)}{" "}
                  원
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
