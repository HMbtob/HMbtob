import React from "react";
import CancelIcon from "@material-ui/icons/Cancel";
import UndoIcon from "@material-ui/icons/Undo";
import LocalAirportIcon from "@material-ui/icons/LocalAirport";
import ImageIcon from "@material-ui/icons/Image";
import LinkIcon from "@material-ui/icons/Link";
import { useState } from "react";
import { db } from "../../../firebase";
const OrderDetailRow = ({
  id,
  title,
  price,
  quan,
  totalWeight,
  relDate,
  createdAt,
  changeHandler,
  order,
  checkedInputs,
  aList,
}) => {
  const today = new Date();
  const preOrder = relDate.toDate() < today;

  const [fixedPrice, setFixedPrice] = useState(price);
  const handleFixedPrice = e => {
    setFixedPrice(Number(e.target.value));
  };
  const [fixedQuan, setFixedQuan] = useState(quan);
  const handleFixedQuan = e => {
    setFixedQuan(Number(e.target.value));
  };

  // 수정
  const saveFix = e => {
    e.preventDefault();
    const childIndex = order.data.list.findIndex(
      li => li.childOrderNumber === aList.childOrderNumber
    );
    order.data.list[childIndex].price = fixedPrice;
    order.data.list[childIndex].quan = fixedQuan;
    order.data.list[childIndex].totalPrice = fixedPrice * fixedPrice;
    db.collection("orders")
      .doc("b2b")
      .collection("b2borders")
      .doc(order.id)
      .update({ list: order.data.list });
  };
  return (
    <form
      onSubmit={saveFix}
      className={`${aList.shipped && " bg-blue-100"}
      ${aList?.moved && "bg-green-100"} ${
        aList?.canceled && "bg-gray-100"
      } text-xs place-items-center grid grid-cols-28 grid-flow-colfixedPrice 
      text-center border-b border-l border-r py-1 ${
        !preOrder && !aList?.moved && !aList?.canceled ? "bg-red-100" : ""
      }`}
    >
      <input
        type="checkbox"
        className=" w-full"
        id={id}
        onChange={e => changeHandler(e.currentTarget.checked, id)}
        checked={checkedInputs.includes(id) ? true : false}
        disabled={aList?.moved || aList?.canceled || aList?.shipped}
      />
      <div className="col-span-3">{id}</div>
      <div className="col-span-2">{createdAt}</div>

      <div className="col-span-2">{relDate.toDate().toLocaleDateString()} </div>
      <div className="col-span-12 text-left w-full flex flex-col">
        <div className="flex flex-row">
          {aList?.moved && (
            <>
              <div className="no-underline"> {aList?.moveTo}</div>
              <UndoIcon style={{ color: "#1F2937", fontSize: "medium" }} />
            </>
          )}
          {aList?.canceled && (
            <CancelIcon style={{ color: "#1F2937", fontSize: "medium" }} />
          )}
          {aList?.shipped && (
            <LocalAirportIcon
              style={{ color: "#1F2937", fontSize: "medium" }}
            />
          )}
          <div
            className={`${(aList?.moved || aList?.canceled) && "line-through"}`}
          >
            {title}
          </div>
        </div>
        <div>
          {aList.titleUrl && (
            <button onClick={() => window.open(`${aList.titleUrl}`, "_blank")}>
              <LinkIcon fontSize="small" />
            </button>
          )}{" "}
          {aList.thumbNailUrl && (
            <button
              onClick={() => window.open(`${aList.thumbNailUrl}`, "_blank")}
            >
              <ImageIcon fontSize="small" />
            </button>
          )}{" "}
        </div>
      </div>
      <div className="col-span-2 flex flex-row bg-white p-1 border">
        {/* {price && price?.toLocaleString("ko-KR")}{" "} */}
        <input
          type="number"
          value={fixedPrice}
          onChange={handleFixedPrice}
          step="0.01"
          className="w-16 text-center outline-none"
        />
        {order && order?.data?.currency}
      </div>

      <div className="col-span-2 flex flex-row bg-white p-1 border">
        <input
          type="number"
          value={fixedQuan}
          onChange={handleFixedQuan}
          step="0.01"
          className="w-12 text-center outline-none"
        />
        {/* {quan && quan}  */}
        <button type="submit"></button>
        EA
      </div>
      <div className="col-span-2">
        {totalWeight && ((totalWeight * 0.001 * 10) / 10).toFixed(2)} kg
      </div>
      <div className="col-span-2">
        {price && quan && (price.toFixed(2) * quan).toLocaleString("ko-KR")}{" "}
        {order && order.data.currency}
      </div>
    </form>
  );
};

export default OrderDetailRow;
