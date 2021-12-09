import React from "react";
import { useHistory } from "react-router";

export function OrderListRow({ acc }) {
  const history = useHistory();
  // console.log(acc);
  return (
    <div className="grid grid-cols-8 text-center border-b border-l border-r py-1">
      <div
        onClick={() =>
          history.push({ pathname: `/orderlistdetail/${acc.id}`, state: acc })
        }
        className="cursor-pointer"
      >
        {acc.data.nickName}
      </div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
