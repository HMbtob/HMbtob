import React from "react";
import { useHistory } from "react-router";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { db } from "../../../firebase";

const CustomerRow = ({ account }) => {
  const history = useHistory();
  // 유저삭제
  const handleDelete = () => {
    let con = window.confirm("정말로 삭제하시겠습니까?");
    if (con === true) {
      db.collection("accounts").doc(account.id).delete();
      // window.location.replace("/customerlist");
    } else if (con === false) {
      return;
    }
  };
  return (
    <div
      className={`grid grid-cols-7 text-center py-1 
      bg-white border ${
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
      <div className="col-span-2">
        {account.data.email}
        <DeleteOutlineIcon
          className="cursor-pointer"
          fontSize="small"
          style={{ color: "gray" }}
          onClick={handleDelete}
        />
      </div>
      <div
        className="cursor-pointer"
        onClick={() => history.push(`/customerdetail/${account.data.uid}`)}
      >
        {account.data.displayName}
      </div>
      <div
        className="cursor-pointer"
        onClick={() => history.push(`/customerdetail/${account.data.uid}`)}
      >
        {account.data.nickName}
      </div>
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
