import React, { useContext } from "react";
import { InitDataContext } from "../App";
import { db } from "../firebase";

const CreatedAt = () => {
  const state = useContext(InitDataContext);

  const { products } = state;
  const today = new Date();
  //   console.log(products);
  const batch = db.batch();

  const addCreatedAtToProduct = async () => {
    for (let i = 2500; i < products.length; i++) {
      console.log(i, "번째");

      const productId = products[i].id;
      const productRef = db.collection("products").doc(`${productId}`);

      await batch.update(productRef, { createdAt: today });

      //   await db.collection("products")
      //     .doc(products[i].id)
      //     .update({ createdAt: today });
    }
    console.log("커밋");

    batch.commit();
  };
  return (
    <>
      <button
        onClick={addCreatedAtToProduct}
        className="text-left text-2xl  
         mb-1 ml-2 bg-gray-500 text-gray-200 p-1 rounded m-1"
      >
        createdAt
      </button>
    </>
  );
};

export default CreatedAt;
