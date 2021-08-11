import React from "react";
import PreOrderRow from "./PreOrderRow";

const PreOrderTable = ({ preorderProducts, onChange, user }) => {
  return (
    <div className="flex flex-col w-11/12 h-1/4">
      {/* 표 */}

      {/* 표 제목 */}
      <div className="text-center text-sm font-bold text-gray-800">
        PRE ORDER
      </div>
      {/* 표 헤더 */}
      <div
        className="grid grid-cols-20 
        text-center bg-gray-800 p-1 
        text-gray-200 text-xs font-semibold"
      >
        <div>COVER</div>
        <div className="col-span-2">BARCODE</div>
        <div className="col-span-2">SKU</div>
        <div className="col-span-5">TITLE</div>
        <div className="col-span-2">RELEASE</div>
        <div className="col-span-2">DEADLINE</div>
        <div className="col-span-2">PRICE</div>
        <div className="col-span-2">SALE</div>
        <div className="col-span-2">EA</div>
      </div>
      {/* 표 로우 */}
      <div className="overflow-y-auto	scrollbar-hide">
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
              product={product}
              user={user}
            />
          ))}
      </div>
    </div>
  );
};

export default PreOrderTable;