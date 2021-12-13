import React from "react";
import CreatedAt from "./CreatedAt";
import Excel from "./Excel";
import { NewAddress } from "./NewAddress";
import Order from "./Order";
import { OrderListToNew } from "./OrderListToNew";
import SaveProducts from "./SaveProducts";
import ShippingFee from "./ShippingFee";
const Dev = () => {
  return (
    <div className="mt-20">
      <Order />
      <Excel />
      <ShippingFee />
      <SaveProducts />
      <CreatedAt />
      <NewAddress />
      <OrderListToNew />
    </div>
  );
};

export default Dev;
