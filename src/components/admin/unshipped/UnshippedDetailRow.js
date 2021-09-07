import React from "react";

const UnshippedDetailRow = ({ list }) => {
  const today = new Date();
  const preOrder = list.relDate.toDate() < today;
  return (
    <div
      className={`text-xs place-items-center grid grid-cols-28 grid-flow-col text-center border-b border-l border-r py-1 ${
        !preOrder ? "bg-red-100" : ""
      }`}
    >
      <div className="col-span-3">{list.childOrderNumber}</div>

      <div className="col-span-2">
        {list.createdAt.toDate().toLocaleDateString()}{" "}
      </div>
      <div className="col-span-2">
        {list.relDate.toDate().toLocaleDateString()}{" "}
      </div>
      <div className="col-span-10 text-left w-full pl-2">{list.title}</div>
      <div className="col-span-4">
        {(list.price - list.price * list.dcRate)?.toFixed(2)} {list.currency}
      </div>
      <div className="col-span-2">{list.quan} 개</div>
      <div className="col-span-2">
        {Math.round(list.totalWeight * 0.001 * 10) / 10} kg
      </div>
      <div className="col-span-3">
        {((list.price - list.price * list.dcRate) * list.quan).toFixed(2)}{" "}
        {list.currency}
      </div>
    </div>
  );
};

export default UnshippedDetailRow;
