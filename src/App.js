import React, { useEffect, useReducer } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Spinner from "react-spinkit";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, db } from "./firebase";
import { initState, dataReducer } from "./reducer/Reducer";

import B2bShop from "./components/customer/b2bshop/B2bShop";
import Sidebar from "./components/sidebar/Sidebar";
import Home from "./components/home/Home";
import ListProduct from "./components/products/listproduct/ListProduct";
import AddProduct from "./components/products/addproduct/AddProduct";
import DetailProduct from "./components/products/detailproduct/DetailProduct";

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
    dispatch({ type: "USER", user: user });
  }, [user]);

  useEffect(() => {
    db.collection("orders")
      .doc("b2b")
      .collection("b2borders")
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
    db.collection("orders").onSnapshot(snapshot =>
      snapshot.docs.map(doc =>
        dispatch({ type: "ORDER_COUNTS", orderCounts: doc.data().counts })
      )
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
                <Route path="/b2bshop" component={B2bShop} />
                ''
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
