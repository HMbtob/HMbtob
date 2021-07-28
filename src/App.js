import React, { useEffect, useReducer } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Spinner from "react-spinkit";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, db } from "./firebase";
import { initState, dataReducer } from "./reducer/Reducer";

import B2bShop from "./components/customer/b2bshop/B2bShop";
import B2bOrder from "./components/customer/b2bshop/B2bOrder";
import OrderList from "./components/admin/orderlist/OrderList";
import Sidebar from "./components/sidebar/Sidebar";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import ListProduct from "./components/products/listproduct/ListProduct";
import AddProduct from "./components/products/addproduct/AddProduct";
import DetailProduct from "./components/products/detailproduct/DetailProduct";
import OrderDetail from "./components/admin/orderlist/OrderDetail";

export const InitDataContext = React.createContext(null);
export const InitDispatchContext = React.createContext(null);

function App() {
  const [user, loading] = useAuthState(auth);
  const [state, dispatch] = useReducer(dataReducer, initState);
  const { userType } = state;

  useEffect(() => {
    db.collection("accounts")
      .doc(user?.email)
      .get()
      .then(doc => dispatch({ type: "USERTYPE", userType: doc?.data()?.type }));
  }, [user]);

  useEffect(() => {
    db.collection("accounts")
      .doc(user?.email)
      .get()
      .then(doc => dispatch({ type: "USER", user: doc?.data() }));
  }, [user]);

  useEffect(() => {
    db.collection("orders")
      .doc("b2b")
      .collection("b2borders")
      .orderBy("createdAt", "desc")
      .onSnapshot(snapshot =>
        snapshot.docs.map(doc =>
          dispatch({
            type: "ORDERS",
            order: { id: doc?.id, data: doc?.data() },
          })
        )
      );
  }, [dispatch]);

  useEffect(() => {
    db.collection("products").onSnapshot(snapshot =>
      snapshot.docs.map(doc =>
        dispatch({
          type: "PRODUCTS",
          product: { id: doc?.id, data: doc?.data() },
        })
      )
    );
  }, [dispatch]);

  useEffect(() => {
    db.collection("notice")
      .orderBy("index", "desc")
      .onSnapshot(snapshot =>
        snapshot.docs.map(doc =>
          dispatch({
            type: "NOTICES",
            notice: { id: doc?.id, data: doc?.data() },
          })
        )
      );
  }, [dispatch]);

  useEffect(() => {
    db.collection("forNumberedId")
      .doc("b2bOrder")
      .get()
      .then(doc =>
        dispatch({ type: "ORDER_COUNTS", orderCounts: doc?.data().counts })
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

  if (user && userType === "admin") {
    return (
      <Router>
        <div className="flex bg-gray-50 h-auto">
          <InitDispatchContext.Provider value={dispatch}>
            <InitDataContext.Provider value={state}>
              <Sidebar />
              <Switch>
                <Route path="/orderdetail/:id" component={OrderDetail} />
                <Route path="/orderlist" component={OrderList} />
                <Route path="/b2border" component={B2bOrder} />
                <Route path="/b2bshop" component={B2bShop} />
                <Route
                  exact
                  path="/detailproduct/:id"
                  component={DetailProduct}
                />
                <Route path="/listproduct" component={ListProduct} />
                <Route path="/addproduct" component={AddProduct} />
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
