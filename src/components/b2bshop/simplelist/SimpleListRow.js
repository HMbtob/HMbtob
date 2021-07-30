import React from "react";

const SimpleListRow = ({ title, quan, price, totalPrice }) => {
  return (
    <div className="grid grid-cols-6 place-items-center text-center text-xs py-1 border-b border-l border-r bg-gray-100">
      <div className="col-span-3">{title}</div>
      <div className="col-span-1">{quan}</div>
      <div className="col-span-1">{price}</div>
      <div className="col-span-1">{totalPrice}</div>
    </div>
  );
};

export default SimpleListRow;
