import React, { useContext, useState } from "react";
import { InitDataContext, InitDispatchContext } from "../../../App";
import useInputs from "../../../hooks/useInput";
import { Common } from "../common/Common";
import NoticeTable from "../notice/NoticeTable";
import PreOrderTable from "../preorder/PreOrderTable";
import SimpleList from "../simplelist/SimpleList";
const B2bShop = () => {
  const state = useContext(InitDataContext);
  const dispatch = useContext(InitDispatchContext);
  const { notices, products } = state;
  console.log(state);
  const preorderProducts = products.filter(
    product => new Date(product.data.preOrderDeadline.toDate()) > new Date()
  );
  const commonProducts = products.filter(
    product => new Date(product.data.preOrderDeadline.toDate()) <= new Date()
  );

  // for simple list
  // 주문하기 버튼 - 주문 수량이 양수여야 활성화
  const [confirmChecked, setConfirmCheck] = useState(false);
  const [form, onChange, reset] = useInputs({});
  console.log(form);
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
        // confirmChecked={confirmChecked}
        // makeBtobOrder={makeBtobOrder}
        // userData={userData}
        // inputs={inputs}
        // product={product}
        form={form}
      />
    </div>
  );
};

export default B2bShop;
