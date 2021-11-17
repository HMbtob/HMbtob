import React from "react";

export function CustomerHeader() {
  return (
    <>
      <div className="w-full text-center my-4 text-gray-800 text-lg">
        CUSTOMER LIST
      </div>
      <div className="flex flex-col items-end text-xs mb-3 rounded-md">
        <div className="bg-red-100 w-auto px-2 py-1 rounded-sm mb-1">
          Permission, In Charge, Nick name, 배송요율을 설정해주세요
        </div>
      </div>
      <div
        className="grid grid-cols-7  grid-flow-col text-center 
       bg-gray-800 text-gray-100 py-1 rounded-sm text-xs"
      >
        <div className="col-span-2">E-mail</div>
        <div className="col-span-1">Name</div>
        <div className="col-span-1">Nick</div>
        <div className="col-span-1">Credit</div>
        <div className="col-span-1">alias</div>
        <div className="col-span-1">Type</div>
      </div>
    </>
  );
}
