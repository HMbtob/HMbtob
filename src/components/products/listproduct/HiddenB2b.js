import React from "react";
import { db } from "../../../firebase";
import useInputs from "../../../hooks/useInput";

const HiddenB2b = ({ id, price, stock, relDate, orders, shippings }) => {
  // 총판매
  // // 총 미발송
  const totalUnshipped = [].concat
    .apply(
      [],
      orders.map(order => order.data.list.filter(arr => arr.productId === id))
    )
    .reduce((i, c) => {
      return i + c.quan;
    }, 0);
  // // 총 발송
  const totalshipped = [].concat
    .apply(
      [],
      shippings.map(shipping =>
        shipping.data.list.filter(arr => arr.productId === id)
      )
    )
    .reduce((i, c) => {
      return i + c.quan;
    }, 0);

  // 간단 수정창 input 관리
  const [form, onChange] = useInputs({
    handlePrice: price,
    handleStock: stock,
  });

  const { handlePrice, handleStock } = form;

  const simpleSave = async () => {
    await db
      .collection("products")
      .doc(id)
      .update({ price: handlePrice, stock: handleStock });
    await alert("수정됨");
  };
  return (
    <div
      className="grid grid-cols-36 items-center 
place-items-center text-xs bg-transparent"
    >
      <button onClick={simpleSave} className="col-span-2">
        b2b-수정
      </button>
      <div className="col-span-5 flex flex-row justify-start w-full"></div>
      <div className="col-span-3"></div>
      <div className="col-span-2"></div>
      <div className="col-span-12"></div>
      <input
        type="number"
        className="col-span-2 border w-3/4 p-1 text-center"
        name="handlePrice"
        value={handlePrice}
        onChange={onChange}
      />
      <div className="col-span-2"></div>
      <input
        type="number"
        className="col-span-2 border w-3/4 p-1 text-center"
        name="handleStock"
        value={handleStock}
        onChange={onChange}
      />
      <div className="col-span-1">{totalUnshipped + totalshipped}</div>
      <div className="col-span-1">{totalUnshipped}</div>
      <div className="col-span-2"></div>
      <div className="col-span-2 text-xs">
        {relDate &&
          new Date(relDate.seconds * 1000).toISOString().substring(0, 10)}
      </div>
    </div>
  );
};

export default HiddenB2b;
