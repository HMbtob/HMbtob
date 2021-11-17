import React, { useEffect, useState } from "react";
import { AccountsData } from "../../../utils/DataFetch";
import { CustomerHeader } from "./header/CustomerHeader";
import CustomerRow from "./row/CustomerRow";

export function CustomerIndex() {
  const [accounts, setAccountss] = useState([]);
  useEffect(() => {
    AccountsData(setAccountss);
  }, []);
  return (
    <div className="w-full flex justify-center mb-20">
      <div className=" w-11/12 flex-col mt-20">
        <CustomerHeader />
        {accounts.map(account => (
          <CustomerRow key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
}
