import React from "react";

export default function IncludedOrdersHeader() {
  return (
    <div
      className="grid grid-cols-36  grid-flow-col text-center bg-gray-800
           text-gray-100 py-1 rounded-sm text-sm items-center"
    >
      <div className="col-span-3">NickName</div>
      <div className="col-span-3 flex items-center justify-center cursor-pointer z-10">
        주문일
      </div>
      <div className="col-span-3 flex items-center justify-center cursor-pointer">
        출시일
      </div>
      <div className="col-span-3">sku</div>
      <div className="col-span-3">barcode</div>
      <div className="col-span-9 flex items-center justify-center cursor-pointer">
        title
      </div>
      <div className="col-span-3">price</div>
      <div className="col-span-2">qty</div>
      <div className="col-span-3">totalPrice</div>
      <div className="col-span-4">memo</div>
    </div>
  );
}
