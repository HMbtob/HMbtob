import React, { useContext } from "react";
import { InitDataContext } from "../../../App";
import UnshippedRow from "./UnshippedRow";

const Unshiped = () => {
  const state = useContext(InitDataContext);
  const { accounts, orders } = state;

  return (
    <div>
      {accounts &&
        accounts.map((customer, index) => (
          <UnshippedRow key={index} customer={customer} orders={orders} />
        ))}
    </div>
  );
};

export default Unshiped;
