import React from "react";
import { useState } from "react";
import { db } from "../../../firebase";
import firebase from "firebase";

const StoreProduct = ({
  stockHistory,
  bigTotalSold,
  totalStock,
  product,
  user,
  products,
}) => {
  const [inputStock, setInputStock] = useState();

  const handleInputStock = e => {
    setInputStock(Number(e.target.value));
  };
  const handleSubmit = async e => {
    e.preventDefault();

    // 수량 인풋받았을때 로직
    if (inputStock.toString().length < 10) {
      await db
        .collection("products")
        .doc(product.id)
        .update({
          totalStock: product.data.totalStock + inputStock,
          stockHistory: firebase.firestore.FieldValue.arrayUnion({
            type: prompt(
              "거래처를 입력해주세요(미입력시 재고조정)",
              "재고조정"
            ),
            writer: user.email,
            amount: inputStock,
            date: new Date(),
          }),
        });
      setInputStock("");
      alert("수정 완료");
      // 바코드 입력받았을때 로직
    } else if (inputStock.toString().length >= 8) {
      alert("올바른 수량을 입력해 주세요");
      // // 입력받은 바코드로 상품검색해서 보여주기
      // if (
      //   window.confirm(
      //     `검색한 상품이 맞습니까? ${
      //       products.find(
      //         product => product.data.barcode === inputStock.toString()
      //       ).data.title
      //     }`
      //   )
      // ) {
      //   const barcodeStock = prompt("재고 조사한 총 수량을 입력하세요");
      //   if (!parseInt(barcodeStock)) {
      //     return alert("숫자를 입력해 주세요");
      //   }
      //   const barcodeType = prompt(
      //     "거래처를 입력해주세요(미입력시 재고조정)",
      //     "재고조정"
      //   );
      //   // 현재 totalStock
      //   const barcodeTotalStock = Number(
      //     products.find(
      //       product => product.data.barcode === inputStock.toString()
      //     ).data.totalStock
      //   );

      //   await db
      //     .collection("products")
      //     .doc(
      //       products.find(
      //         product => product.data.barcode === inputStock.toString()
      //       ).id
      //     )
      //     .update({
      //       totalStock: Number(barcodeStock) + Number(bigTotalSold),
      //       stockHistory: firebase.firestore.FieldValue.arrayUnion({
      //         type: barcodeType,
      //         writer: user.email,
      //         amount:
      //           (Number(barcodeTotalStock) -
      //             Number(barcodeStock) -
      //             Number(bigTotalSold)) *
      //           -1,
      //         date: new Date(),
      //       }),
      //     });
      //   setInputStock("");
      //   alert("수정 완료");
      // } else {
      //   alert("검색하신 바코드는 없는 바코드 입니다");
      // }
    }
  };

  return (
    <form onSubmit={e => handleSubmit(e)}>
      <input
        type="number"
        className="border w-3/4 p-1 text-center"
        value={inputStock}
        onChange={handleInputStock}
      />
      <button type="submit"></button>
    </form>
  );
};

export default StoreProduct;
// 개별 row에서 재고 조정
// 1. 숫자 인풋 받은걸로 해당 상품의 totalStock 수정 추가
// 2. 프롬프트 에서 입력받은 거래처명과 입력받은 숫자 인풋으로 stockHistory 수정

// 재고조사 상황
// a. 바코드 입력받으면 confirm으로 상품명으로 확인 맞으면 수량입력받고 거래처 or 재고조정 입력받기
