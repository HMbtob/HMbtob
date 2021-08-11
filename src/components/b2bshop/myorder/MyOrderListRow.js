import React from "react";
import { useHistory } from "react-router";

const MyOrderListRow = ({ id, orderNumber, createdAt, orderState, order }) => {
  const history = useHistory();
  const today = new Date();

  const included = order.data.list.reduce((i, c) => {
    return i || c.relDate.toDate() > today;
  }, false);
  if (order) {
    return (
      <div
        onClick={() => history.push(`/myorderlist/${id}`)}
        className={`grid grid-cols-8 grid-flow-col text-center 
        border-b border-l border-r py-1 text-sm cursor-pointer ${
          included ? " bg-red-200" : ""
        }`}
      >
        <div>{orderNumber}</div>
        <div className="col-span-2">
          {new Date(createdAt.toDate()).toLocaleString()}
        </div>
        <div>{orderState} </div>
        <div>
          ₩{" "}
          {Math.round(
            order.data.list.reduce((i, c) => {
              return i + (c.price - c.dcRate * c.price) * c.quan;
            }, 0)
          ).toLocaleString("ko-KR")}
        </div>
        <div>{order.data.list.length} </div>
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

export default MyOrderListRow;