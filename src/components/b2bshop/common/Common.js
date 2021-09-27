import React, { useEffect, useState } from "react";
import CommonRow from "./CommonRow";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import LastPageIcon from "@material-ui/icons/LastPage";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";

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

  const [page, setPage] = useState(0);
  const [pages] = useState([-4, -3, -2, -1, 0, 1, 2, 3, 4]);

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
    setPage(0);
  }, [category]);

  return (
    <div className="flex flex-col h-lg w-11/12 mb-20 ">
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
            .slice(0 + page * 50, 50 + page * 50)
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
        <FirstPageIcon onClick={() => setPage(0)} className="cursor-pointer" />
        <ArrowLeftIcon
          className="cursor-pointer"
          onClick={() => (page === 0 ? setPage(0) : setPage(page - 1))}
        />
        {pages.map(
          (pag, i) =>
            pag + page > 0 &&
            pag + page <
              parseInt(
                commonProducts?.filter(a => a.data.category === category)
                  .length / 50
              ) +
                1 && (
              <div
                key={i}
                className={`cursor-pointer text-lg px-2 py-1 text-gray-600 ${
                  i === 5 && "font-bold"
                }`}
                onClick={() => setPage(page + pag - 1)}
              >
                {pag + page}{" "}
              </div>
            )
        )}
        <ArrowRightIcon
          className="cursor-pointer"
          onClick={() =>
            page ===
            parseInt(
              commonProducts?.filter(a => a.data.category === category).length /
                50
            ) -
              1
              ? setPage(
                  parseInt(
                    commonProducts?.filter(a => a.data.category === category)
                      .length / 50
                  ) - 1
                )
              : setPage(page + 1)
          }
        />
        <LastPageIcon
          className="cursor-pointer"
          onClick={() =>
            setPage(
              parseInt(
                commonProducts?.filter(a => a.data.category === category)
                  .length / 50
              ) - 1
            )
          }
        />
      </div>
    </div>
  );
};
