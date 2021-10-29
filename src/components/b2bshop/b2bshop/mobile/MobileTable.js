import React, { useState } from "react";
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
  simpleList,
  onChange,
}) => {
  const [toggleBottom, setToggleBottom] = useState(false);
  const onBottomClick = () => {
    setToggleBottom(!toggleBottom);
  };
  // 페이징
  const [page, setPage] = useState(1);
  const count = filteredProducts.filter(
    a => a.data.category === category
  ).length;
  const handlePageChange = page => {
    setPage(page);
  };

  // 페이지당 항목수
  const [itemsPerPage, setItemsPerPage] = useState(50);
  // const handleItemsPerPage = e => {
  //   const { value } = e.target;
  //   setItemsPerPage(Number(value));
  // };

  return (
    <div
      className={`flex flex-col ${header === "Products" && "mb-14"}
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
          header === "Products"
            ? filteredProducts
                .filter(a => a.data.category === category)
                .slice(page * itemsPerPage - itemsPerPage, page * itemsPerPage)
                .map((product, i) => (
                  <MobileRow
                    key={i}
                    product={product}
                    user={user}
                    exchangeRate={exchangeRate}
                    simpleList={simpleList}
                    onChange={onChange}
                  />
                ))
            : filteredProducts
                .slice(page * 20 - 20, page * 20)
                .map((product, i) => (
                  <MobileRow
                    key={i}
                    product={product}
                    user={user}
                    exchangeRate={exchangeRate}
                    simpleList={simpleList}
                    onChange={onChange}
                  />
                ))}
          <Paging
            page={page}
            count={count}
            handlePageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
          />{" "}
        </div>
      )}
    </div>
  );
};

export default MobileTable;
