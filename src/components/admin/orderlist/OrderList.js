import React, { useContext } from "react";
import { InitDataContext } from "../../../App";
import OrderListRow from "./OrderListRow";

const OrderList = () => {
  const state = useContext(InitDataContext);
  const { orders } = state;
  return (
    <div className="w-full h-full flex justify-center">
      <div className=" w-11/12 flex-col mt-20">
        <div className="w-full text-center my-4 text-gray-800 text-2xl">
          주문확인
        </div>
        {/* <button>주문확인</button> */}
        <div
          className="grid grid-cols-10  grid-flow-col text-center 
           bg-gray-800 text-gray-100 py-1 rounded-sm"
        >
          <div>주문번호</div>
          <div className="col-span-2">주문시간</div>
          <div className="col-span-2">주문자</div>
          <div>주문종류</div>
          <div>주문상태</div>
          <div>주문총가격</div>
          <div>주문총수량</div>
          <div>주문총무게</div>
        </div>
        <div>
          {orders &&
            orders.map(order => (
              <OrderListRow
                key={order.id}
                id={order.id}
                orderNumber={order.data.orderNumber}
                createdAt={order.data.createdAt}
                customer={order.data.customer}
                listLength={order.data.list.length}
                orderState={order.data.orderState}
                totalPrice={order.data.totalPrice}
                totalQuan={order.data.totalQuan}
                totalWeight={order.data.totalWeight}
                orders={orders}
              />
            ))}
        </div>
      </div>
      {/* 디테일 페이지 만들어서 인보이스 발행기능, 수량 수정가능하게, 목록 삭제도 가능하게 삭제나 수정했을때 기존인보이스에 취소선? 주문에 list를 orderlist 랑 confirmlist 로 분화? */}
    </div>
  );
};
export default OrderList;
