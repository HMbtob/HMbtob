import React from "react";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
const SimpleListRow = ({
  title,
  quan,
  price,
  totalPrice,
  onChange,
  id,
  simpleList,
  deleteList,
}) => {
  return (
    <div className="grid grid-cols-7 place-items-center text-center text-xs py-1 border-b border-l border-r bg-gray-100">
      <div className="col-span-3">{title}</div>
      <div className="col-span-2">
        <input
          type="number"
          id={id}
          name={id}
          onChange={onChange}
          value={simpleList?.find(list => list.productId === id)?.quan}
          className=" w-1/3 h-7 border text-center"
        />
        <HighlightOffIcon onClick={() => deleteList(id)} />{" "}
      </div>
      <div className="col-span-1">{price?.toLocaleString("ko-KR")}</div>
      <div className="col-span-1">{totalPrice?.toLocaleString("ko-KR")}</div>
    </div>
  );
};

export default SimpleListRow;
