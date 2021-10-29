import React, { useState } from "react";
import useInputs from "../../hooks/useInput";

const InvoiceRow = ({ list, index }) => {
  const [form, onchange] = useInputs({
    quan: list.quan,
    option: "",
  });

  const { quan, option } = form;

  const [price, setPrice] = useState(
    list.currency === "KRW"
      ? Number(list.price)
          .toFixed(0)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : Number(list.price)
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );

  const handlePrice = e => {
    setPrice(
      list.currency === "KRW"
        ? Number(e.target.value.replaceAll(",", ""))
            .toFixed(0)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : Number(e.target.value.replaceAll(",", ""))
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    );
  };

  const [totalPrice, setTotalPrice] = useState(
    list.currency === "KRW"
      ? Number(list.totalPrice)
          .toFixed(0)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : Number(list.totalPrice)
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );

  const handleTotalPrice = e => {
    setTotalPrice(
      list.currency === "KRW"
        ? Number(e.target.value.replaceAll(",", ""))
            .toFixed(0)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : Number(e.target.value.replaceAll(",", ""))
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    );
  };

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
          type="number"
          onChange={onchange}
          value={quan}
          name="quan"
          className="w-full text-center  py-1 outline-none"
        />
        EA
      </div>
      <div
        className="col-span-3 text-center  border-r border-black p-1 
      flex flex-row items-center w-full "
      >
        <input
          type="text"
          onChange={handlePrice}
          value={price}
          name="price"
          className="w-full text-center py-1 outline-none"
        />{" "}
        {list.currency}
      </div>
      <div
        className="col-span-3 text-center p-1 flex 
      flex-row items-center justify-center w-full"
      >
        <input
          type="text"
          onChange={handleTotalPrice}
          value={totalPrice}
          name="totalPrice"
          className="w-full text-center py-1 outline-none"
        />{" "}
        {list.currency}
      </div>
    </div>
  );
};

export default InvoiceRow;
