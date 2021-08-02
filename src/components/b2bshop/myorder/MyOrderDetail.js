import React, { useContext } from "react";
import { InitDataContext } from "../../../App";
import ShippingList from "../../admin/shipping/ShippingList";
import MyOrderDetailRow from "./MyOrderDetailRow";

const MyOrderDetail = ({ match }) => {
  const { id } = match.params;
  const state = useContext(InitDataContext);
  const { orders, accounts, shippings } = state;

  const order = orders.find(order => order.id === id);
  const account = accounts.find(account => account.id === order.data.customer);
  const shipping = shippings.filter(shipping => shipping.data.orderId === id);

  return (
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
        <div className="flex flex-row justify-evenly">
          {/* 주문내용 확인 */}
          <div className="flex-col mb-10 flex space-y-2">
            <div className="grid grid-cols-2">
              <div>주문번호</div>
              <div>{order.data.orderNumber}</div>
            </div>
            <div className="grid grid-cols-2">
              <div>주문상태</div>
              <div>{order.data.orderState}</div>
            </div>
            <div className="grid grid-cols-2">
              <div>이메일</div>
              <div>{account.id}</div>
            </div>
            <div className="grid grid-cols-2">
              <div>주문일</div>
              {new Date(order.data.createdAt.toDate()).toLocaleString()}
            </div>
            <div className="grid grid-cols-2">
              <div>결제방법</div>
              <div>{order.data.paymentMethod}</div>
            </div>
            <div className="grid grid-cols-2">
              <div>발송방법</div>
              <div>{order.data.shippingType}</div>
            </div>
            <div className="grid grid-cols-2">
              <div>전화번호</div>
              <div>{account.data.phoneNumber}</div>
            </div>
          </div>
          {/* 수령인 파트 */}

          <div className="flex-col mb-10 flex space-y-2">
            <div className="text-center">수령인</div>
            <div className="grid grid-cols-2">
              <div>email</div>
              <div>{order.data.recipientEmail}</div>
            </div>
            <div className="grid grid-cols-2">
              <div>전화번호</div>
              <div>{order.data.recipientPhoneNumber}</div>
            </div>
            <div className="grid grid-cols-2">
              <div>주소1</div>
              <div>{order.data.address1}</div>
            </div>
            <div className="grid grid-cols-2">
              <div>주소2</div>
              <div>{order.data.address2}</div>
            </div>
            <div className="grid grid-cols-2">
              <div>주소3</div>
              <div>{order.data.address3}</div>
            </div>
            <div className="grid grid-cols-2">
              <div>국가</div>
              <div>{order.data.country}</div>
            </div>
            <div className="grid grid-cols-2">
              <div>우편번호</div>
              <div>{order.data.zipcode}</div>
            </div>
            <div className="grid grid-cols-2">
              <div>이름</div>
              <div>{order.data.recipient}</div>
            </div>
            <div className="grid grid-cols-2">
              <div>요청사항</div>
              <div>{order.data.shippingMessage}</div>
            </div>
          </div>
        </div>
        <div className="w-full text-center">상품종류</div>
        {/* dep-3-3 */}
        <div
          className="grid grid-cols-28 text-center bg-gray-800
            text-sm py-1 rounded-sm text-gray-100"
        >
          <div className="col-span-2">No.</div>
          <div className="col-span-2">주문일</div>
          <div className="col-span-2">발매일</div>
          <div className="col-span-11">앨범명</div>
          <div className="col-span-2">판매가</div>
          <div className="col-span-3">할인가</div>
          <div>무게</div>
          <div>수량</div>
          <div className="col-span-2">총무게</div>

          <div className="col-span-2">총액</div>
        </div>
        {order &&
          order.data.list.map(doc => (
            <MyOrderDetailRow
              key={doc.childOrderNumber}
              id={doc.childOrderNumber}
              totalWeight={doc.weight * doc.quan}
              order={doc}
            />
          ))}
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
                Number(order.data.shippingRate[order.data.shippingType])}{" "}
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
                Number(order.data.shippingRate[order.data.shippingType]) +
                order.data.list.reduce((i, c) => {
                  return i + (c.price - c.dcRate * c.price) * c.quan;
                }, 0)}{" "}
              원
            </div>
          </div>
        </div>
        <ShippingList shipping={shipping} from="detail" />
      </div>
    </div>
  );
};

export default MyOrderDetail;
