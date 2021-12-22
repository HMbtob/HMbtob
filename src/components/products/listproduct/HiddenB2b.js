import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import useInputs from "../../../hooks/useInput";

const HiddenB2b = ({
  id,
  price,
  stock,
  relDate,
  orders,
  shippings,
  currency,
  sku,
  product,
  orderListInShippings,
}) => {
  const [ordered, setOrdered] = useState([]);
  // const [shipped, setShipped] = useState([]);

  useEffect(() => {
    db.collectionGroup("order").onSnapshot(snapshot =>
      setOrdered(snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })))
    );

    // db.collectionGroup("orderListInShippings").onSnapshot(snapshot =>
    //   setShipped(snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })))
    // );
  }, []);
  // 총판매
  // // 총 미발송
  // console.log(
  //   "ordered",
  //   ordered
  //     .filter(doc => doc.data.productId === product.id)
  //     .reduce((a, c) => {
  //       return a + c.data.quan;
  //     }, 0)
  // );
  // console.log(
  //   "shipped",
  //   shipped
  //     .filter(doc => doc.data.productId === product.id)
  //     .reduce((a, c) => {
  //       return a + c.data.quan;
  //     }, 0)
  // );
  const totalUnshipped = [].concat
    .apply(
      [],
      orders.map(order =>
        order.data.list.filter(arr => arr.sku === sku && arr.canceled === false)
      )
    )
    .reduce((i, c) => {
      return i + c.quan;
    }, 0);
  // // 총 발송
  const totalshipped = [].concat
    .apply(
      [],
      shippings.map(shipping =>
        shipping.data.list.filter(arr => arr.sku === sku)
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
      <div className="col-span-9"></div>
      <div className="col-span-3 flex flex-row items-center justify-center">
        <div>{currency}</div>

        <input
          type="number"
          className="col-span-2 border w-3/4 p-1 text-center"
          name="handlePrice"
          value={handlePrice}
          onChange={onChange}
        />
      </div>

      <div className="col-span-2"></div>
      <input
        type="number"
        className="col-span-2 border w-3/4 p-1 text-center"
        name="handleStock"
        value={handleStock}
        onChange={onChange}
      />
      <div className="col-span-1">
        {totalUnshipped}(
        {orderListInShippings
          .filter(doc => doc.data.productId === product.id)
          .reduce((a, c) => {
            return a + c.data.quan;
          }, 0) +
          ordered
            .filter(doc => doc.data.productId === product.id)
            .reduce((a, c) => {
              return a + c.data.quan;
            }, 0)}{" "}
        )
      </div>
      <div className="col-span-1">
        {totalUnshipped - totalshipped}(
        {ordered
          .filter(doc => doc.data.productId === product.id)
          .reduce((a, c) => {
            return a + c.data.quan;
          }, 0)}
        )
      </div>
      <div className="col-span-2"></div>
      <div className="col-span-4 text-xs">
        {relDate &&
          new Date(relDate.seconds * 1000).toISOString().substring(0, 10)}
      </div>
    </div>
  );
};

export default HiddenB2b;
