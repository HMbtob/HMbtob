import React, {
  useEffect,
  //  useState
} from "react";

export function OrderListDetailRow({ order, register, checkAll, setValue }) {
  const today = new Date();
  const preOrder = order.data.relDate.toDate() < today;

  useEffect(() => {
    setValue(order.id, checkAll);
  }, [setValue, order.id, checkAll]);

  return (
    <div
      className={`${
        !preOrder ? "bg-red-100" : ""
      } grid grid-cols-36 text-center border-r border-b border-l py-1`}
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
      <div className="col-span-11 text-left">{order.data.title}</div>
      <div className="col-span-3">
        {Number(order.data.price).toLocaleString()} {order.data.currency}
      </div>
      <div>{order.data.quan} ea</div>
      <div className="col-span-3">
        {Number(order.data.totalPrice).toLocaleString()} {order.data.currency}
      </div>
      <div className="col-span-4 text-left">{order?.data?.memo}</div>
    </div>
  );
}
