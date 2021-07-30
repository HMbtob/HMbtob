import React from "react";

const UnshippedDetailRow = ({ list, checkedInputs, changeHandler }) => {
  const today = new Date();
  const preOrder =
    list.relDate.toDate().toLocaleDateString() < today.toLocaleDateString();
  return (
    <div
      className={` text-sm place-items-center grid grid-cols-28 grid-flow-col text-center border-b border-l border-r py-1 ${
        !preOrder ? "bg-red-200" : ""
      }`}
    >
      <input
        type="checkbox"
        className=" w-full"
        id={list.childOrderNumber}
        onChange={e =>
          changeHandler(e.currentTarget.checked, list.childOrderNumber)
        }
        checked={checkedInputs.includes(list.childOrderNumber) ? true : false}
      />
      <div>{list.childOrderNumber}</div>

      <div className="col-span-2">
        {list.createdAt.toDate().toLocaleDateString()}{" "}
      </div>
      <div className="col-span-2">
        {list.relDate.toDate().toLocaleDateString()}{" "}
      </div>
      <div className="col-span-15">{list.title}</div>
      <div>{list.price} 원</div>
      <div className="col-span-2">
        {list.price - list.price * list.dcRate} 원 {`[${list.dcRate * 100}%]`}
      </div>
      <div>{list.weight} g</div>
      <div>{list.quan} 개</div>
      <div>{Math.round(list.totalWeight * 0.001 * 10) / 10} kg</div>
      <div>{(list.price - list.price * list.dcRate) * list.quan} 원</div>
    </div>
  );
};

export default UnshippedDetailRow;
