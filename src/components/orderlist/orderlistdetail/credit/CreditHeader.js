import React from "react";

export function CreditHeader() {
  return (
    <div
      className="grid grid-cols-20  grid-flow-col text-center bg-gray-800
           text-gray-100 py-1 rounded-sm text-sm items-center"
    >
      <div></div>
      <div className="col-span-3">날짜</div>
      <div className="col-span-4">내용</div>
      <div className="col-span-3">Paid</div>
      <div className="col-span-3">Shipped</div>
      <div className="col-span-3">잔액</div>
      <div className="col-span-3">MEMO</div>
    </div>
  );
}
