import React, { useState } from "react";
import firebase from "firebase";
import { db } from "../../../firebase";

const ProductMemo = ({ productMemo, id, user }) => {
  const [memo, setMemo] = useState("");

  const handleMemo = (e) => {
    setMemo(e.target.value);
  };

  const saveMemo = () => {
    db.collection("products")
      .doc(id)
      .update({
        productMemo: firebase.firestore.FieldValue.arrayUnion({
          writer: user.nickName || user.email,
          memo: memo.replace(/(?:\r\n|\r|\n)/g, "<br/>"),
          date: new Date(),
        }),
      });
    setMemo("");
  };
  return (
    <div className="overflow-y-auto">
      <div className="grid grid-cols-8 text-gray-200 bg-gray-800 text-center">
        <div className="col-span-2">Date</div>
        <div className="col-span-2">Writer</div>
        <div className="col-span-4">Content</div>
      </div>
      {productMemo &&
        productMemo.map((de, i) => (
          <div
            key={i}
            className="grid grid-cols-8 text-center 
          border-b p-2 py-1 place-items-center"
          >
            <div className="col-span-2">
              {de.date.toDate().toLocaleString()}
            </div>
            <div className="col-span-2 text-sm"> {de.writer}</div>

            <div
              className="col-span-4"
              dangerouslySetInnerHTML={{ __html: de.memo }}
            />
          </div>
        ))}
      <div className="w-full flex flex-row justify-center">
        <textarea
          wrap="hard"
          className="border p-1 my-2 rounded-sm"
          cols="30"
          rows="5"
          type="text"
          value={memo}
          onChange={handleMemo}
        />
        <button
          className="bg-gray-800 text-gray-200 p-1 my-2 rounded-sm"
          onClick={saveMemo}
        >
          작성하기
        </button>
      </div>
    </div>
  );
};

export default ProductMemo;
