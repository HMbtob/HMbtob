import React, { useContext, useEffect, useState } from "react";
import { InitDataContext } from "../../../App";
import MyOrderListRow from "./MyOrderListRow";

const MyOrderList = () => {
  const state = useContext(InitDataContext);
  const { orders, user } = state;
  const userOrders = orders.filter(order => order.data.customer === user.email);
  const [unshipped, setUnshipped] = useState([]);

  useEffect(() => {
    setUnshipped(
      [].concat
        .apply(
          [],
          orders
            .filter(arr1 => arr1.data.customer === user.email)
            .map(arr2 => arr2.data.list)
        )
        .filter(
          arr3 =>
            arr3.moved === false &&
            arr3.canceled === false &&
            arr3.shipped === false
        )
    );
  }, [orders, user.email]);
  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-full lg:w-11/12 flex-col mt-8 lg:mt-20">
        <div
          className="w-full text-center my-4 text-gray-800 
       font-semibold text-lg"
        >
          My Orders
        </div>
        <div
          className="grid grid-cols-8 lg:grid-cols-7  grid-flow-col text-center 
       bg-gray-800 text-gray-100 py-1 rounded-none lg:rounded-sm text-xs font-semibold"
        >
          <div className="col-span-2 lg:grid lg:col-span-1">ORDER NUM</div>
          <div className="col-span-3 lg:grid lg:col-span-2">DATE</div>
          <div className="col-span-2 lg:grid lg:col-span-1 ">STATUS</div>
          <div className="hidden lg:grid">PRICE</div>
          <div className="hidden lg:grid">SORTS</div>
          <div>EA</div>
        </div>
        <div>
          {userOrders &&
            userOrders.map(order => (
              <MyOrderListRow
                key={order.id}
                id={order.id}
                orderNumber={order.data.orderNumber}
                createdAt={order.data.createdAt}
                customer={order.data.customer}
                orderState={order.data.orderState}
                order={order}
              />
            ))}
        </div>
        <div className="w-full mb-12 flex flex-col items-center text-sm mt-12">
          <div
            className="w-full text-center my-4 text-gray-800 
                      font-semibold text-lg"
          >
            Total quantity by product
          </div>
          <div
            className="grid grid-cols-12 text-center bg-gray-800 
                      rounded-sm text-gray-100 text-sm py-1 w-3/4"
          >
            <div className="col-span-2">Barcode</div>
            <div className="col-span-2">SKU</div>
            <div className="col-span-1">RELEASE</div>
            <div className="col-span-6">Title</div>
            <div className="col-span-1">Qty</div>
          </div>

          {unshipped &&
            [
              ...new Set(
                unshipped
                  .filter(
                    doc =>
                      doc.moved === false &&
                      doc.canceled === false &&
                      doc.shipped === false
                  )
                  .sort((a, b) => {
                    return a?.title?.trim() < b?.title?.trim()
                      ? -1
                      : a?.title?.trim() > b?.title?.trim()
                      ? 1
                      : 0;
                  })
                  .map(li => li.title)
              ),
            ]
              .reduce((acc, cur) => {
                acc.push(
                  unshipped
                    .filter(li => li.title.trim() === cur.trim())
                    .reduce(
                      (a, c) => {
                        return {
                          title: c.title.trim(),
                          quan: Number(a.quan) + Number(c.quan),
                          barcode: c.barcode,
                          sku: c.sku,
                          relDate: new Date(c.relDate?.seconds * 1000),
                        };
                      },
                      { title: "", quan: 0, barcode: "", sku: "", relDate: "" }
                    )
                );
                return acc;
              }, [])
              .map((li, i) => (
                <div key={i} className="grid grid-cols-12 w-3/4 border py-1">
                  <div className="col-span-2 text-center">{li.barcode}</div>
                  <div className="col-span-2 text-center">{li.sku}</div>
                  <div className="col-span-1 text-center">
                    {li.relDate.toISOString().substring(0, 10)}
                  </div>
                  <div className="col-span-6 pl-3">{li.title}</div>
                  <div className="col-span-1 text-center">{li.quan} EA</div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrderList;
