import React from "react";
import CancelIcon from "@material-ui/icons/Cancel";
import UndoIcon from "@material-ui/icons/Undo";
import LocalAirportIcon from "@material-ui/icons/LocalAirport";

const MyOrderDetailRow = ({ order, id, totalWeight, currency }) => {
  const today = new Date();
  const preOrder = order.relDate.toDate() < today;
  return (
    <div
      // className={` text-xs place-items-center grid grid-cols-28
      // grid-flow-col text-center border-b border-l border-r py-1 ${
      //   !preOrder ? "bg-red-200" : ""
      // }`}
      className={`${order.shipped && " bg-blue-300"} ${
        (order?.moved || order?.canceled) && "bg-gray-300"
      } text-xs place-items-center grid grid-cols-28 grid-flow-col 
      text-center border-b border-l border-r py-1 ${
        !preOrder && !order?.moved && !order?.canceled ? "bg-red-200" : ""
      }`}
    >
      <div className="col-span-3">{id}</div>
      <div className="col-span-3">
        {order.createdAt.toDate().toLocaleDateString()}
      </div>

      <div className="col-span-3">
        {order.relDate.toDate().toLocaleDateString()}{" "}
      </div>

      <div className="col-span-13 text-left w-full flex flex-row">
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
          className={`${(order?.moved || order?.canceled) && "line-through"}`}
        >
          {order.title}
        </div>
      </div>

      <div className="col-span-2">
        {currency === "KRW"
          ? order.price.toLocaleString("ko-KR")
          : order.price.toFixed(2).toLocaleString("ko-KR")}{" "}
        {currency}
      </div>
      <div className="col-span-2">{order.quan} EA</div>

      <div className="col-span-2">
        {(order.price.toFixed(2) * order.quan).toLocaleString("ko-KR")}{" "}
        {currency}
      </div>
    </div>
  );
};

export default MyOrderDetailRow;
