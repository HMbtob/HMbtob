import React from "react";
import CancelIcon from "@material-ui/icons/Cancel";
import UndoIcon from "@material-ui/icons/Undo";
const OrderDetailRow = ({
  id,
  title,
  price,
  quan,
  totalWeight,
  dcRate,
  relDate,
  createdAt,
  changeHandler,
  order,
  checkedInputs,
  aList,
}) => {
  const today = new Date();
  const preOrder = relDate.toDate() < today;
  // console.log(aList.moved);
  return (
    <div
      className={`${
        (aList?.moved || aList?.canceled) && "bg-gray-300"
      } text-xs place-items-center grid grid-cols-28 grid-flow-col 
      text-center border-b border-l border-r py-1 ${
        !preOrder && !aList?.moved && !aList?.canceled && !aList?.refunded
          ? "bg-red-200"
          : ""
      }`}
    >
      <input
        type="checkbox"
        className=" w-full"
        id={id}
        onChange={e => changeHandler(e.currentTarget.checked, id)}
        checked={checkedInputs.includes(id) ? true : false}
        disabled={aList?.moved || aList?.canceled}
      />
      <div>{id}</div>
      <div className="col-span-3">{createdAt}</div>

      <div className="col-span-3">{relDate.toDate().toLocaleDateString()} </div>
      <div className="col-span-12 text-left w-full flex flex-row">
        {aList?.moved && (
          <>
            <div className="no-underline"> {aList?.moveTo}</div>
            <UndoIcon style={{ color: "#1F2937", fontSize: "medium" }} />
          </>
        )}
        {aList?.canceled && (
          <CancelIcon style={{ color: "#1F2937", fontSize: "medium" }} />
        )}
        <div
          className={`${(aList?.moved || aList?.canceled) && "line-through"}`}
        >
          {title}
        </div>
      </div>
      <div className="col-span-2">
        {price.toLocaleString("ko-KR")} {order.data.currency}
      </div>

      <div className="col-span-2">{quan} EA</div>
      <div className="col-span-2">
        {Math.round(totalWeight * 0.001 * 10) / 10} kg
      </div>
      <div className="col-span-2">
        {(price.toFixed(2) * quan).toLocaleString("ko-KR")}{" "}
        {order.data.currency}
      </div>
    </div>
  );
};

export default OrderDetailRow;
