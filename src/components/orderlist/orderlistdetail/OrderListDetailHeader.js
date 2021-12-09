import React from "react";

export function OrderListDetailHeader() {
  return (
    <div
      className="grid grid-cols-36  grid-flow-col text-center bg-gray-800
           text-gray-100 py-1 rounded-sm text-sm items-center"
    >
      <div></div>
      <div className="col-span-3">배송지</div>
      <div className="col-span-2">주문일</div>
      <div className="col-span-2">출시일</div>
      <div className="col-span-3">sku</div>
      <div className="col-span-3">barcode</div>
      <div className="col-span-11">title</div>
      <div className="col-span-3">price</div>
      <div>qty</div>
      <div className="col-span-3">totalPrice</div>
      <div className="col-span-4">memo</div>
    </div>
  );
}
