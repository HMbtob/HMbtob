import React, { useEffect, useState } from "react";
import CommonRow from "./CommonRow";
import Paging from "../b2bshop/mobile/Paging";

export const Common = ({
  commonProducts,
  dispatch,
  category,
  onChange,
  simpleList,
  user,
  exchangeRate,
  reStockRequest,
}) => {
  const selectCat = e => {
    const { id } = e.target;
    dispatch({ type: "CATEGORY", category: id });
  };

  // 페이징
  const [page, setPage] = useState(1);
  const count = commonProducts.filter(a => a.data.category === category).length;
  const handlePageChange = page => {
    setPage(page);
  };
  // 페이지당 항목수
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const handleItemsPerPage = e => {
    const { value } = e.target;
    setItemsPerPage(Number(value));
  };
  // 카테고리 추가는 여기서
  const categories = [
    { cd: "cd" },
    { dvdBlueRay: "dvd/blue-ray" },
    { photoBook: "photo book" },
    { goods: "goods/magazine" },
    { officialStore: "official store" },
    { beauty: "beauty" },
  ];
  useEffect(() => {
    setPage(1);
  }, [category]);

  return (
    <div className="flex flex-col h-lg w-11/12 mb-20 ">
      <div className="w-full flex justify-end text-xs">
        <select
          className="bg-transparent"
          value={itemsPerPage}
          onChange={handleItemsPerPage}
        >
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        개씩 보기
      </div>
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
        text-center bg-gray-800
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
            .slice(page * itemsPerPage - itemsPerPage, page * itemsPerPage)
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
                exchangeRate={exchangeRate}
                reStockRequest={reStockRequest}
              />
            ))}
      </div>
      <div className="flex flex-row w-full items-center justify-center">
        <Paging
          page={page}
          count={count}
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
        />{" "}
      </div>
    </div>
  );
};
