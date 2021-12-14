import React, { useEffect, useReducer } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Spinner from "react-spinkit";
import { useAuthState } from "react-firebase-hooks/auth";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router";
import { auth, db } from "./firebase";

import { initState, dataReducer } from "./reducer/Reducer";

import B2bShop from "./components/b2bshop/b2bshop/B2bShop";
import B2bShopMobile from "./components/b2bshop/b2bshop/mobile/B2bShopMobile";

import B2bOrder from "./components/b2bshop/b2bshop/B2bOrder";
import B2bSpecialOrder from "./components/b2bshop/b2bshop/B2bSpecialOrder";
import OrderList from "./components/admin/orderlist/OrderList";
import Sidebar from "./components/sidebar/Sidebar";
import Login from "./components/login/Login";
import ListProduct from "./components/products/listproduct/ListProduct";
import AddProduct from "./components/products/addproduct/AddProduct";
import DetailProduct from "./components/products/detailproduct/DetailProduct";
import OrderDetail from "./components/admin/orderlist/OrderDetail";
import Unshiped from "./components/admin/unshipped/Unshiped";
import ShippingList from "./components/admin/shipping/ShippingList";
import UnshipedDetail from "./components/admin/unshipped/UnshippedDetail";
import MyOrderList from "./components/b2bshop/myorder/MyOrderList";
import MyOrderDetail from "./components/b2bshop/myorder/MyOrderDetail";
import MyInfo from "./components/b2bshop/myorder/MyInfo";
import OrderProductList from "./components/teamjangnim/OrderProductList";
import Dev from "./dev/Dev";
import Header from "./components/header/Header";
import PickUpList from "./components/invoice/PickUpList";
import Invoice from "./components/invoice/Invoice";
import InAdminChat from "./components/chat/InAdminChat";
import MobileHeader from "./components/header/MobileHeader";
import { MyShipping } from "./components/b2bshop/myshipping/MyShipping";
import { CustomerIndex } from "./components/admin/customer/CustomerIndex";
import { CustomerDetails } from "./components/admin/customer/details/CustomerDetails";
import { OrderLists } from "./components/orderlist/index";
import { OrderListDetail } from "./components/orderlist/orderlistdetail/index";
import { ShippingLists } from "./components/shippinglist";
import { PickUpList2 } from "./components/pickuplist2";

export const InitDataContext = React.createContext(null);
export const InitDispatchContext = React.createContext(null);

function App() {
  const [user, loading] = useAuthState(auth);
  const [state, dispatch] = useReducer(dataReducer, initState);
  const { userType, product } = state;
  // TODO: 유저타입을 -> user.userType 으로 대체가능한가?
  const history = useHistory();

  // 반응형
  const isPc = useMediaQuery({
    query: "(min-width:768px)",
  });

  const isMobile = useMediaQuery({
    query: "(max-width:767px)",
  });

  useEffect(() => {
    db.collection("accounts")
      .doc(user?.email)
      .onSnapshot(doc =>
        dispatch({ type: "USERTYPE", userType: doc?.data()?.type })
      );
  }, [user]);

  useEffect(() => {
    db.collection("accounts")
      .doc(user?.email)
      .onSnapshot(doc => dispatch({ type: "USER", user: doc?.data() }));
  }, [user]);

  // FIXME: account type -> customer 만 가져오게
  useEffect(() => {
    db.collection("accounts").onSnapshot(snapshot =>
      dispatch({
        type: "ACCOUNTS",
        account: snapshot.docs.map(doc => ({ id: doc?.id, data: doc?.data() })),
      })
    );
  }, [dispatch]);

  useEffect(() => {
    db.collection("orders")
      .doc("b2b")
      .collection("b2borders")
      .orderBy("createdAt", "desc")
      .onSnapshot(snapshot =>
        dispatch({
          type: "ORDERS",
          order: snapshot.docs.map(doc => ({
            id: doc?.id,
            data: doc?.data(),
          })),
        })
      );
  }, [dispatch]);

  useEffect(() => {
    db.collection("products").onSnapshot(snapshot =>
      dispatch({
        type: "PRODUCTS",
        product: snapshot.docs.map(doc => ({ id: doc?.id, data: doc?.data() })),
      })
    );
  }, [dispatch]);

  useEffect(() => {
    db.collection("rooms").onSnapshot(snapshot =>
      dispatch({
        type: "ROOMS",
        room: snapshot.docs.map(doc => ({ id: doc?.id, data: doc?.data() })),
      })
    );
  }, [dispatch]);

  useEffect(() => {
    db.collection("shipping")
      .orderBy("shippedDate", "desc")
      .onSnapshot(snapshot =>
        dispatch({
          type: "SHIPPINGS",
          shipping: snapshot.docs.map(doc => ({
            id: doc?.id,
            data: doc?.data(),
          })),
        })
      );
  }, [dispatch]);

  useEffect(() => {
    db.collection("notice")
      .orderBy("index", "desc")
      .onSnapshot(snapshot =>
        dispatch({
          type: "NOTICES",
          notice: snapshot.docs.map(doc => ({
            id: doc?.id,
            data: doc?.data(),
          })),
        })
      );
  }, [dispatch]);

  //
  useEffect(() => {
    db.collection("reStockRequests")
      .orderBy("title", "desc")
      .onSnapshot(snapshot =>
        dispatch({
          type: "RESTOCK_REQUEST",
          reStockRequest: snapshot.docs.map(doc => ({
            id: doc?.id,
            data: doc?.data(),
          })),
        })
      );
  }, [dispatch]);

  useEffect(() => {
    db.collection("forNumberedId")
      .doc("b2bOrder")
      .onSnapshot(snapshot =>
        dispatch({
          type: "ORDER_COUNTS",
          orderCounts: snapshot.data().counts,
        })
      );
  }, [dispatch]);

  useEffect(() => {
    db.collection("forNumberedId")
      .doc("shipping")
      .onSnapshot(snapshot =>
        dispatch({
          type: "SHIPPING_COUNTS",
          shippingCounts: snapshot.data().counts,
        })
      );
  }, [dispatch]);

  useEffect(() => {
    db.collection("shippingFee")
      .doc("dhl")
      .onSnapshot(snapshot =>
        dispatch({
          type: "DHL_SHIPPING_FEE",
          dhlShippingFee: snapshot.data(),
        })
      );
  }, [dispatch]);

  useEffect(() => {
    db.collection("exchangeRate")
      .doc("rates")
      .onSnapshot(snapshot =>
        dispatch({
          type: "EXCHANGE_RATE",
          exchangeRate: snapshot.data(),
        })
      );
  }, [dispatch]);

  if (loading || userType === "before") {
    return (
      <div className="grid place-items-center h-screen w-full">
        <div className="text-center pb-24 flex flex-col justify-center items-center">
          <Spinner name="ball-spin-fade-loader" color="gray" fadeIn="none" />
        </div>
      </div>
    );
  }
  if (user && userType === "none") {
    return (
      <div className="grid place-items-center h-screen w-full">
        <div className="flex h-auto text-lg">
          We are checking the contents of the survey.
        </div>
        <div
          onClick={async () => {
            await auth.signOut();
            await history.replace("/");
          }}
          className="font-mono font-bold text-center rounded-sm text-lg
                    text-gray-100 bg-blue-900 py-3 px-5 cursor-pointer"
        >
          Logout
        </div>
      </div>
    );
  }
  // if (user && userType === "customer") {
  //   return (
  //     <Router>
  //       <div className="flex flex-col bg-gray-50 h-auto min-h-screen w-screen">
  //         {" "}
  //         <InitDispatchContext.Provider value={dispatch}>
  //           <InitDataContext.Provider value={state}>
  //             {" "}
  //             {/* <div className="flex flex-col"> */}
  //             {isPc && (
  //               <>
  //                 <Header />
  //                 <Switch>
  //                   <Route path="/myshipping" component={MyShipping} />
  //                   <Route path="/myorderlist/:id" component={MyOrderDetail} />
  //                   <Route path="/myorderlist" component={MyOrderList} />
  //                   <Route path="/myinfo/:uid" component={MyInfo} />
  //                   <Route
  //                     path="/b2bspecialorder"
  //                     component={B2bSpecialOrder}
  //                   />
  //                   <Route path="/b2border" component={B2bOrder} />
  //                   <Route path="/" component={B2bShop} />
  //                 </Switch>{" "}
  //               </>
  //             )}
  //             {isMobile && (
  //               <>
  //                 <MobileHeader />
  //                 <Switch>
  //                   <Route path="/myorderlist/:id" component={MyOrderDetail} />
  //                   <Route path="/myorderlist" component={MyOrderList} />
  //                   <Route path="/myinfo/:uid" component={MyInfo} />
  //                   <Route
  //                     path="/b2bspecialorder"
  //                     component={B2bSpecialOrder}
  //                   />
  //                   <Route path="/b2border" component={B2bOrder} />
  //                   <Route path="/" component={B2bShopMobile} />
  //                 </Switch>
  //               </>
  //             )}
  //             {/* </div> */}
  //           </InitDataContext.Provider>{" "}
  //         </InitDispatchContext.Provider>
  //       </div>
  //     </Router>
  //   );
  // }

  if (user && userType === "admin") {
    return (
      <Router>
        <div className="flex flex-col bg-gray-50 h-auto min-h-screen w-screen">
          <InitDispatchContext.Provider value={dispatch}>
            <InitDataContext.Provider value={state}>
              <Header />
              <div className="flex flex-row h-auto min-h-screen">
                <Sidebar />
                <Switch>
                  {/* 개발 */}
                  {auth.currentUser.email === "interasiadev@gmail.com" ? (
                    <Route path="/fordev" component={Dev} />
                  ) : (
                    ""
                  )}

                  {/* New */}
                  <Route
                    path="/orderlistdetail/:id"
                    component={OrderListDetail}
                  />
                  <Route path="/orderlists" component={OrderLists} />
                  <Route path="/shippinglists" component={ShippingLists} />

                  {/* 석팀장님 */}
                  <Route
                    path="/orderproductslist"
                    component={OrderProductList}
                  />

                  {/* order */}
                  <Route path="/orderdetail/:id" component={OrderDetail} />
                  {/* <Route path="/orderlists/:id" component={OrderListDetail} />
                  <Route path="/orderlists" component={OrderLists} /> */}
                  <Route path="/orderlist" component={OrderList} />
                  {/* shipping */}
                  <Route path="/unshipped/:uid" component={UnshipedDetail} />
                  <Route path="/unshipped" component={Unshiped} />
                  <Route path="/shippinglist" component={ShippingList} />
                  {/* product */}
                  <Route
                    exact
                    path="/detailproduct/:id"
                    component={DetailProduct}
                  />
                  <Route path="/listproduct" component={ListProduct} />
                  <Route path="/addproduct" component={AddProduct} />
                  {/* customer */}
                  <Route
                    exact
                    path="/customerdetail/:uid"
                    component={CustomerDetails}
                  />
                  <Route path="/customerlist" component={CustomerIndex} />

                  {/* b2b */}
                  {/* <Route path="/myshipping" component={MyShipping} /> */}
                  {/* <Route path="/myorderlist/:id" component={MyOrderDetail} /> */}
                  {/* <Route path="/myorderlist" component={MyOrderList} /> */}
                  {/* <Route path="/myinfo/:uid" component={MyInfo} /> */}
                  {/* <Route path="/b2bspecialorder" component={B2bSpecialOrder} /> */}
                  {/* <Route path="/b2border" component={B2bOrder} /> */}
                  {/* <Route path="/b2bshop" component={B2bShop} /> */}
                  <Route path="/pickuplist2" component={PickUpList2} />
                  <Route path="/pickuplist" component={PickUpList} />
                  <Route path="/invoice" component={Invoice} />
                  <Route path="/chat" component={InAdminChat} />
                  <Route path="/" component={OrderLists} />
                </Switch>
              </div>
            </InitDataContext.Provider>
          </InitDispatchContext.Provider>
        </div>
      </Router>
    );
  }

  if (!user) {
    return (
      <InitDataContext.Provider value={state}>
        <Login />
        {/* {isPc && <Login />}
        {isMobile && <MobileLogin />} */}
      </InitDataContext.Provider>
    );
  }
  return (
    <>
      <div className="grid place-items-center h-screen w-full">
        <div className="text-center pb-24 flex flex-col justify-center items-center">
          <Spinner name="ball-spin-fade-loader" color="gray" fadeIn="none" />
        </div>
      </div>
    </>
  );
}

export default App;
