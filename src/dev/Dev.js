import React, { useState } from "react";
import CreatedAt from "./CreatedAt";
import ThermalPrinter from "./ThermalPrinter";
import Excel from "./Excel";
import { NewAddress } from "./NewAddress";
import Order from "./Order";
import { OrderListToNew } from "./OrderListToNew";
import SaveProducts from "./SaveProducts";
import ShippingFee from "./ShippingFee";
import queryString from "query-string";
import { db } from "../firebase";

const Dev = () => {
  const test = async () => {
    const cart = await db
      .collection("accounts")
      .doc("pandlaustin2022@gmail.com")
      .collection("cart")
      .get();

    await db
      .collection("accounts")
      .doc("pandlaustin2022@gmail.com")
      .collection("order")
      .doc()
      .set(cart.docs.map((doc) => ({ id: doc.id, data: doc.data() }))[0]);

    await db
      .collection("accounts")
      .doc("pandlaustin2022@gmail.com")
      .collection("cart")
      .doc(cart.docs.map((doc) => ({ id: doc.id, data: doc.data() }))[0].id);

    console.log(cart.docs.map((doc) => ({ id: doc.id, data: doc.data() }))[0]);
  };
  return (
    <div className="mt-20">
      {/* <Epson /> */}
      <ThermalPrinter />
      <Order />
      <Excel />
      <ShippingFee />
      <SaveProducts />
      <CreatedAt />
      <NewAddress />
      <OrderListToNew />
      <button onClick={() => test()}> qs</button>
    </div>
  );
};

export default Dev;
