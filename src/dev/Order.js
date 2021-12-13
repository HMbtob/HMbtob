import React from "react";
import { db } from "../firebase";

export default function Order() {
  const asdasd = async () => {
    const product = await db.collection("products").doc("1006").get();
    console.log(product.data());
  };
  return (
    <div>
      order add
      <button onClick={() => asdasd()}>add</button>
    </div>
  );
}
