import React from "react";
import { useHistory } from "react-router";

const OrderListRow = ({
  id,
  createdAt,
  customer,
  orderState,
  orderNumber,
  order,
}) => {
  const history = useHistory();
  const today = new Date();

  const included = order.data.list.reduce((i, c) => {
    return (
      i || c.relDate.toDate().toLocaleDateString() > today.toLocaleDateString()
    );
  }, false);
  if (order) {
    return (
      <div
        onClick={() => history.push(`/orderdetail/${id}`)}
        className={`grid grid-cols-10 grid-flow-col text-center 
        border-b border-l border-r py-1 text-sm ${
          included ? " bg-red-200" : ""
        }`}
      >
        <div>{orderNumber}</div>
        <div className="col-span-2">
          {new Date(createdAt.toDate()).toLocaleString()}
        </div>
        <div className="col-span-2">{customer}</div>
        <div>{orderState} </div>
        <div>
          {order.data.list.reduce((i, c) => {
            return i + (c.price - c.dcRate * c.price) * c.quan;
          }, 0)}{" "}
          원
        </div>
        <div>{order.data.list.length} 종류</div>
        <div>
          {order.data.list.reduce((i, c) => {
            return i + c.quan;
          }, 0)}{" "}
          개
        </div>
        <div>
          {order.data.list.reduce((i, c) => {
            return i + c.weight * c.quan;
          }, 0) / 1000}{" "}
          KG
        </div>
      </div>
    );
  }

  return "loading";
};

export default OrderListRow;
