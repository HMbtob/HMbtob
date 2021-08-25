import React from "react";

const HiddenLists = ({
  order,
  checkedInputs,
  changeHandler,
  handleCheckedAllItems,
}) => {
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
            items-center  ${li.relDate.toDate() > today && "bg-red-100"}`}
          >
            {/* <div className="col-span-1">버튼</div> */}
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
            />
            <div className="col-span-4 text-left">{li.title}</div>
            <div className="col-span-1">{li.quan} ea</div>
            <div className="col-span-1">{li.barcode}</div>
            <div className="col-span-1">{li.sku}</div>
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
