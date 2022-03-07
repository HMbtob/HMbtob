import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { db } from "../../firebase";
import { toDate } from "../../utils/shippingUtils";
// import { OrderListRowPie } from "./OrderListPie";

export function OrderListRow({ acc, accounts }) {
  const history = useHistory();
  const today = new Date();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsub = db
      .collection("accounts")
      .doc(acc.id)
      .collection("order")
      .onSnapshot((snapshot) =>
        setOrders(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        )
      );
    return () => unsub();
  }, [acc]);
  return (
    <div className="grid grid-cols-9 text-center border-b border-l border-r py-1 items-center">
      <div
        onClick={() =>
          history.push({ pathname: `/orderlistdetail/${acc.id}`, state: acc })
        }
        className="cursor-pointer text-left pl-2"
      >
        {acc?.data?.nickName}
      </div>
      <div className="text-xs text-left col-span-2">{acc?.data?.email}</div>
      <div>
        <div className="text-md text-red-600 font-bold">
          {
            orders?.filter((order) =>
              // toDate(order?.data?.createdAt?.seconds) ===
              // today?.toISOString().substring(0, 10)
              {
                let today = new Date().getTime();
                let gap =
                  new Date(order?.data?.createdAt?.seconds * 1000).getTime() -
                  today;
                let day = Math.ceil(gap / (1000 * 60 * 60 * 24));
                return day < 3 && day >= 0;
              }
            )?.length
          }{" "}
          Type
        </div>

        <div className="text-2xs">
          (
          {orders
            ?.filter(
              (order) =>
                toDate(order?.data?.createdAt?.seconds) ===
                today?.toISOString().substring(0, 10)
            )
            ?.reduce((a, c) => {
              return a + Number(c.data.quan);
            }, 0)}
          EA)
        </div>
      </div>
      {/* 미확인주문/수량 */}
      <div>
        <div className="text-xs">
          {orders?.filter((order) => order?.data?.confirmed !== true)?.length}{" "}
          Type
        </div>
        <div className="text-2xs">
          (
          {orders
            ?.filter((order) => order?.data?.confirmed !== true)
            ?.reduce((a, c) => {
              return a + Number(c.data.quan);
            }, 0)}{" "}
          EA)
        </div>
      </div>
      {/* 확인된 주문/수량 */}
      <div>
        <div className="text-xs">
          {orders?.filter((order) => order?.data?.confirmed === true)?.length}{" "}
          Type
        </div>
        <div className="text-2xs">
          (
          {orders
            ?.filter((order) => order?.data?.confirmed === true)
            ?.reduce((a, c) => {
              return a + Number(c.data.quan);
            }, 0)}{" "}
          EA)
        </div>
      </div>
      {/* 취소된주문/수량 */}
      <div>
        <div className="text-xs">
          {orders?.filter((order) => order?.data?.canceled === true)?.length}{" "}
          Type
        </div>
        <div className="text-2xs">
          (
          {orders
            ?.filter((order) => order?.data?.canceled === true)
            ?.reduce((a, c) => {
              return a + Number(c.data.quan);
            }, 0)}{" "}
          EA)
        </div>
      </div>
      <div className="text-xs">
        {
          accounts.find((account) => account.id === acc?.data?.inCharge)?.data
            ?.nickName
        }
      </div>
    </div>
  );
}
