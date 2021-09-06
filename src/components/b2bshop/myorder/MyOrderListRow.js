import React from "react";
import { useHistory } from "react-router";

const MyOrderListRow = ({ id, orderNumber, createdAt, orderState, order }) => {
  const history = useHistory();
  const today = new Date();

  const included = order.data.list.reduce((i, c) => {
    if (c.moved === false && c.canceled === false && c.shipped === false) {
      return i || c.relDate.toDate() > today;
    }
    return i || false;
  }, false);
  if (order) {
    return (
      <div
        onClick={() => history.push(`/myorderlist/${id}`)}
        className={`grid grid-cols-7 grid-flow-col text-center 
        border-b border-l border-r py-1 text-sm cursor-pointer  ${
          included ? " bg-red-100" : ""
        }`}
      >
        <div>{orderNumber}</div>
        <div className="col-span-2">
          {new Date(createdAt.toDate()).toLocaleString()}
        </div>
        <div>{orderState} </div>
        <div>
          {order.data.currency === "KRW"
            ? order.data.list
                .reduce((i, c) => {
                  return (
                    i + (c.price - (c.dcRate * c.price).toFixed(2)) * c.quan
                  );
                }, 0)
                .toLocaleString("ko-KR")
            : order.data.list
                .reduce((i, c) => {
                  return (
                    i + (c.price - (c.dcRate * c.price).toFixed(2)) * c.quan
                  );
                }, 0)
                .toFixed(2)
                .toLocaleString("ko-KR")}{" "}
          {order.data.currency}
        </div>
        <div>{order.data.list.length} </div>
        <div>
          {order.data.list.reduce((i, c) => {
            return i + c.quan;
          }, 0)}{" "}
          EA
        </div>
      </div>
    );
  }

  return "loading";
};

export default MyOrderListRow;
