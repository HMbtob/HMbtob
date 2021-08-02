import React from "react";
import { useHistory } from "react-router";

const UnshippedRow = ({ customer, orders }) => {
  const history = useHistory();
  const today = new Date();

  return (
    <div
      onClick={() => history.push(`/Unshipped/${customer.data.uid}`)}
      className="grid grid-cols-7 text-center cursor-pointer bg-white border py-1 text-sm"
    >
      {" "}
      <div className="col-span-2">{customer && customer.data.email}</div>
      <div>{customer && customer.data.displayName}</div>
      <div>
        {orders &&
          [].concat
            .apply(
              [],

              orders
                .filter(arr1 => arr1.data.customer === customer.id)
                .map(arr2 => arr2.data.list)
            )
            .filter(
              arr3 =>
                arr3.relDate.toDate().toLocaleDateString() >
                today.toLocaleDateString()
            ).length}{" "}
        종
      </div>
      <div>
        {[].concat
          .apply(
            [],

            orders
              .filter(arr1 => arr1.data.customer === customer.id)
              .map(arr2 => arr2.data.list)
          )
          .filter(
            arr3 =>
              arr3.relDate.toDate().toLocaleDateString() >
              today.toLocaleDateString()
          )
          .reduce((i, c) => {
            return i + c.quan;
          }, 0)}{" "}
        개
      </div>
      <div>
        {[].concat
          .apply(
            [],

            orders
              .filter(arr1 => arr1.data.customer === customer.id)
              .map(arr2 => arr2.data.list)
          )
          .filter(
            arr3 =>
              arr3.relDate.toDate().toLocaleDateString() >
              today.toLocaleDateString()
          )
          .reduce((i, c) => {
            return i + c.totalWeight;
          }, 0) / 1000}{" "}
        KG
      </div>
      <div>
        {[].concat
          .apply(
            [],

            orders
              .filter(arr1 => arr1.data.customer === customer.id)
              .map(arr2 => arr2.data.list)
          )
          .filter(
            arr3 =>
              arr3.relDate.toDate().toLocaleDateString() >
              today.toLocaleDateString()
          )
          .reduce((i, c) => {
            return i + c.totalPrice;
          }, 0)}{" "}
        원
      </div>
    </div>
  );
};

export default UnshippedRow;
