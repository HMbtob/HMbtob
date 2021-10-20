import React, { useState } from "react";
import CancelIcon from "@material-ui/icons/Cancel";
import UndoIcon from "@material-ui/icons/Undo";
import LocalAirportIcon from "@material-ui/icons/LocalAirport";
import { db } from "../../../firebase";

const MyOrderDetailRow = ({ order, id, currency, list, orderr }) => {
  const today = new Date();
  const preOrder = order.relDate.toDate() < today;
  const [qty, setQty] = useState(order.quan);
  const handleQty = e => {
    setQty(e.target.value);
  };

  const saveQty = e => {
    e.preventDefault();
    const childIndex = orderr.data.list.findIndex(
      li => li.childOrderNumber === id
    );

    orderr.data.list[childIndex].quan = Number(qty);
    orderr.data.list[childIndex].totalPrice =
      orderr.data.list[childIndex].price * qty;
    const fixedTotalPrice = orderr.data.list.reduce((i, c) => {
      return i + c.totalPrice;
    }, 0);
    db.collection("orders")
      .doc("b2b")
      .collection("b2borders")
      .doc(orderr.id)
      .update({ list: orderr.data.list, totalPrice: fixedTotalPrice });
    alert("It has been modified");
  };
  return (
    <form
      onSubmit={saveQty}
      className={`${order.shipped && " bg-blue-100"} ${
        order?.canceled && "bg-gray-100"
      } ${
        order?.moved && "bg-green-100"
      } text-xs place-items-center grid grid-cols-6 lg:grid-cols-28 grid-flow-col 
      text-center border-b border-l border-r py-1 ${
        !preOrder && !order?.moved && !order?.canceled ? "bg-red-100" : ""
      }`}
    >
      <div className="hidden lg:grid lg:col-span-3">{id}</div>
      <div className="hidden lg:grid lg:col-span-3">
        {order.createdAt.toDate().toLocaleDateString()}
      </div>

      <div className="hidden lg:grid lg:col-span-3">
        {order.relDate.toDate().toLocaleDateString()}{" "}
      </div>

      <div className="col-span-4 lg:gird lg:col-span-11 pl-1 text-left w-full flex flex-row">
        {order?.moved && (
          <>
            <div className="no-underline"> {order?.moveTo}</div>
            <UndoIcon style={{ color: "#1F2937", fontSize: "medium" }} />
          </>
        )}
        {order?.canceled && (
          <CancelIcon style={{ color: "#1F2937", fontSize: "medium" }} />
        )}{" "}
        {order?.shipped && (
          <LocalAirportIcon style={{ color: "#1F2937", fontSize: "medium" }} />
        )}
        <div
          className={`${(order?.moved || order?.canceled) && "line-through"} `}
        >
          {order.title}
        </div>
      </div>

      <div className="col-span-1 lg:gird lg:col-span-2">
        {currency === "KRW"
          ? order.price.toLocaleString("ko-KR")
          : order.price.toFixed(2).toLocaleString("ko-KR")}{" "}
        {currency}
      </div>
      <div className="col-span-1 lg:gird lg:col-span-2 flex flex-row items-center">
        {orderr &&
        (orderr.data.orderState === "Order" ||
          orderr.data.orderState === "Pre-Order" ||
          orderr.data.orderState === "Special-Order") ? (
          <>
            <input
              type="number"
              value={qty}
              onChange={handleQty}
              className="w-2/3 text-center outline-none py-1"
            />{" "}
            <button type="submit"></button>
          </>
        ) : (
          qty
        )}{" "}
        EA
      </div>

      <div className="hidden lg:grid lg:col-span-2">
        {qty && (order.price.toFixed(2) * qty).toLocaleString("ko-KR")}{" "}
        {currency}
      </div>
      <div className="hidden lg:grid lg:col-span-2">{order?.memoInList}</div>
    </form>
  );
};

export default MyOrderDetailRow;
