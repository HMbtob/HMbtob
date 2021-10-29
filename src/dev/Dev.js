import React from "react";
import CreatedAt from "./CreatedAt";
import Excel from "./Excel";
import SaveProducts from "./SaveProducts";
import ShippingFee from "./ShippingFee";
const Dev = () => {
  return (
    <div className="mt-20">
      <Excel />
      <ShippingFee />
      <SaveProducts />
      <CreatedAt />
    </div>
  );
};

export default Dev;
