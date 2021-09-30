import React from "react";
import SearchIcon from "@material-ui/icons/Search";
import RestoreIcon from "@material-ui/icons/Restore";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

const MobileSearch = ({
  query,
  searchedProducts,
  queryOnChange,
  handleClear,
}) => {
  return (
    <div
      className="bg-gray-100 p-1 w-full 
      flex flex-row items-center sticky top-0 z-0"
    >
      <input
        type="text"
        className="h-10 rounded-sm outline-none pl-3 w-9/12"
        placeholder="search"
        onChange={queryOnChange}
        value={query}
      />{" "}
      <div className="flex flex-row justify-evenly w-3/12">
        <SearchIcon type="button" onClick={searchedProducts} />
        <RestoreIcon onClick={handleClear} className="cursor-pointer" />
        <div className="flex flex-row items-end">
          <ShoppingCartIcon />
          <div
            className="bg-red-600 text-xs text-white
           rounded-full text-center px-1 -ml-2"
          >
            1
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSearch;
