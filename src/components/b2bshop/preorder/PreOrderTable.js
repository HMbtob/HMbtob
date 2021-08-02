import React from "react";
import PreOrderRow from "./PreOrderRow";

const PreOrderTable = ({ preorderProducts, onChange }) => {
  return (
    <div className="w-7/12 overflow-y-auto">
      {/* 표 */}

      {/* 표 제목 */}
      <div className="text-center text-sm font-bold text-gray-800">
        PRE ORDER SCHEDULE
      </div>
      {/* 표 헤더 */}
      <div
        className="grid grid-cols-20 
        text-center bg-gray-800 p-1 
        text-gray-200 text-xs"
      >
        <div>커버</div>
        <div className="col-span-9">타이틀</div>
        <div className="col-span-3">출시일</div>
        <div className="col-span-3">주문마감일</div>
        <div className="col-span-2">가격</div>
        <div className="col-span-2">수량</div>
      </div>
      {/* 표 로우 */}
      <div className=" ">
        {preorderProducts &&
          preorderProducts.map(product => (
            <PreOrderRow
              key={product.id}
              id={product.id}
              title={product.data.title}
              relDate={product.data.relDate}
              preOrderDeadline={product.data.preOrderDeadline}
              thumbNail={product.data.thumbNail}
              name={product.id}
              price={product.data.price}
              onChange={onChange}
            />
          ))}
      </div>
    </div>
  );
};

export default PreOrderTable;
