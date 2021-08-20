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
    if (c.moved === false && c.canceled === false) {
      return i || c.relDate.toDate() > today;
    }
    return i || false;
  }, false);
  if (order) {
    return (
      <div
        onClick={() => history.push(`/orderdetail/${id}`)}
        className={`grid grid-cols-11 grid-flow-col text-center 
        border-b border-l border-r py-1 text-sm cursor-pointer bg-white ${
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
          {order.data.currency === "KRW"
            ? order.data.totalPrice.toLocaleString("ko-KR")
            : order.data.totalPrice.toFixed(2).toLocaleString("ko-KR")}{" "}
          {order.data.currency}
        </div>
        <div>
          {order.data.currency === "KRW"
            ? order.data.amountPrice.toLocaleString("ko-KR")
            : order.data.amountPrice.toFixed(2).toLocaleString("ko-KR")}{" "}
          {order.data.currency}
        </div>
        <div>{order.data.list.length} type</div>
        <div>
          {order.data.list.reduce((i, c) => {
            return i + c.quan;
          }, 0)}{" "}
          EA
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
