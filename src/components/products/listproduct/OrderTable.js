import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { toDate } from "../../../utils/shippingUtils";

export default function OrderTable({ id, product }) {
  const [totalOrder, setTotalOrder] = useState(null);

  const [orderQtyHistory, setOrderQtyHistory] = useState([]);
  useEffect(() => {
    setTotalOrder(orderQtyHistory.reduce((a, c) => a + c.data.orderQty, 0));
  }, [orderQtyHistory]);

  useEffect(() => {
    db.collection("products")
      .doc(id)
      .collection("orderQty")
      .orderBy("createdAt", "asc")
      .onSnapshot((snapshot) =>
        setOrderQtyHistory(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        )
      );
  }, [id]);
  return (
    <div className="overflow-y-auto">
      <div className="mb-2 font-semibold text-base">주문 수량</div>
      <div className="mb-2  text-sm">
        {product?.data?.title ? product?.data?.title : product.productName}
      </div>

      <div className="grid grid-cols-12 text-gray-200 bg-gray-800 text-center">
        <div className="col-span-8">주문일</div>
        <div className="col-span-4">수량</div>
      </div>
      {orderQtyHistory &&
        orderQtyHistory.map((de, i) => (
          <div
            key={i}
            className={`grid grid-cols-12 text-center border-b  py-1 place-items-center 
              
            `}
          >
            <div className="col-span-8">
              {de?.data?.createdAt && toDate(de.data.createdAt.seconds)}
            </div>

            <div className="col-span-4">{de.data.orderQty}</div>
          </div>
        ))}
      <div
        className="grid grid-cols-12 text-center 
      border-b border-t-4 py-1 place-items-center"
      >
        <div className="col-span-2">총 주문 수량</div>
        <div className="col-span-6"></div>
        <div className="col-span-4 text-sm font-semibold">
          {" "}
          {totalOrder && totalOrder}{" "}
        </div>
      </div>
    </div>
  );
}
