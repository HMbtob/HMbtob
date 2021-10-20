import React, { useContext } from "react";
import { InitDataContext } from "../../../App";
import CommonPart from "./CommonPart";

const DetailProduct = ({ match }) => {
  const { id } = match.params;
  const state = useContext(InitDataContext);
  const { products } = state;
  const product = products.find(product => product.id === id);

  return (
    <div className="w-full h-full">
      {/* COMMON PART */}
      <CommonPart id={id} product={product} />
    </div>
  );
};

export default DetailProduct;
