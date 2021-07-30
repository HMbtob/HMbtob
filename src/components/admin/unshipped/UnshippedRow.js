import React from "react";
import { useHistory } from "react-router";

const UnshippedRow = ({ customer, orders }) => {
  const history = useHistory();
  const today = new Date();
  return (
    <div onClick={() => history.push(`/Unshipped/${customer.data.uid}`)}>
      {customer && customer.data.email}
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
          ).length}
    </div>
  );
};

export default UnshippedRow;
