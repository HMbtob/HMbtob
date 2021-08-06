import React, { useState } from "react";
import axios from "axios";
const Rows = ({ title, total_sold, upc, sku, price, inventory_level, id }) => {
  const [qty, setQty] = useState(inventory_level);
  const onChange = e => {
    setQty(e.target.value);
  };

  const fixfix = async (id, qty) => {
    await axios
      .get(
        `https://us-central1-interasiastock.cloudfunctions.net/app/big/fixproductinventory/${id}/${qty}`
      )
      .then(() => alert("수정되었습니다."))
      .catch(e => console.log(e));
  };
  const truncate = (string, n) => {
    return string?.length > n ? string.substr(0, n - 1) + " . . ." : string;
  };
  return (
    <div className="grid grid-cols-11 border py-1 text-sm">
      <div className="col-span-4 pl-5">{truncate(title, 70)}</div>
      <div className="text-center">{upc}</div>
      <div className="text-center col-span-2">{sku}</div>
      <div className="text-center">{price}</div>
      <div className="flex flex-row justify-evenly col-span-2">
        <input
          type="number"
          value={qty}
          onChange={onChange}
          className="w-1/3 text-center border"
        />
        <button
          onClick={() => fixfix(id, qty)}
          className="text-center bg-gray-800 text-gray-200 px-2 rounded"
        >
          수정
        </button>
      </div>
      <div className="text-center font-bold">{total_sold}</div>
    </div>
  );
};

export default Rows;
