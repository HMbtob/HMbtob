import React from "react";

const MyOrderDetailRow = ({ order, id, totalWeight, currency }) => {
  const today = new Date();
  const preOrder = order.relDate.toDate() < today;

  return (
    <div
      className={` text-sm place-items-center grid grid-cols-28 grid-flow-col text-center border-b border-l border-r py-1 ${
        !preOrder ? "bg-red-200" : ""
      }`}
    >
      <div className="col-span-2">{id}</div>
      <div className="col-span-2">
        {order.createdAt.toDate().toLocaleDateString()}
      </div>

      <div className="col-span-2">
        {order.relDate.toDate().toLocaleDateString()}{" "}
      </div>
      <div className="col-span-12">{order.title}</div>
      <div className="col-span-2">
        {Math.round(order.price).toLocaleString("ko-KR")} {currency}
      </div>
      <div className="col-span-2">
        {Math.round(order.price - order.price * order.dcRate).toLocaleString(
          "ko-KR"
        )}{" "}
        {currency}
      </div>
      <div className="col-span-2">{order.quan} EA</div>
      <div className="col-span-2">
        {Math.round(totalWeight * 0.001 * 10) / 10} kg
      </div>
      <div className="col-span-2">
        {Math.round(
          (order.price - order.price * order.dcRate) * order.quan
        ).toLocaleString("ko-KR")}{" "}
        {currency}
      </div>
    </div>
  );
};

export default MyOrderDetailRow;
