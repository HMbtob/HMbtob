import React, { useEffect, useState } from "react";

export function ToTals({ orders }) {
  const [qty, setQty] = useState(0);
  const [amount, setAmount] = useState(0);
  useEffect(() => {
    setQty(
      orders.reduce((a, c) => {
        return a + Number(c.data.quan);
      }, 0)
    );
    setAmount(
      orders.reduce((a, c) => {
        return a + Number(c.data.totalPrice);
      }, 0)
    );
  }, [orders]);
  return (
    <div>
      <div>전체 종류 : {orders?.length} 종</div>
      <div>전체 수량 : {qty} ea</div>
      <div>
        전체 액수 : {amount?.toLocaleString()} {orders[0]?.data?.currency}
      </div>
    </div>
  );
}
