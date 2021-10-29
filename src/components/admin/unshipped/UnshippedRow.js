import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router";

const UnshippedRow = ({ customer, orders }) => {
  const history = useHistory();
  const today = new Date();
  const [unshipped, setUnshipped] = useState([]);
  const [included, setIncluded] = useState(false);

  useEffect(() => {
    setUnshipped(
      [].concat
        .apply(
          [],
          orders
            .filter(
              arr1 =>
                arr1.data.customer === customer.id &&
                arr1.data.orderState !== "Shipped"
            )
            .map(arr2 => arr2.data.list)
        )
        .filter(
          arr3 =>
            arr3.shipped === false &&
            arr3.moved === false &&
            arr3.canceled === false
        )
    );
  }, [orders]);

  useEffect(() => {
    setIncluded(
      unshipped.reduce((i, c) => {
        if (c.moved === false && c.canceled === false && c.shipped === false) {
          return i || c.relDate.toDate() > today;
        }
        return i || false;
      }, false)
    );
  }, [unshipped]);
  return (
    <div
      onClick={() => history.push(`/Unshipped/${customer.data.uid}`)}
      className={`grid grid-cols-8 text-center cursor-pointer ${
        included ? "bg-red-100" : "bg-white"
      }  border py-1 text-sm ${unshipped && unshipped.length < 1 && "hidden"}`}
    >
      {" "}
      <div className="col-span-2">{customer && customer.data.email}</div>
      <div>{customer && customer.data.displayName}</div>
      <div>{customer && customer.data.nickName}</div>
      <div>{unshipped && unshipped.length} 종</div>
      <div>
        {unshipped &&
          unshipped
            .reduce((i, c) => {
              return i + c.quan;
            }, 0)
            .toLocaleString("ko-KR")}{" "}
        개
      </div>
      <div>
        {unshipped &&
          (
            unshipped.reduce((i, c) => {
              return i + c.totalWeight;
            }, 0) / 1000
          ).toLocaleString("ko-KR")}{" "}
        KG
      </div>
      <div>
        {unshipped &&
          unshipped
            .reduce((i, c) => {
              return i + c.totalPrice;
            }, 0)
            .toLocaleString("ko-KR")}{" "}
        {unshipped && unshipped.length > 0 && unshipped[0].currency}
      </div>
    </div>
  );
};

export default UnshippedRow;
