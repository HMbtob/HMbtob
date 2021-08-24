import React from "react";
import { useRef } from "react";
import { useState } from "react";
import { db } from "../../../firebase";

const TopStoreProduct = ({ products, user, exchangeRate }) => {
  const [inputStock, setInputStock] = useState();
  const [inputBarcodes, setInputBarcodes] = useState();
  const [inputProduct, setInputProduct] = useState();
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const handleInputStock = e => {
    e.preventDefault();

    setInputStock(Number(e.target.value));
  };

  //   FIXME: find 를 filter로 바꾸고 여러개 떳을때 어캐할지 수정
  const handleBarcodes = async e => {
    e.preventDefault();
    setInputBarcodes(e.target.value);
    setInputProduct(
      products.find(product => product.data.barcode === e.target.value)
    );
  };

  const handleSubmit = async e => {
    e.preventDefault();
    inputRef1.current.focus();
  };

  const handleSubmit2 = async e => {
    e.preventDefault();
    // 여기서 await 로 빅커머스 토탈 솔드 가져오기
    // 재고수불부 업데이트
    // await db
    //   .collection("products")
    //   .doc(inputProduct.id)
    //   .update({
    //     totalStock: Number(inputProduct.totalStock) + Number(),
    //   });
    // 얼럿으로 완료
    setInputStock("");
    setInputBarcodes("");
    inputRef2.current.focus();
  };
  return (
    <div
      className="grid grid-cols-36 text-center border-b p-1 items-center
      bg-gray-100 sticky top-0 text-sm"
    >
      <div className="col-span-3 text-gray-500 text-md">재고조사</div>
      <form onSubmit={handleSubmit} className="col-span-4">
        <input
          type="number"
          className="p-1 outline-none border pl-3"
          placeholder="Barcode"
          value={inputBarcodes}
          onChange={handleBarcodes}
          ref={inputRef2}
        />
        <button type="submit"></button>
      </form>
      <div className="col-span-4">{inputProduct?.data.sku}</div>
      <div className="col-span-1"></div>
      <div className="col-span-12 text-left">{inputProduct?.data.title}</div>
      {inputProduct && (
        <div className="col-span-2">
          {exchangeRate[user?.currency] === 1
            ? (
                inputProduct?.data.price / exchangeRate[user?.currency]
              )?.toLocaleString("ko-KR")
            : (inputProduct?.data.price / exchangeRate[user?.currency])
                ?.toFixed(2)
                ?.toLocaleString("ko-KR")}{" "}
          {user?.currency}
        </div>
      )}

      {/* <div className="col-span-2">{inputProduct?.data.price}</div> */}
      <form onSubmit={handleSubmit2} className="col-span-1 w-20">
        <input
          type="number"
          className="border p-1 pl-3 
        outline-none w-20"
          value={inputStock}
          onChange={handleInputStock}
          ref={inputRef1}
          placeholder="입고수량"
        />

        <button type="submit"></button>
      </form>
      <div className=" col-span-9"></div>
    </div>
  );
};

export default TopStoreProduct;
