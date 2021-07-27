import React from "react";
import { useHistory } from "react-router";
const ListProductRow = ({
  id,
  sku,
  thumbNail,
  title,
  price,
  stock,
  totalSell,
  unShipped,
  relDate,
  preOrderDeadline,
}) => {
  const history = useHistory();
  return (
    <div className="grid grid-cols-28 items-center place-items-center text-sm p-1 bg-white">
      <button
        className="col-span-2 bg-gray-500 px-2 py-1 rounded-md text-gray-200"
        onClick={() => history.push(`/detailproduct/${id}`)}
      >
        DETAIL
      </button>
      <div className="col-span-2">{sku}</div>
      <img className="col-span-2 h-10 rounded" src={thumbNail} alt={id} />
      <div className="col-span-10">{title}</div>
      <div className="col-span-2">{price}원</div>
      <div className="col-span-2">{stock}</div>
      <div className="col-span-2">{totalSell}</div>
      <div className="col-span-2">{unShipped}</div>
      <div className="col-span-2 text-xs">
        {new Date(relDate.toDate()).toLocaleDateString()}
      </div>

      <div className="col-span-2 text-xs">
        {new Date(preOrderDeadline.toDate()).toLocaleDateString()}
      </div>
    </div>
  );
};

export default ListProductRow;
