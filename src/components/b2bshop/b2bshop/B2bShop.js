import React, { useContext, useState } from "react";
import { useHistory } from "react-router";

import { InitDataContext, InitDispatchContext } from "../../../App";
import { Common } from "../common/Common";
import NoticeTable from "../notice/NoticeTable";
import PreOrderTable from "../preorder/PreOrderTable";
import SimpleList from "../simplelist/SimpleList";
import useSimpleList from "../../../hooks/useSimpleList";

const B2bShop = () => {
  const history = useHistory();
  const state = useContext(InitDataContext);
  const dispatch = useContext(InitDispatchContext);
  const { notices, products } = state;
  // FIXME: 전체 상품이 아니라 b2bshop 에있는 상품 가져오기, 리듀서도 다시
  const preorderProducts = products.filter(
    product => new Date(product.data.preOrderDeadline.toDate()) > new Date()
  );
  const commonProducts = products.filter(
    product => new Date(product.data.preOrderDeadline.toDate()) <= new Date()
  );
  const truncate = (string, n) => {
    return string?.length > n ? string.substr(0, n - 1) + " . . ." : string;
  };

  // {title:quan} 형태로 가져오기
  const [confirmChecked, setConfirmCheck] = useState(false);
  const [form, onChange, reset] = useSimpleList({}, setConfirmCheck);

  // list 만들기
  let simpleList = [];

  if (form && products) {
    let i = 0;
    for (let key in form) {
      if (form[key]) {
        simpleList.push({
          orderNumber: String(state.orderCounts + 1000),
          productId: key,
          title: truncate(
            products.find(product => product.id === key).data.title,
            50
          ),
          quan: Number(form[key]),
          price:
            Number(products.find(product => product.id === key).data.price) ||
            0,
          totalPrice:
            Number(products.find(product => product.id === key).data.price) *
              Number(form[key]) || 0,
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
    <div className="w-full h-screen flex ">
      {/* d2 -1 */}
      <div className=" w-3/4 flex flex-col items-center mt-12">
        {/* d3-1 */}
        <div className="flex flex-row w-5/6 h-1/4 justify-evenly">
          {/* d4 */}
          {preorderProducts && (
            <PreOrderTable
              preorderProducts={preorderProducts}
              onChange={onChange}
            />
          )}
          {notices && <NoticeTable notices={notices} />}
        </div>
        {/* d3-2 */}
        <Common
          commonProducts={commonProducts}
          dispatch={dispatch}
          category={state.category}
          onChange={onChange}
        />
      </div>
      {/* d2-2 */}
      <SimpleList
        // userData={userData}
        confirmChecked={confirmChecked}
        simpleList={simpleList && simpleList}
        dispatch={dispatch}
        B2bMakeOrder={B2bMakeOrder}
      />
    </div>
  );
};

export default B2bShop;
