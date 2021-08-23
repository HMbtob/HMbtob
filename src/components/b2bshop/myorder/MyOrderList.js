import React, { useContext } from "react";
import { InitDataContext } from "../../../App";
import MyOrderListRow from "./MyOrderListRow";

const MyOrderList = () => {
  const state = useContext(InitDataContext);
  const { orders, user } = state;
  const userOrders = orders.filter(order => order.data.customer === user.email);
  return (
    <div className="w-full h-full flex justify-center">
      <div className=" w-11/12 flex-col mt-20">
        <div
          className="w-full text-center my-4 text-gray-800 
       font-semibold text-lg"
        >
          My Orders
        </div>
        {/* <button>주문확인</button> */}
        <div
          className="grid grid-cols-7  grid-flow-col text-center 
       bg-gray-800 text-gray-100 py-1 rounded-sm text-xs font-semibold"
        >
          <div>ORDER NUMBER</div>
          <div className="col-span-2">DATE</div>
          <div>STATUS</div>
          <div>PRICE</div>
          <div>SORTS</div>
          <div>EA</div>
        </div>
        <div>
          {userOrders &&
            userOrders.map(order => (
              <MyOrderListRow
                key={order.id}
                id={order.id}
                orderNumber={order.data.orderNumber}
                createdAt={order.data.createdAt}
                customer={order.data.customer}
                orderState={order.data.orderState}
                order={order}
              />
            ))}
        </div>
      </div>
      {/* 디테일 페이지 만들어서 인보이스 발행기능, 수량 수정가능하게, 목록 삭제도 가능하게 삭제나 수정했을때 기존인보이스에 취소선? 주문에 list를 orderlist 랑 confirmlist 로 분화? */}
    </div>
  );
};

export default MyOrderList;
