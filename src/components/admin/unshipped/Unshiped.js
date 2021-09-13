import React, { useContext, useEffect, useState } from "react";
import { InitDataContext } from "../../../App";
import UnshippedByProductRow from "./UnshippedByProductRow";
import UnshippedRow from "./UnshippedRow";

const Unshiped = () => {
  const state = useContext(InitDataContext);
  const { accounts, orders } = state;

  const [unshipped, setUnshipped] = useState([]);
  const [settedLists, setSettedLists] = useState([]);
  const [calLists, setCalLists] = useState([]);

  useEffect(() => {
    setUnshipped(
      [].concat.apply(
        [],
        orders.map(order =>
          order.data.list.filter(list => list.shipped === false)
        )
      )
    );
  }, [orders]);

  useEffect(() => {
    setSettedLists([...new Set(unshipped.map(ship => ship.title))]);
  }, [unshipped]);

  useEffect(() => {
    setCalLists(
      settedLists.map(list =>
        unshipped.reduce((i, c) => {
          if (list === c.title) {
            return i + c.quan;
          }
          return i;
        }, 0)
      )
    );
  }, [settedLists]);

  return (
    <div className="w-full flex flex-col  items-center mb-20">
      <div className=" w-11/12 flex-col mt-20">
        <div className="w-full text-center my-4 text-gray-800 text-lg">
          유저별 미발송
        </div>
        <div
          className="grid grid-cols-8  grid-flow-col text-center 
       bg-gray-800 text-gray-100 py-1 rounded-sm text-xs"
        >
          <div className="col-span-2">E-mail</div>
          <div className="col-span-1">Name</div>
          <div className="col-span-1">Nick</div>
          <div className="col-span-1">종류</div>
          <div className="col-span-1">갯수</div>
          <div className="col-span-1">무게</div>
          <div className="col-span-1">총액</div>
        </div>

        {accounts &&
          accounts.map((customer, index) => (
            <UnshippedRow key={index} customer={customer} orders={orders} />
          ))}
      </div>
      <div className=" w-11/12 flex-col mt-20">
        <div className="w-full text-center my-4 text-gray-800 text-lg">
          상품별 미발송
        </div>
        <div
          className="grid grid-cols-10  grid-flow-col text-center 
       bg-gray-800 text-gray-100 py-1 rounded-sm text-sm"
        >
          <div className="col-span-7">Title</div>
          <div className="col-span-1">EA</div>
          <div className="col-span-2">Release</div>
        </div>
        {settedLists &&
          settedLists.map((row, i) => (
            <UnshippedByProductRow
              key={i}
              title={row}
              quan={calLists[i]}
              relDate={unshipped.find(order => order.title === row).relDate}
              unshipped={unshipped}
              orders={orders}
            />
          ))}
      </div>
      {/* 디테일 페이지 만들어서 인보이스 발행기능, 수량 수정가능하게, 목록 삭제도 가능하게 삭제나 수정했을때 기존인보이스에 취소선? 주문에 list를 orderlist 랑 confirmlist 로 분화? */}
    </div>
  );
};

export default Unshiped;
