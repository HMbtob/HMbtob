import React from "react";
import CreatedAt from "./CreatedAt";
import ThermalPrinter from "./ThermalPrinter";
import Excel from "./Excel";
import { NewAddress } from "./NewAddress";
import Order from "./Order";
import { OrderListToNew } from "./OrderListToNew";
import SaveProducts from "./SaveProducts";
import ShippingFee from "./ShippingFee";
import { db } from "../firebase";

const Dev = () => {
  const test = async () => {
    const order = await db.collectionGroup("order").get();
    const orders = order.docs.map((doc) => ({ id: doc.id, data: doc.data() }));

    orders.map(async (order, i) => {
      try {
        setTimeout(async () => {
          const product = await db
            .collection("products")
            .doc(order.data.productId)
            .get();
          const thumbNailUrl = (await product?.data()?.thumbNail) || "";
          await db
            .collection("accounts")
            .doc(order.data.userId)
            .collection("order")
            .doc(order.id)
            .update({ thumbNail: thumbNailUrl });
        }, 700);
        console.log(i, "번째 성공");
        console.log(order.id, "id");
        console.log(order.data, "data");
      } catch (e) {
        console.log(e);
      }
    });
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
