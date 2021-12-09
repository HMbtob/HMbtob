import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { InitDataContext } from "../../App";
import { db } from "../../firebase";

const Sidebar = () => {
  const state = useContext(InitDataContext);
  const { user } = state;
  const history = useHistory();

  // 확인 안한 메시지
  const [unReaded, setUnReaded] = useState([]);
  const [unReadedQ, setUnReadedQ] = useState([]);
  useEffect(() => {
    db.collectionGroup("messages")
      .where(`to`, "==", `${user?.email}`)
      .onSnapshot(snapshot =>
        setUnReaded({
          messages: snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
          })),
        })
      );
  }, [user?.email]);

  useEffect(() => {
    setUnReadedQ(
      unReaded?.messages?.filter(
        mes => mes.data.to === user.email && mes.data.readed === false
      )
    );
  }, [unReaded, user?.email]);

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
            className="cursor-pointer hover:text-gray-50"
          >
            {Object.keys(menu)}
          </div>
        ))}
        <div
          onClick={() => history.push(`/chat`)}
          className="cursor-pointer hover:text-gray-50 
          flex flex-row justify-center items-center"
        >
          <div>{"고객문의"}</div>
          {unReadedQ && unReadedQ.length > 0 && (
            <div className="bg-gray-100 text-gray-600 p-1 rounded-2xl text-xs ml-2 font-semibold">
              {unReadedQ.length}
            </div>
          )}
        </div>
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
          onClick={() => history.push(`/`)}
          className="cursor-pointer hover:text-gray-50 
          flex flex-row justify-center items-center"
        >
          STORE
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
