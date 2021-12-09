import React, { useContext, useEffect } from "react";
import { OrderListHeader } from "./OrderListHeader";
import { InitDataContext } from "../../App";
import { useState } from "react";

export function OrderLists() {
  const state = useContext(InitDataContext);
  const { accounts, user } = state;
  const [chargeAcc, setChargeAcc] = useState([]);

  const OrderListRow = React.lazy(() =>
    import("./OrderListRow").then(module => ({
      default: module.OrderListRow,
    }))
  );

  useEffect(() => {
    setChargeAcc(accounts.filter(acc => acc.data.inCharge === user?.email));
  }, [accounts, user]);
  return (
    <div className="w-full h-full flex justify-center">
      <div className=" w-11/12 flex-col mt-20">
        <OrderListHeader />
        {accounts.map((acc, i) => (
          <React.Suspense key={i} fallback={<div>Loading...</div>}>
            <OrderListRow acc={acc} />
          </React.Suspense>
        ))}
      </div>
    </div>
  );
}
