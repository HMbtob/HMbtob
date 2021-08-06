import React from "react";
import { auth } from "../../firebase";
import { useHistory } from "react-router-dom";

const Sidebar = () => {
  const history = useHistory();

  const underMenu = [
    { 상품추가: "/addproduct" },
    { 상품목록: "/listproduct" },
    { 주문하기: "/b2bshop" },
    { 주문확인: "/orderlist" },
    { 배송관리: "/shippinglist" },
    { 미발송건: "/unshipped" },
    { 고객관리: "/customerlist" },
    { 상품판매량: "/orderproductslist" },
  ];
  return (
    //   d-1
    <div className="flex-col items-center w-auto  h-auto min-h-screen text-gray-300 bg-gray-600">
      {/* d-2 */}
      <div
        onClick={() => auth.signOut()}
        className="text-2xl font-mono font-bold text-center text-gray-200 bg-blue-900 p-6"
      >
        interasia
      </div>
      {/* d-2 */}
      <div className="py-8 text-gray-300 bg-blue-900 leading-7 p-6">
        {/* d-3 */}
        {/* <div>좌상단 메뉴</div> */}
      </div>
      {/* d-2 */}
      <div className="bg-gray-600 p-12 text-lg text-gray-300 leading-10">
        {/* d-3 */}
        {underMenu.map((menu, index) => (
          <div
            key={index}
            onClick={() => history.push(`${Object.values(menu)}`)}
            className="cursor-pointer hover:text-gray-50"
          >
            {Object.keys(menu)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
