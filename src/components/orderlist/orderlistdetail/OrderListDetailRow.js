import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { krwComma } from "../../../utils/shippingUtils";

export function OrderListDetailRow({ order, register, checkAll, setValue }) {
  const today = new Date();
  const preOrder = order.data.relDate.toDate() < today;

  const [price, setPrice] = useState(order.data.price);
  const [qty, setQty] = useState(order.data.quan);

  const saveDetail = () => {
    console.log("order", order);
    console.log("price", price);
    console.log("qty", qty);
    try {
      db.collection("accounts")
        .doc(order.data.customer || order.data.userId)
        .collection("order")
        .doc(order.id)
        .update({
          price: Number(price),
          quan: Number(qty),
          totalPrice: Number(price) * Number(qty),
        });
      alert("수정되었습니다.");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setValue(order.id, checkAll);
  }, [setValue, order.id, checkAll]);

  return (
    <div
      className={`${
        !preOrder ? "bg-red-100" : ""
      } grid grid-cols-36 text-center border-r border-b border-l py-1 text-sm`}
    >
      <div>
        <input {...register(`${order.id}`)} type="checkbox" />
      </div>
      <div className="col-span-3">{order.data.country}</div>
      <div className="col-span-2">
        {new Date(order.data.createdAt.seconds * 1000)
          .toISOString()
          .substring(0, 10)}
      </div>
      <div className="col-span-2">
        {new Date(order.data.relDate.seconds * 1000)
          .toISOString()
          .substring(0, 10)}
      </div>
      <div className="col-span-3">{order.data.sku}</div>
      <div className="col-span-3">{order.data.barcode}</div>
      <div className="col-span-10 flex flex-row items-center justify-between">
        <div className="text-left">{order.data.title}</div>
        <button type="button" onClick={() => saveDetail()}>
          수정
        </button>{" "}
      </div>
      <div className="col-span-3 flex flex-row justify-center">
        {/* {Number(order.data.price).toLocaleString()} {} */}
        <input
          type="text"
          value={krwComma(price, order.data.currency)}
          onChange={e => {
            const { value } = e.target;
            const onlyNumber = value.replace(/[^0-9]/g, "");
            setPrice(onlyNumber);
          }}
          className="w-2/3 text-right pr-2 border outline-none"
        />
        {order.data.currency}
      </div>
      <div className="flex flex-row justify-center col-span-2">
        <input
          type="number"
          value={qty}
          onChange={e => setQty(e.target.value)}
          className="w-2/3 text-right pr-2 border outline-none"
        />{" "}
        {/* {order.data.quan}  */}
        ea
      </div>
      <div className="col-span-3">
        {Number(order.data.totalPrice).toLocaleString()} {order.data.currency}
      </div>
      <div className="col-span-4 text-left">{order?.data?.memo}</div>
    </div>
  );
}
