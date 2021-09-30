import React, { useEffect, useState } from "react";
import MobileRow from "./MobileRow";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import Paging from "./Paging";

const MobileTable = ({
  header,
  filteredProducts,
  user,
  exchangeRate,
  selectCat,
  categories,
  category,
}) => {
  const [toggleBottom, setToggleBottom] = useState(false);
  const onBottomClick = () => {
    setToggleBottom(!toggleBottom);
  };
  // 페이징
  const [page, setPage] = useState(1);
  const count = filteredProducts.length;
  const handlePageChange = page => {
    setPage(page);
  };

  return (
    <div
      className={`flex flex-col ${header === "Products" && "mb-12"}
    items-center bg-white border-b border-gray-500`}
    >
      <div
        onClick={onBottomClick}
        className="flex flex-row items-center 
        justify-center w-screen bg-blue-900 text-white"
      >
        <div className="text-lg py-1">{header}</div>
        <div>{toggleBottom ? <ArrowRightIcon /> : <ArrowDropDownIcon />}</div>
      </div>
      {!toggleBottom && (
        <div>
          {header === "Products" && (
            <div className="grid grid-cols-3">
              {categories.map((doc, index) => (
                <div
                  key={index}
                  onClick={selectCat}
                  id={Object.keys(doc)[0]}
                  className={` text-center py-1 border text-xs cursor-pointer ${
                    category === Object.keys(doc)[0]
                      ? "bg-gray-400 text-gray-100"
                      : ""
                  } `}
                >
                  {Object.values(doc)[0].toUpperCase()}
                </div>
              ))}
            </div>
          )}
          {filteredProducts &&
            filteredProducts.length > 0 &&
            filteredProducts
              .slice(page * 10 - 10, page * 10)
              .map((product, i) => (
                <MobileRow
                  key={i}
                  product={product}
                  user={user}
                  exchangeRate={exchangeRate}
                />
              ))}
          <Paging
            page={page}
            count={count}
            handlePageChange={handlePageChange}
          />{" "}
        </div>
      )}
    </div>
  );
};

export default MobileTable;
