import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { InitDataContext } from "../../App";

const Sidebar = () => {
  const state = useContext(InitDataContext);
  const { user } = state;
  const history = useHistory();

  const underMenu = [
    { 상품추가: "/addproduct" },
    { 상품목록: "/listproduct" },
    { 주문하기: "/b2bshop" },
    { 주문확인: "/orderlist" },
    { 배송관리: "/shippinglist" },
    { 미발송건: "/unshipped" },
    { 고객관리: "/customerlist" },
    // { 고객문의: "/chat" },
    { 상품판매량: "/orderproductslist" },
  ];
  return (
    //   d-1
    <div className="flex-col items-center w-auto text-gray-300 bg-gray-600">
      {/* d-2 */}
      <div className="bg-gray-600 p-8 text-lg text-gray-300 leading-10 text-center">
        {user?.email === "interasiadev@gmail.com" && (
          <div
            onClick={() => history.push(`/fordev`)}
            className="cursor-pointer hover:text-gray-50"
          >
            {"개발"}
          </div>
        )}

        {/* d-3 */}
        {underMenu.map((menu, index) => (
          <div
            key={index}
            onClick={() => history.push(`${Object.values(menu)}`)}
            className="cursor-pointer hover:text-gray-50 w-24"
          >
            {Object.keys(menu)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
