import React from "react";
import UndoIcon from "@material-ui/icons/Undo";

const HiddenLists = ({ order, checkedInputs, changeHandler }) => {
  const today = new Date();
  return (
    <div
      className="grid-flow-col text-center
        text-sm bg-white"
    >
      {order &&
        order.data.list
          .sort((a, b) => {
            return a?.title?.trim() < b?.title?.trim()
              ? -1
              : a?.title?.trim() > b?.title?.trim()
              ? 1
              : 0;
          })
          .map((li, i) => (
            <div
              key={i}
              className={`grid grid-cols-12 text-gray-700 
            items-center border-b border-dashed  ${
              li.relDate.toDate() > today &&
              li.moved === false &&
              li.canceled === false
                ? "bg-red-100"
                : li.moved === true && li.canceled === false
                ? "bg-green-100"
                : li.moved === false && li.canceled === true
                ? "bg-gray-100"
                : li.shipped === true
                ? "bg-blue-100"
                : ""
            }  `}
            >
              <input
                type="checkbox"
                className=" bg-yellow-300 w-full"
                id={li.childOrderNumber}
                onChange={e => {
                  changeHandler(e.currentTarget.checked, li.childOrderNumber);
                }}
                checked={
                  checkedInputs.includes(li.childOrderNumber) ? true : false
                }
                disabled={li.moved || li.canceled || li.shipped}
              />
              <div className="col-span-4 text-left flex flex-row">
                {li?.moved && (
                  <>
                    <div className="no-underline"> {li?.moveTo}</div>
                    <UndoIcon
                      style={{ color: "#1F2937", fontSize: "medium" }}
                    />
                  </>
                )}
                <div
                  className={`${(li?.moved || li?.canceled) && "line-through"}`}
                >
                  {li.title}
                </div>
              </div>
              <div className="col-span-1">
                {li.price.toLocaleString("ko-KR")} {li.currency}
              </div>
              <div className="col-span-1">{li.quan} ea</div>
              <div className="col-span-1">{li.barcode}</div>
              <div className="col-span-2">{li.sku}</div>
              <div className={`col-span-2 `}>
                {new Date(li.relDate.seconds * 1000)
                  .toISOString()
                  .substring(0, 10)}{" "}
              </div>
            </div>
          ))}
      <div className="flex flex-row w-full text-lg justify-evenly py-1">
        {" "}
        <div>Shipping Type : {order.data.shippingType}</div>
        <div>
          Shipping Fee :{" "}
          {order.data.currency === "KRW"
            ? Number(order.data.shippingFee.toFixed(0)).toLocaleString("ko-KR")
            : Number(order.data.shippingFee.toFixed(2)).toLocaleString(
                "ko-KR"
              )}{" "}
          {order.data.currency}
        </div>{" "}
      </div>
    </div>
  );
};

export default HiddenLists;
