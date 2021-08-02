import React, { useContext, useState } from "react";
import { InitDataContext } from "../../../App";
import UnshippedDetailRow from "./UnshippedDetailRow";

const UnshippedDetail = ({ match }) => {
  const { uid } = match.params;
  const today = new Date();

  const state = useContext(InitDataContext);
  const { accounts, orders } = state;

  const [checkedInputs, setCheckedInputs] = useState([]);

  const changeHandler = (checked, id) => {
    if (checked) {
      setCheckedInputs([...checkedInputs, id]);
    } else {
      // 체크 해제
      setCheckedInputs(checkedInputs.filter(el => el !== id));
    }
  };
  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-11/12 flex-col mt-20">
        <div
          className="text-center text-xl bg-gray-800 py-1 
        rounded-sm font-bold text-gray-100 mb-5 w-full"
        >
          미발송 내용 확인
        </div>
        {/* 좌 / 우 */}
        <div className="flex flex-row justify-evenly">
          {/* 좌 */}
          <div className="flex-col mb-10 flex space-y-2">
            <div className="grid grid-cols-2">
              <div>이메일</div>
              <div>{accounts.find(acc => acc.data.uid === uid).id}</div>
            </div>
            {/* 할인율 */}
            <div className="grid grid-cols-1">
              <div className="text-center my-1 font-semibold">할인율</div>
              <div className="grid grid-cols-6 bg-gray-600 text-center text-gray-100 rounded-sm px-1">
                {Object.keys(
                  accounts.find(acc => acc.data.uid === uid)?.data.dcRates
                ).map((doc, index) => (
                  <div key={index}>{doc}</div>
                ))}
              </div>
              <div className="grid grid-cols-6 text-center border-b px-1 border-l border-r text-sm">
                {Object.values(
                  accounts.find(acc => acc.data.uid === uid)?.data.dcRates
                ).map((doc, index) => (
                  <div key={index}>{doc * 100} %</div>
                ))}
              </div>
              <div className="text-center my-1 font-semibold mt-3">
                배송요율
              </div>
              <div className="grid grid-cols-6 bg-gray-600 text-center text-gray-100 rounded-sm px-1">
                {" "}
                {Object.keys(
                  accounts.find(acc => acc.data.uid === uid)?.data.shippingRate
                ).map((doc, index) => (
                  <div key={index}>{doc}</div>
                ))}
              </div>
              <div className="grid grid-cols-6 text-center border-b px-1 border-l border-r text-sm">
                {Object.values(
                  accounts.find(acc => acc.data.uid === uid)?.data.shippingRate
                ).map((doc, index) => (
                  <div key={index}>{doc} 원</div>
                ))}
              </div>
            </div>
          </div>
          {/* 우 */}
          <div className="flex-col mb-10 flex space-y-2">
            <div className="grid grid-cols-2">기타 주문인 정보/통계</div>
            <div className="grid grid-cols-2">
              <div>전화번호</div>
              <input
              // name="recipientPhoneNumber"
              // value={recipientPhoneNumber}
              // onChange={onChange}
              />{" "}
            </div>
          </div>
        </div>
        <div className="w-full text-center">상품종류</div>
        <div
          className="grid grid-cols-28 text-center bg-gray-800 
        rounded-sm text-gray-100 text-sm py-1"
        >
          <div className="col-span-2">No.</div>
          <div className="col-span-2">주문일</div>
          <div className="col-span-2">발매일</div>
          <div className="col-span-11">앨범명</div>
          <div className="col-span-2">판매가</div>
          <div className="col-span-4">할인가</div>
          <div>무게</div>
          <div>수량</div>
          <div>총무게</div>
          <div className="col-span-2">총액</div>
        </div>
        {orders &&
          [].concat
            .apply(
              [],
              orders
                .filter(
                  arr1 =>
                    arr1.data.customer ===
                    accounts.find(acc => acc.data.uid === uid).id
                )
                .map(arr2 =>
                  arr2.data.list.filter(
                    arr3 =>
                      arr3.relDate.toDate().toLocaleDateString() >
                      today.toLocaleDateString()
                  )
                )
            )
            .map(arr4 => (
              <UnshippedDetailRow
                key={arr4.childOrderNumber}
                list={arr4}
                checkedInputs={checkedInputs}
                changeHandler={changeHandler}
              />
            ))}
      </div>
    </div>
  );
};

export default UnshippedDetail;
