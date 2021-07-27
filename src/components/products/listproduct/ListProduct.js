import React, { useContext } from "react";
import { InitDataContext } from "../../../App";
import ListProductRow from "./ListProductRow";
const ListProduct = () => {
  const state = useContext(InitDataContext);
  const { products } = state;

  // 헤더 항목
  const headers = [
    "수정",
    "SKU",
    "썸넬",
    "제목",
    "가격",
    "현재고",
    "총판매",
    "미발송",
    "출시일",
    "주문마감",
  ];
  return (
    <div className="flex flex-col w-full">
      <div className="ml-28 mt-32 text-gray-800 text-xl">상품목록</div>
      <div className="border w-5/6 m-auto mt-4">
        <div className="grid grid-cols-28 text-center border-b p-1 bg-gray-100 ">
          {headers.map((header, index) => (
            <div
              key={index}
              className={header === "제목" ? "col-span-10" : "col-span-2"}
            >
              {header}
            </div>
          ))}
        </div>
        {products.map(product => (
          <ListProductRow
            key={product.id}
            id={product.id}
            sku={product.data.sku}
            thumbNail={product.data.thumbNail}
            title={product.data.title}
            price={product.data.price}
            stock={product.data.stock}
            totalSell={product.data.totalSell}
            unShipped={product.data.unShipped}
            relDate={product.data.relDate}
            preOrderDeadline={product.data.preOrderDeadline}
          />
        ))}
      </div>
    </div>
  );
};

export default ListProduct;
