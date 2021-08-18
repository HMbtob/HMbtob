import React, { useState } from "react";
import { db } from "../../../firebase";
import firebase from "firebase";

const ProductMemo = ({ productMemo, id, user }) => {
  const [memo, setMemo] = useState("");

  const handleMemo = e => {
    setMemo(e.target.value);
  };

  const saveMemo = () => {
    db.collection("products")
      .doc(id)
      .update({
        productMemo: firebase.firestore.FieldValue.arrayUnion({
          writer: user.email,
          memo: memo,
          date: new Date(),
        }),
      });
    setMemo("");
  };
  return (
    <div>
      <div>
        {productMemo &&
          productMemo.map((de, i) => (
            <div key={i} className="grid grid-cols-5 text-center">
              <div>{de.writer}</div>

              <div className="col-span-2">
                {de.date.toDate().toLocaleString()}
              </div>

              <div>{de.memo}</div>
            </div>
          ))}
      </div>
      <input type="text" value={memo} onChange={handleMemo} />
      <button onClick={saveMemo}>작성하기</button>
    </div>
  );
};

export default ProductMemo;
