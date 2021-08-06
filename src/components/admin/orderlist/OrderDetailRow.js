import React from "react";

const OrderDetailRow = ({
  id,
  title,
  price,
  quan,
  weight,
  totalWeight,
  dcRate,
  relDate,
  createdAt,
  changeHandler,
  checkedInputs,
}) => {
  const today = new Date();
  const preOrder = relDate.toDate() < today;
  return (
    <div
      className={` text-sm place-items-center grid grid-cols-28 grid-flow-col text-center border-b border-l border-r py-1 ${
        !preOrder ? "bg-red-200" : ""
      }`}
    >
      <input
        type="checkbox"
        className=" w-full"
        id={id}
        onChange={e => changeHandler(e.currentTarget.checked, id)}
        checked={checkedInputs.includes(id) ? true : false}
      />
      <div>{id}</div>
      <div className="col-span-2">{createdAt}</div>

      <div className="col-span-2">{relDate.toDate().toLocaleDateString()} </div>
      <div className="col-span-15">{title}</div>
      <div>{price} 원</div>
      <div className="col-span-2">
        {price - price * dcRate} 원 {`[${dcRate * 100}%]`}
      </div>
      <div>{weight} g</div>
      <div>{quan} 개</div>
      <div>{Math.round(totalWeight * 0.001 * 10) / 10} kg</div>
      <div>{(price - price * dcRate) * quan} 원</div>
    </div>
  );
};

export default OrderDetailRow;
