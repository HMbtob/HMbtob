import React from "react";
import { useHistory } from "react-router";

const OrderListRow = ({
  id,
  createdAt,
  customer,
  listLength,
  orderState,
  totalPrice,
  totalQuan,
  totalWeight,
  orders,
  orderNumber,
}) => {
  const history = useHistory();
  const today = new Date();
  console.log(today);
  console.log(
    orders[0].data.list[0].relDate.toDate().toLocaleDateString() <
      today.toLocaleDateString()
  );
  const included = orders
    .find(arr => arr.id === id)
    .data.list.reduce((i, c) => {
      return (
        i ||
        c.relDate.toDate().toLocaleDateString() > today.toLocaleDateString()
      );
    }, false);
  console.log(included);
  if (orders) {
    return (
      <div
        onClick={() => history.push(`/orderdetail/${id}`)}
        className={`grid grid-cols-10 grid-flow-col text-center border-b border-l border-r py-1 ${
          included ? " bg-red-200" : ""
        }`}
      >
        <div>{orderNumber}</div>
        <div className="col-span-2">
          {new Date(createdAt.toDate()).toLocaleString()}
        </div>
        <div className="col-span-2">{customer}</div>
        <div>{listLength} 종류</div>
        <div>{orderState} </div>
        <div>{totalPrice} 원</div>
        <div>{totalQuan} 개</div>
        <div>{totalWeight} KG</div>
      </div>
    );
  }

  return "loading";
};

export default OrderListRow;
