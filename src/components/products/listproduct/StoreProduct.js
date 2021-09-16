import React, { useState } from "react";
import firebase from "firebase";
import { db } from "../../../firebase";

const StoreProduct = ({ product, user }) => {
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
            writer: user.nickName || user.email,
            amount: inputStock,
            date: new Date(),
          }),
        });
      setInputStock("");
      alert("수정 완료");
      // 바코드 입력받았을때 로직
    } else if (inputStock.toString().length >= 8) {
      alert("올바른 수량을 입력해 주세요");
    }
  };

  return (
    <form onSubmit={e => handleSubmit(e)}>
      <input
        type="number"
        className="border w-3/4 p-1 text-center outline-none"
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
