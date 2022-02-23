import React from "react";
import CreatedAt from "./CreatedAt";
import ThermalPrinter from "./ThermalPrinter";
import Excel from "./Excel";
import { NewAddress } from "./NewAddress";
import Order from "./Order";
import { OrderListToNew } from "./OrderListToNew";
import SaveProducts from "./SaveProducts";
import ShippingFee from "./ShippingFee";
import queryString from "query-string";

const Dev = () => {
  const test = () => {
    const stringified = queryString.stringify([
      {
        sku: "SKU-BLU",
        option_values: [
          {
            option_display_name: "Mug Color",
            label: "Blue",
          },
        ],
      },
      {
        sku: "SKU-GRAY",
        option_values: [
          {
            option_display_name: "Mug Color",
            label: "Gray",
          },
        ],
      },
    ]);
    console.log(stringified);
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
