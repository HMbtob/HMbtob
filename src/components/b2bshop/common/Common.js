import React from "react";
import CommonRow from "./CommonRow";

export const Common = ({
  commonProducts,
  dispatch,
  category,
  onChange,
  simpleList,
  user,
}) => {
  const selectCat = e => {
    const { id } = e.target;
    dispatch({ type: "CATEGORY", category: id });
  };

  // 카테고리 추가는 여기서
  const categories = [
    { cd: "cd" },
    { dvdBlueRay: "dvd/blue-ray" },
    { photoBook: "photo book" },
    { goods: "goods" },
    { officialStore: "official store" },
    { beauty: "beauty" },
  ];

  return (
    <div className="flex flex-col h-3/5 w-11/12 mt-12 mb-20 ">
      <div
        className="grid grid-cols-6 grid-flow-col 
        text-center  bg-gray-200  
        text-gray-600 text-md font-semibold"
      >
        {categories.map((doc, index) => (
          <div
            key={index}
            onClick={selectCat}
            id={Object.keys(doc)}
            className={`text-sm cursor-pointer ${
              category === Object.keys(doc)[0]
                ? "bg-gray-400 text-gray-100"
                : ""
            } `}
          >
            {Object.values(doc)[0].toUpperCase()}
          </div>
        ))}
      </div>
      <div
        className="grid grid-cols-20 grid-flow-col 
        text-center bg-gray-800 py-1 
        text-gray-200 text-sm font-semibold"
      >
        <div className="col-span-2">COVER</div>
        <div className="col-span-2">BARCODE</div>
        <div className="col-span-2">SKU</div>
        <div className="col-span-5">TITLE</div>
        <div className="col-span-3">RELEASE</div>
        <div className="col-span-2">PRICE</div>
        <div className="col-span-2">SALE</div>
        <div className="col-span-2">EA</div>
      </div>
      <div className="overflow-y-auto	scrollbar-hide">
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
                product={product}
                simpleList={simpleList}
                user={user}
              />
            ))}
      </div>
    </div>
  );
};
