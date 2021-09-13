import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const UnshippedHidden = ({ title, unshipped, orders }) => {
  const [unshippedLists, setUnshippedLists] = useState([]);
  useEffect(() => {
    setUnshippedLists(unshipped.filter(ship => ship.title === title));
  }, []);
  return (
    <>
      {unshippedLists &&
        unshippedLists.length > 0 &&
        orders &&
        unshippedLists.map(li => (
          <div className="grid grid-cols-10 py-1">
            <div className="col-span-7 pl-14">
              {
                orders.find(
                  order => order?.data?.orderNumber === li?.orderNumber
                )?.data?.customer
              }{" "}
              / {li.nickName} / {li.orderNumber}
            </div>
            <div className="text-center">{li.quan} ea</div>
            <div className="text-center col-span-2">
              {li.totalPrice?.toFixed(2)} {li.currency}
            </div>
          </div>
        ))}
    </>
  );
};

export default UnshippedHidden;
