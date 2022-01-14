import React, { useState } from "react";
import useInputs from "../../hooks/useInput";

const InvoiceRow = ({ list, index, from }) => {
  const [form, onchange] = useInputs({
    quan: from === "new" ? Number(list.data.quan) : Number(list.quan),
    option: "",
  });

  const { quan, option } = form;

  const [price, setPrice] = useState(
    from === "new"
      ? list.data.currency === "KRW"
        ? Number(list.data.price)
            .toFixed(0)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : Number(list.data.price)
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : list.currency === "KRW"
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
      from === "new"
        ? list.data.currency === "KRW"
          ? Number(e.target.value.replaceAll(",", ""))
              .toFixed(0)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : Number(e.target.value.replaceAll(",", ""))
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : list.currency === "KRW"
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
    from === "new"
      ? list.data.currency === "KRW"
        ? Number(list.data.totalPrice)
            .toFixed(0)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : Number(list.data.totalPrice)
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : list.currency === "KRW"
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
      from === "new"
        ? list.data.currency === "KRW"
          ? Number(e.target.value.replaceAll(",", ""))
              .toFixed(0)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : Number(e.target.value.replaceAll(",", ""))
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : list.currency === "KRW"
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
        {from === "new" ? list.data.title : list.title}
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
          disabled
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
          disabled
          type="text"
          onChange={e => handlePrice(e)}
          value={price}
          name="price"
          className="w-full text-center py-1 outline-none"
        />{" "}
        {from === "new" ? list.data.currency : list.currency}
      </div>
      <div
        className="col-span-3 text-center p-1 flex 
      flex-row items-center justify-center w-full"
      >
        <input
          disabled
          type="text"
          onChange={handleTotalPrice}
          value={totalPrice}
          name="totalPrice"
          className="w-full text-center py-1 outline-none"
        />{" "}
        {from === "new" ? list.data.currency : list.currency}
      </div>
    </div>
  );
};

export default InvoiceRow;
