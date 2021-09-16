import React, { useContext, useState } from "react";
import axios from "axios";
import { InitDataContext, InitDispatchContext } from "../../App";
import Rows from "./Rows";

const OrderProductList = () => {
  const state = useContext(InitDataContext);
  const dispatch = useContext(InitDispatchContext);
  const { allOrderProductsList } = state;

  const [sortedProducts, setSortedProducts] = useState([]);

  const callApi = async () => {
    await axios
      .get(
        "https://us-central1-interasiastock.cloudfunctions.net/app/big/getallproducts"
      )
      .then(res =>
        dispatch({
          type: "ALL_ORDER_PRODUCTS_LIST",
          allOrderProductsList: res,
        })
      )
      .catch(error => console.log(error));
    let preSorted = [].concat.apply([], allOrderProductsList?.data);

    preSorted.sort((a, b) => {
      return new Date(b.date_created) - new Date(a.date_created);
    });
    setSortedProducts(
      preSorted.filter(doc => {
        return new Date(doc.date_created) > new Date("2021-01-01");
      })
    );
  };

  return (
    <div className="flex flex-col mt-16">
      <button className="border bg-gray-600 text-gray-200" onClick={callApi}>
        불러오기
      </button>

      <div className="grid grid-cols-11 text-center border font-semibold">
        <div className="col-span-4">제목</div>
        <div>바코드</div>
        <div className="col-span-2">SKU</div>
        <div>가격</div>
        <div className="col-span-2">재고량</div>
        <div>판매량</div>
      </div>
      {sortedProducts &&
        sortedProducts.length > 10 &&
        sortedProducts.map(doc => (
          <Rows
            key={doc.id}
            id={doc.id}
            title={doc.name}
            total_sold={doc.total_sold}
            upc={doc.upc}
            price={doc.price}
            inventory_level={doc.inventory_level}
            sku={doc.sku}
          />
        ))}
    </div>
  );
};

export default OrderProductList;
