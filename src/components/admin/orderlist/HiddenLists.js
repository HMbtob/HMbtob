import React from "react";

const HiddenLists = ({ order, checkedInputs, changeHandler }) => {
  const today = new Date();
  return (
    <div
      className="grid-flow-col text-center
        border-b border-l border-r py-1 text-sm bg-white"
    >
      {order &&
        order?.data?.list?.map((li, i) => (
          <div
            key={i}
            className={`grid grid-cols-12 text-gray-700 
            items-center  ${
              li.relDate.toDate() > today &&
              li.moved === false &&
              li.canceled === false
                ? "bg-red-100"
                : li.moved === true && li.canceled === false
                ? "bg-green-300"
                : li.moved === false && li.canceled === true
                ? "bg-gray-300"
                : li.shipped === true
                ? "bg-blue-300"
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
            <div className="col-span-5 text-left">{li.title}</div>
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
    </div>
  );
};

export default HiddenLists;
