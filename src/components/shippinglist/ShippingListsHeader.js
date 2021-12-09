import React from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export function ShippingListsHeader({ handelHiddenAll }) {
  return (
    <div
      className="grid grid-cols-12 grid-flow-col text-center 
       bg-gray-800 text-gray-100 py-1 rounded-sm text-xs items-center"
    >
      <div className="">Shipping No.</div>
      <div className="">Ship Date</div>
      <div className="">배송지</div>
      <div className="">
        Tracking No.
        <ExpandMoreIcon
          className="h-5 cursor-pointer"
          onClick={() => handelHiddenAll()}
        />
      </div>
      <div className="">Nick Name</div>
      <div className="">Type</div>

      <div className="">Country</div>

      <div className="">Sorts</div>
      <div className="">EA</div>

      <div className="">Item Price</div>

      <div className="">Shipping Fee</div>
      <div className="">Total Amount</div>
    </div>
  );
}
