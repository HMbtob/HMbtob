import React from "react";
import "./Paging.css";
import Pagination from "react-js-pagination";
const Paging = ({ page, count, handlePageChange, itemsPerPage }) => {
  return (
    <Pagination
      activePage={page}
      itemsCountPerPage={itemsPerPage}
      totalItemsCount={count}
      pageRangeDisplayed={5}
      prevPageText={"‹"}
      nextPageText={"›"}
      onChange={handlePageChange}
    />
  );
};
export default Paging;
