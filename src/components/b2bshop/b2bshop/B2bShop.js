import React, { useContext, useState } from "react";
import { useHistory } from "react-router";

import { InitDataContext, InitDispatchContext } from "../../../App";
import { Common } from "../common/Common";
import NoticeTable from "../notice/NoticeTable";
import PreOrderTable from "../preorder/PreOrderTable";
import SimpleList from "../simplelist/SimpleList";
import useSimpleList from "../../../hooks/useSimpleList";
import DealTable from "../deal/DealTable";

const B2bShop = () => {
  const history = useHistory();
  const state = useContext(InitDataContext);
  const dispatch = useContext(InitDispatchContext);
  const { notices, products, user } = state;
  const today = new Date();

  // 세 상품이 겹치면 안됨
  // 프리오더 상품
  const preorderProducts = products
    ?.slice(0, 100)
    .filter(
      product =>
        new Date(product?.data?.preOrderDeadline?.seconds * 1000) > today
    )
    .filter(doc => doc.data.exposeToB2b === "노출");
  // 일반상품
  const commonProducts = products
    ?.slice(0, 100)
    .filter(
      product =>
        new Date(product?.data?.preOrderDeadline?.seconds * 1000) <= today
    )
    .filter(doc => doc.data.exposeToB2b === "노출");
  // 특별가 상품
  const dealProducts = products
    ?.slice(0, 100)
    .filter(
      product =>
        new Date(product?.data?.preOrderDeadline?.seconds * 1000) <= today
    )
    .filter(doc => doc.data.exposeToB2b === "DEAL");

  const truncate = (string, n) => {
    return string?.length > n ? string.substr(0, n - 1) + " . . ." : string;
  };

  // {title(id):quan} 형태로 가져오기
  const [confirmChecked, setConfirmCheck] = useState(false);
  const [form, onChange, reset] = useSimpleList({}, setConfirmCheck, products);
  // list 만들기
  let simpleList = [];

  if (form && products) {
    let i = 0;
    for (let key in form) {
      if (form[key]) {
        simpleList.push({
          orderNumber: String(state.orderCounts + 1000),
          currency: user.currency,
          productId: key,
          title: truncate(
            products.find(product => product.id === key).data.title,
            50
          ),
          quan: Number(form[key]),
          price:
            Number(
              products.find(product => product.id === key).data.price[
                user.currency
              ]
            ) || 0,
          totalPrice:
            Number(
              products.find(product => product.id === key).data.price[
                user.currency
              ]
            ) * Number(form[key]) || 0,
          weight:
            Number(products.find(product => product.id === key).data.weight) ||
            0,
          totalWeight:
            Number(products.find(product => product.id === key).data.weight) *
              Number(form[key]) || 0,
          dcRate:
            Number(
              state.user.dcRates[
                products.find(product => product.id === key).data.category
              ]
            ) || 0,
          relDate:
            products.find(product => product.id === key).data.relDate || 0,
          preOrderDeadline:
            products.find(product => product.id === key).data
              .preOrderDeadline || 0,
          childOrderNumber: `${String(state.orderCounts + 1000)}-${i + 1}`,
          moved: false,
          createdAt: new Date(),
        });
        i++;
      }
    }
  }

  const B2bMakeOrder = async () => {
    // dispatch로 심플리스트 스테이트로 업데이트하고
    await dispatch({ type: "SIMPLELIST", simpleList });
    // 주문번호생성하고
    await dispatch({
      type: "ORDER_NUMBER",
      orderNumber: state.orderCounts + 1000,
    });
    // ㅍ히스토리푸시로  라우팅
    reset();
    history.push(`/b2border`);
  };
  return (
    <div className="w-full h-auto flex ">
      {/* d2 -1 */}
      <div
        className=" w-3/5 h-auto flex flex-col 
      items-center mt-12"
      >
        {preorderProducts && (
          <>
            <div className="text-center text-sm font-bold text-gray-800">
              PRE ORDER
            </div>
            <PreOrderTable
              preorderProducts={preorderProducts}
              onChange={onChange}
              user={user}
            />
          </>
        )}

        <Common
          commonProducts={commonProducts}
          dispatch={dispatch}
          category={state.category}
          onChange={onChange}
          simpleList={simpleList}
          user={user}
        />
      </div>
      {/* d2-2 */}
      <div className=" w-2/5 flex flex-col items-center mt-12 mr-5">
        {notices && <NoticeTable notices={notices} />}
        {dealProducts && (
          <>
            <div className="text-center text-sm font-bold text-gray-800">
              HOT DEAL{" "}
            </div>
            <DealTable
              dealProducts={dealProducts}
              onChange={onChange}
              user={user}
            />
          </>
        )}
        <SimpleList
          // userData={userData}
          confirmChecked={confirmChecked}
          simpleList={simpleList && simpleList}
          dispatch={dispatch}
          B2bMakeOrder={B2bMakeOrder}
          state={state}
        />
      </div>
    </div>
  );
};

export default B2bShop;
