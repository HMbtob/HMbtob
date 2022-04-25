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
    { 고객관리: "/customerlist" },
  ];

  return (
    //   d-1
    <div className="flex-col items-center w-auto text-gray-300 bg-gray-600">
      {/* d-2 */}
      <div className="bg-gray-600 pt-16 w-40 p-8 text-lg text-gray-300 leading-10 text-center">
        {user?.email === "interasiadev@gmail.com" && (
          <>
            <div
              onClick={() => history.push(`/fordev`)}
              className="cursor-pointer hover:text-gray-50"
            >
              {"개발"}
            </div>
          </>
        )}

        {/* d-3 */}
        {underMenu.map((menu, index) => (
          <div
            key={index}
            onClick={() => history.push(`${Object.values(menu)}`)}
            className={`${
              Object.keys(menu)[0] === "주문확인" ||
              Object.keys(menu)[0] === "배송관리" ||
              Object.keys(menu)[0] === "미발송건"
                ? "line-through"
                : ""
            } cursor-pointer hover:text-gray-50`}
          >
            {Object.keys(menu)}
          </div>
        ))}

        <div
          onClick={() => history.push(`/orderlists`)}
          className="cursor-pointer hover:text-gray-50 
          flex flex-row justify-center items-center"
        >
          NEW 주문
        </div>
        <div
          onClick={() => history.push(`/shippinglists`)}
          className="cursor-pointer hover:text-gray-50 
          flex flex-row justify-center items-center"
        >
          NEW 배송
        </div>
        <div
          onClick={() => window.open("https://interasia.biz", "blank")}
          className="cursor-pointer hover:text-gray-50 
          flex flex-row justify-center items-center"
        >
          STORE
        </div>
        <div
          onClick={() => history.push(`/receiptprint`)}
          className="cursor-pointer hover:text-gray-50 
          flex flex-row justify-center items-center mt-36"
        >
          영수증인쇄
        </div>
        <div
          onClick={() => history.push(`/orderproductslist`)}
          className="cursor-pointer hover:text-gray-50 
          flex flex-row justify-center items-center mt-"
        >
          상품판매량
        </div>
        <div
          onClick={() => history.push(`/exchangerates`)}
          className="cursor-pointer hover:text-gray-50 
          flex flex-row justify-center items-center mt-"
        >
          환율 조절
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
