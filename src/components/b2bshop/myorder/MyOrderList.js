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
    </div>
  );
};

export default MyOrderList;
