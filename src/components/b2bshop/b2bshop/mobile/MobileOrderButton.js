import React from "react";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
const MobileOrderButton = () => {
  return (
    <button
      className="bottom-1 fixed p-2 px-5 bg-blue-900 
      text-white rounded-full font-semibold flex flex-row
      items-center"
    >
      <div className="text-lg">ORDER</div>
      <div className="flex flex-row items-end">
        <ShoppingCartIcon />
        <div
          className="bg-red-600 text-xs
           rounded-full text-center px-1 -ml-2"
        >
          1
        </div>
      </div>
    </button>
  );
};

export default MobileOrderButton;
