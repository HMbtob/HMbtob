import React from "react";
import DealRow from "./DealRow";

const DealTable = ({ dealProducts, onChange, user, exchangeRate }) => {
  return (
    <div className="flex flex-col w-11/12 h-64 mb-5">
      {/* 표 */}

      {/* 표 제목 */}

      {/* 표 헤더 */}
      <div
        className="grid grid-cols-20 
        text-center bg-gray-800 p-1 
        text-gray-200 text-xs font-semibold"
      >
        <div>COVER</div>
        <div className="col-span-4">SKU</div>
        <div className="col-span-7">TITLE</div>
        <div className="col-span-4">SALE PRICE</div>
        <div className="col-span-4">EA</div>
      </div>
      {/* 표 로우 */}
      <div className="overflow-y-auto	scrollbar-hide">
        {dealProducts &&
          dealProducts.map(product => (
            <DealRow
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
              exchangeRate={exchangeRate}
            />
          ))}
      </div>
    </div>
  );
};

export default DealTable;
