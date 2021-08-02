import React from "react";

const MyOrderDetailRow = ({ order, id, totalWeight }) => {
  console.log(order);
  const today = new Date();
  const preOrder =
    order.relDate.toDate().toLocaleDateString() < today.toLocaleDateString();

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
      <div className="col-span-11">{order.title}</div>
      <div className="col-span-2">{order.price} 원</div>
      <div className="col-span-3">
        {order.price - order.price * order.dcRate} 원{" "}
        {`[${order.dcRate * 100}%]`}
      </div>
      <div>{order.weight} g</div>
      <div>{order.quan} 개</div>
      <div className="col-span-2">
        {Math.round(totalWeight * 0.001 * 10) / 10} kg
      </div>
      <div className="col-span-2">
        {(order.price - order.price * order.dcRate) * order.quan} 원
      </div>
    </div>
  );
};

export default MyOrderDetailRow;
