import React from "react";

const SimpleListRow = ({ title, quan, price, totalPrice }) => {
  const truncate = (string, n) => {
    return string?.length > n ? string.substr(0, n - 1) + " . . ." : string;
  };

  return (
    <div className="grid grid-cols-6 place-items-center text-center text-xs py-1 border-b border-l border-r bg-gray-100">
      <div className="col-span-3">{truncate(title, 60)}</div>
      <div className="col-span-1">{quan}</div>
      <div className="col-span-1">{price?.toLocaleString("ko-KR")}</div>
      <div className="col-span-1">{totalPrice?.toLocaleString("ko-KR")}</div>
    </div>
  );
};

export default SimpleListRow;
