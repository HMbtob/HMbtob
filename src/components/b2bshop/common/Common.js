import React from "react";
import CommonRow from "./CommonRow";

export const Common = ({ commonProducts, dispatch, category, onChange }) => {
  const selectCat = e => {
    const { id } = e.target;
    dispatch({ type: "CATEGORY", category: id });
  };

  // 카테고리 추가는 여기서
  const categories = ["cd", "dvd", "per", "goods", "limited", "beauty"];

  return (
    <div className="flex flex-col w-11/12 mt-12 overflow-y-auto">
      <div
        className="grid grid-cols-6 grid-flow-col 
        text-center  bg-gray-200  
        text-gray-600 text-md font-semibold"
      >
        {categories.map((doc, index) => (
          <div
            key={index}
            onClick={selectCat}
            id={doc}
            className={`cursor-pointer ${
              category === doc ? "bg-gray-400 text-gray-100" : ""
            } `}
          >
            {doc.toUpperCase()}
          </div>
        ))}
      </div>
      <div
        className="grid grid-cols-20 grid-flow-col 
        text-center bg-gray-800 py-1 
        text-gray-200 text-sm font-semibold"
      >
        <div className="col-span-3">커버</div>
        <div className="col-span-8">타이틀</div>
        <div className="col-span-3">출시일</div>
        <div className="col-span-3">가격</div>
        <div className="col-span-3">수량</div>
      </div>
      <div>
        {commonProducts &&
          commonProducts
            .filter(a => a.data.category === category)
            .map(product => (
              <CommonRow
                key={product.id}
                id={product.id}
                title={product.data.title}
                relDate={product.data.relDate}
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
