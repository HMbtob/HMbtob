import React, { useContext } from "react";
import B2bPart from "./B2bPart";
import CommonPart from "./CommonPart";
import { InitDataContext } from "../../../App";

const DetailProduct = ({ match }) => {
  const { id } = match.params;
  const state = useContext(InitDataContext);
  const { products } = state;
  const product = products.find(product => product.id === id);

  return (
    <div className="w-full h-full">
      <div className="m-auto mt-20 mb-10 text-xl text-center font-semibold text-gray-800">
        PRODUCT DETAIL / FIX
      </div>

      {/* COMMON PART */}
      <CommonPart />
      {/* B2B PART */}
      <B2bPart id={id} product={product} />
    </div>
  );
};

export default DetailProduct;
