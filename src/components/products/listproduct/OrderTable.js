import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
// import { toDate } from "../../../utils/shippingUtils";
import OrderTableRow from "./OrderTableRow";

export default function OrderTable({ id, product, setOrderQty }) {
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
        <div className="col-span-2"></div>
        <div className="col-span-2">주문인</div>
        <div className="col-span-2">주문일</div>
        <div className="col-span-2">수량</div>
        <div className="col-span-4">MEMO</div>
      </div>
      {orderQtyHistory &&
        orderQtyHistory.map((de, i) => (
          <OrderTableRow de={de} key={i} id={id} setOrderQty={setOrderQty} />
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
