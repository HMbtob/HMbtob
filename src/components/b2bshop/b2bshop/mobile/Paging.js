import React, { useState } from "react";
import "./Paging.css";
import Pagination from "react-js-pagination";
const Paging = ({ page, count, handlePageChange }) => {
  return (
    <Pagination
      activePage={page}
      itemsCountPerPage={10}
      totalItemsCount={count}
      pageRangeDisplayed={5}
      prevPageText={"‹"}
      nextPageText={"›"}
      onChange={handlePageChange}
    />
  );
};
export default Paging;
