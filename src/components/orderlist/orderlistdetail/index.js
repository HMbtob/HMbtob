import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { useForm } from "react-hook-form";
import { OrderListDetailHeader } from "./OrderListDetailHeader";
import { OrderListDetailPrice } from "./OrderListDetailPrice";

export function OrderListDetail({ match, location }) {
  const { id } = match.params;
  const { state } = location;
  const [orders, setOrders] = useState([]);
  const { register, handleSubmit, setValue, getValues } = useForm();

  // for 전체선택
  const [checkAll, setCheckAll] = useState(false);

  const OrderListDetailRow = React.lazy(() =>
    import("./OrderListDetailRow").then(module => ({
      default: module.OrderListDetailRow,
    }))
  );

  useEffect(() => {
    db.collection("accounts")
      .doc(id)
      .collection("order")
      .onSnapshot(snapshot =>
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })))
      );
  }, [id]);
  return (
    <form className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-11/12 flex-col mt-20">
        <div
          className="text-center text-xl bg-gray-800 py-1 
        rounded-sm font-bold text-gray-100 mb-5 w-full"
        >
          유저별 주문 확인
        </div>

        <OrderListDetailHeader />
        {orders.map((order, i) => (
          <React.Suspense key={i} fallback={<div>Loading...</div>}>
            <OrderListDetailRow
              order={order}
              register={register}
              checkAll={checkAll}
              setValue={setValue}
            />
          </React.Suspense>
        ))}
        <div>
          <button
            type="button"
            onClick={() => setCheckAll(!checkAll)}
            className=" bg-blue-900 text-white py-1 px-3 rounded-sm my-3"
          >
            전체선택
          </button>
          <button
            type="button"
            onClick={() => setCheckAll(!checkAll)}
            className=" bg-blue-900 text-white py-1 px-3 rounded-sm my-3"
          >
            PickUp List
          </button>
        </div>
        <OrderListDetailPrice
          handleSubmit={handleSubmit}
          getValues={getValues}
          orders={orders}
          account={state}
        />
      </div>
    </form>
  );
}
