import React, { useContext } from "react";
import { InitDataContext } from "../../../App";
import ShippingListRow from "./ShippingListRow";

const ShippingList = ({ shipping, from }) => {
  const state = useContext(InitDataContext);
  const { shippings } = state;
  return (
    <div className="w-full flex justify-center mb-20">
      <div className=" w-11/12 flex-col mt-20">
        <div className="w-full text-center my-4 text-gray-800 text-lg">
          SHIPPING LIST
        </div>
        <div
          className="grid grid-cols-20  grid-flow-col text-center 
           bg-gray-800 text-gray-100 py-1 rounded-sm text-xs"
        >
          <div className="col-span-1">.No</div>
          <div className="col-span-3">배송시간</div>
          <div className="col-span-1">주문번호</div>
          <div className="col-span-3">주문시간</div>
          <div className="col-span-3">주문자</div>
          <div>배송사</div>
          <div>국가</div>
          <div className="col-span-1">종류</div>
          <div className="col-span-1">총수량</div>
          <div className="col-span-1">총무게</div>
          <div className="col-span-2">예상운송비</div>
          <div className="col-span-2">총가격</div>
        </div>
        <div>
          {from === "detail" && shipping
            ? shipping.map(ship => (
                <ShippingListRow
                  key={ship.id}
                  id={shipping.id}
                  shipping={ship}
                />
              ))
            : !from && shippings
            ? shippings.map(shipping => (
                <ShippingListRow
                  key={shipping.id}
                  id={shipping.id}
                  shipping={shipping}
                />
              ))
            : ""}
        </div>
      </div>
      {/* 디테일 페이지 만들어서 인보이스 발행기능, 수량 수정가능하게, 목록 삭제도 가능하게 삭제나 수정했을때 기존인보이스에 취소선? 주문에 list를 orderlist 랑 confirmlist 로 분화? */}
    </div>
  );
};

export default ShippingList;
