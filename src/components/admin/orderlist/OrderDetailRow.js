import React from "react";

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
}) => {
  const today = new Date();
  const preOrder = relDate.toDate() < today;
  return (
    <div
      className={`text-xs place-items-center grid grid-cols-28 grid-flow-col 
      text-center border-b border-l border-r py-1 ${
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
      <div className="col-span-12">{title}</div>
      <div className="col-span-2">
        {Math.round(price).toLocaleString("ko-KR")} {order.data.currency}
      </div>
      <div className="col-span-2">
        {Math.round(price - price * dcRate).toLocaleString("ko-KR")}{" "}
        {order.data.currency}
      </div>
      <div className="col-span-2">{quan} EA</div>
      <div className="col-span-2">
        {Math.round(totalWeight * 0.001 * 10) / 10} kg
      </div>
      <div className="col-span-2">
        {Math.round((price - price * dcRate) * quan).toLocaleString("ko-KR")}{" "}
        {order.data.currency}
      </div>
    </div>
  );
};

export default OrderDetailRow;
