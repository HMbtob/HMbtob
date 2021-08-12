import React, { useContext } from "react";
import { InitDataContext } from "../../../App";
import ShippingList from "../../admin/shipping/ShippingList";
import MyOrderDetailRow from "./MyOrderDetailRow";

const MyOrderDetail = ({ match }) => {
  const { id } = match.params;
  const state = useContext(InitDataContext);
  const { orders, accounts, shippings, dhlShippingFee } = state;
  const { z } = dhlShippingFee;

  const order = orders.find(order => order.id === id);
  const account = accounts.find(account => account.id === order.data.customer);
  const shipping = shippings.filter(shipping => shipping.data.orderId === id);

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
    order &&
    order.data.country.length > 0 &&
    Object.keys(
      z.find(doc =>
        Object.values(doc).find(asd => asd.country.includes(order.data.country))
      )
    );

  // 가격
  const fee =
    z &&
    order &&
    order.data.country.length > 0 &&
    Number(
      Object.values(z.find(doc => Object.keys(doc)[0] === zone[0]))[0]
        .fee[num - 1].split(",")
        .join("")
    );
  return (
    <div className="w-full h-full flex justify-center">
      {/* dep-2 */}
      <div className="w-11/12 flex-col mt-20">
        {/* dep-3-1 */}
        <div
          className="text-center text-md bg-gray-800 
        rounded-sm text-gray-100 mb-5 w-full"
        >
          My Order
        </div>
        <div className="flex flex-row justify-evenly">
          {/* 주문내용 확인 */}
          <div className="flex-col mb-10 flex space-y-2 w-1/3">
            <div className="grid grid-cols-2">
              <div>ORDER NUMBER</div>
              <div>{order.data.orderNumber}</div>
            </div>
            <div className="grid grid-cols-2">
              <div>STATUS</div>
              <div>{order.data.orderState}</div>
            </div>
            <div className="grid grid-cols-2">
              <div>EMAIL</div>
              <div>{account.id}</div>
            </div>
            <div className="grid grid-cols-2">
              <div>DATE</div>
              {new Date(order.data.createdAt.toDate()).toLocaleString()}
            </div>
            <div className="grid grid-cols-2">
              <div>PAYMENTMETHOD</div>
              <div>{order.data.paymentMethod}</div>
            </div>
            <div className="grid grid-cols-2">
              <div>SHIPPING</div>
              <div>{order.data.shippingType}</div>
            </div>
            <div className="grid grid-cols-2">
              <div>PHONE</div>
              <div>{account.data.phoneNumber}</div>
            </div>
          </div>
          {/* 수령인 파트 */}

          <div className="flex-col mb-10 flex space-y-2 w-1/3">
            <div className="grid grid-cols-2">
              <div>recipient</div>
              <div>{order.data.recipient}</div>
            </div>
            <div className="grid grid-cols-2">
              <div>Email</div>
              <div>{order.data.recipientEmail}</div>
            </div>
            <div className="grid grid-cols-2">
              <div>Number</div>
              <div>{order.data.recipientPhoneNumber}</div>
            </div>
            <div className="grid grid-cols-2">
              <div>Street</div>
              <div>{order.data.street}</div>
            </div>
            <div className="grid grid-cols-2">
              <div>City</div>
              <div>{order.data.city}</div>
            </div>
            <div className="grid grid-cols-2">
              <div>State</div>
              <div>{order.data.states}</div>
            </div>
            <div className="grid grid-cols-2">
              <div>Country</div>
              <div>{order.data.country}</div>
            </div>
            <div className="grid grid-cols-2">
              <div>Zipcode</div>
              <div>{order.data.zipcode}</div>
            </div>

            <div className="grid grid-cols-2">
              <div>Memo</div>
              <div>{order.data.memo}</div>
            </div>
          </div>
        </div>
        <div className="w-full text-center">PRODUCTS</div>
        {/* dep-3-3 */}
        <div
          className="grid grid-cols-28 text-center bg-gray-800
            text-sm py-1 rounded-sm text-gray-100"
        >
          <div className="col-span-2">No.</div>
          <div className="col-span-2">DATE</div>
          <div className="col-span-2">RELEASE</div>
          <div className="col-span-12">TITLE</div>
          <div className="col-span-2">PRICE</div>
          <div className="col-span-2">SALE</div>
          <div className="col-span-2">EA</div>
          <div className="col-span-2">WEIGHTS</div>

          <div className="col-span-2">AMOUNT</div>
        </div>
        {order &&
          order.data.list.map(doc => (
            <MyOrderDetailRow
              key={doc.childOrderNumber}
              id={doc.childOrderNumber}
              totalWeight={doc.weight * doc.quan}
              order={doc}
              currency={order.data.currency}
            />
          ))}
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
            <div>TOTAL PRICE</div>
            <div>
              {order &&
                fee &&
                Math.round(
                  fee +
                    order.data.list.reduce((i, c) => {
                      return i + (c.price - c.dcRate * c.price) * c.quan;
                    }, 0)
                ).toLocaleString("ko-KR")}{" "}
              {order.data.currency}
            </div>
          </div>
        </div>
        <ShippingList shipping={shipping} from="detail" />
      </div>
    </div>
  );
};

export default MyOrderDetail;
