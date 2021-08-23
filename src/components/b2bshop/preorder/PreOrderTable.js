import React from "react";
import PreOrderRow from "./PreOrderRow";

const PreOrderTable = ({
  preorderProducts,
  onChange,
  user,
  exchangeRate,
  reStockRequest,
  simpleList,
}) => {
  return (
    <div className="flex flex-col w-11/12 h-64 mb-5">
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
              exchangeRate={exchangeRate}
              reStockRequest={reStockRequest}
              simpleList={simpleList}
            />
          ))}
      </div>
    </div>
  );
};

export default PreOrderTable;
