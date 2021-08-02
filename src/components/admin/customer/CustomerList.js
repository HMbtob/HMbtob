import React, { useContext } from "react";
import { InitDataContext } from "../../../App";
import CustomerRow from "./CustomerRow";

const CustomerList = () => {
  const state = useContext(InitDataContext);
  const { accounts } = state;
  return (
    <div className="w-full flex justify-center mb-20">
      <div className=" w-11/12 flex-col mt-20">
        <div className="w-full text-center my-4 text-gray-800 text-lg">
          CUSTOMER LIST
        </div>
        <div
          className="grid grid-cols-4  grid-flow-col text-center 
       bg-gray-800 text-gray-100 py-1 rounded-sm text-xs"
        >
          <div className="col-span-2">E-mail</div>
          <div className="col-span-1">Name</div>
          <div className="col-span-1">Type</div>
        </div>

        {accounts &&
          accounts.map(account => (
            <CustomerRow key={account.id} account={account} />
          ))}
      </div>
      {/* 디테일 페이지 만들어서 인보이스 발행기능, 수량 수정가능하게, 목록 삭제도 가능하게 삭제나 수정했을때 기존인보이스에 취소선? 주문에 list를 orderlist 랑 confirmlist 로 분화? */}
    </div>
  );
};
export default CustomerList;
