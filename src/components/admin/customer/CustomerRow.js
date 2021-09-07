import React from "react";
import { useHistory } from "react-router";

const CustomerRow = ({ account }) => {
  const history = useHistory();
  return (
    <div
      onClick={() => history.push(`/customerdetail/${account.data.uid}`)}
      className={`grid grid-cols-7 text-center py-1 
      bg-white border cursor-pointer ${
        account.data.type === "none" || account.data.inCharge.length < 1
          ? "bg-red-100"
          : account.data.type === "admin" && account.data.nickName < 1
          ? "bg-yellow-100"
          : account.data.type === "customer" &&
            account.data.shippingRate.dhl < 1
          ? "bg-red-100"
          : ""
      }`}
    >
      <div className="col-span-2">{account.data.email}</div>
      <div>{account.data.displayName}</div>
      <div>{account.data.nickName}</div>
      <div className="text-right">
        {Number(account.data.credit?.toFixed(2))?.toLocaleString("ko-KR")}{" "}
        {account.data.currency}
      </div>
      <div>{account.data.alias}</div>
      <div>{account.data.type}</div>
    </div>
  );
};

export default CustomerRow;
