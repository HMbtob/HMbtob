import React, { useEffect, useReducer } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Spinner from "react-spinkit";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, db } from "./firebase";
import { initState, dataReducer } from "./reducer/Reducer";

import B2bShop from "./components/b2bshop/b2bshop/B2bShop";
import B2bOrder from "./components/b2bshop/b2bshop/B2bOrder";
import OrderList from "./components/admin/orderlist/OrderList";
import Sidebar from "./components/sidebar/Sidebar";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import ListProduct from "./components/products/listproduct/ListProduct";
import AddProduct from "./components/products/addproduct/AddProduct";
import DetailProduct from "./components/products/detailproduct/DetailProduct";
import OrderDetail from "./components/admin/orderlist/OrderDetail";
import Unshiped from "./components/admin/unshipped/Unshiped";
import ShippingList from "./components/admin/shipping/ShippingList";
import UnshipedDetail from "./components/admin/unshipped/UnshippedDetail";
import CustomerList from "./components/admin/customer/CustomerList";
import CustomerDetail from "./components/admin/customer/CustomerDetail";
import MyOrderList from "./components/b2bshop/myorder/MyOrderList";
import MyOrderDetail from "./components/b2bshop/myorder/MyOrderDetail";

export const InitDataContext = React.createContext(null);
export const InitDispatchContext = React.createContext(null);

function App() {
  const [user, loading] = useAuthState(auth);
  const [state, dispatch] = useReducer(dataReducer, initState);
  const { userType } = state;

  // TODO: 유저타입을 -> user.userType 으로 대체가능한가?
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
      <div className="flex bg-gray-50 h-auto">관리자에게 문의해주세요</div>
    );
  }
  if (user && userType === "customer") {
    return (
      <div className="flex bg-gray-50 h-auto">
        {" "}
        <InitDispatchContext.Provider value={dispatch}>
          <InitDataContext.Provider value={state}>
            <Route path="/b2bshop" component={B2bShop} />
            <Route path="/b2border" component={B2bOrder} />
          </InitDataContext.Provider>{" "}
        </InitDispatchContext.Provider>
      </div>
    );
  }

  if (user && userType === "admin") {
    return (
      <Router>
        <div className="flex bg-gray-50 h-auto">
          <InitDispatchContext.Provider value={dispatch}>
            <InitDataContext.Provider value={state}>
              <Sidebar />
              <Switch>
                {/* order */}
                <Route path="/orderdetail/:id" component={OrderDetail} />
                <Route path="/orderlist" component={OrderList} />
                <Route path="/b2border" component={B2bOrder} />
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
                  component={CustomerDetail}
                />
                <Route path="/customerlist" component={CustomerList} />

                {/* b2b */}
                <Route path="/myorderlist/:id" component={MyOrderDetail} />
                <Route path="/myorderlist" component={MyOrderList} />
                <Route path="/b2bshop" component={B2bShop} />
                <Route path="/" component={Home} />
              </Switch>
            </InitDataContext.Provider>
          </InitDispatchContext.Provider>
        </div>
      </Router>
    );
  }

  if (!user) {
    return <Login />;
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
