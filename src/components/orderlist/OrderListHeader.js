import React from "react";

export function OrderListHeader({
  admins,
  handleChargeAcc,
  selected,
  setSelected,
}) {
  return (
    <div
      className="grid grid-cols-9  grid-flow-col text-center bg-gray-800
         text-gray-100 py-1 rounded-sm text-sm items-center"
    >
      <div>Nick Name</div>
      <div className="col-span-2">E-mail</div>
      <div></div>
      <div>신규 주문(최근 2일)</div>
      <div>미확인주문</div>
      <div>확인된주문</div>
      <div>취소된주문</div>
      <div>
        <select
          value={selected}
          onChange={e => {
            handleChargeAcc(e);
            setSelected(e.target.value);
          }}
          className=" outline-none bg-gray-800 w-full text-center"
        >
          {admins.map((admin, i) => (
            <option key={i} value={admin.id}>
              {admin.data.nickName || admin.id}
            </option>
          ))}
        </select>{" "}
      </div>
    </div>
  );
}
