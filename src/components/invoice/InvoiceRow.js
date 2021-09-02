import React from "react";
import useInputs from "../../hooks/useInput";

const InvoiceRow = ({ list, index }) => {
  const [form, onchange] = useInputs({
    quan: list.quan,
    price: list.price,
    totalPrice: list.totalPrice,
    option: "",
  });

  const { quan, price, totalPrice, option } = form;
  return (
    <div
      className="grid grid-cols-28 border-b border-black
               border-r border-l text-xs items-center"
    >
      <div className="col-span-1 text-center border-r border-black p-2">
        {index + 1}
      </div>
      <div className="col-span-16 text-left  border-r border-black p-2">
        {list.title}
      </div>
      <div className="col-span-3 text-center  border-r border-black p-1 w-auto">
        <input
          type="text"
          onChange={onchange}
          value={option}
          name="option"
          className="text-center py-1 outline-none w-full"
        />
      </div>
      <div
        className="col-span-2 text-center  border-r 
      border-black p-1 flex flex-row items-center w-full"
      >
        <input
          type="text"
          onChange={onchange}
          value={quan}
          name="quan"
          className="w-full text-center  py-1 outline-none"
        />
        EA
      </div>
      <div
        className="col-span-3 text-center  border-r border-black p-1 
      flex flex-row items-center w-full"
      >
        <input
          type="text"
          onChange={onchange}
          value={price.toFixed(2)}
          name="price"
          className="w-full text-center py-1 outline-none"
        />{" "}
        {list.currency}
      </div>
      <div
        className="col-span-3 text-center p-1 flex 
      flex-row items-center justify-center"
      >
        <input
          type="text"
          onChange={onchange}
          value={totalPrice.toFixed(2)}
          name="totalPrice"
          className="w-12 text-center py-1 outline-none"
        />{" "}
        {list.currency}
      </div>
    </div>
  );
};

export default InvoiceRow;
