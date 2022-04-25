import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { toDate } from "../../../utils/shippingUtils";

export default function OrderTableRow({ de, id, setOrderQty }) {
  const [memo, setMemo] = useState("");

  useEffect(() => {
    db.collection("products")
      .doc(id)
      .collection("orderQty")
      .doc(de.id)
      .get()
      .then((doc) => setMemo(doc?.data()?.memo));
  }, [de.id, id]);
  return (
    <div
      className={`grid grid-cols-12 text-center border-b  py-1 place-items-center 
              
            `}
    >
      <div className="col-span-2">
        <button
          type="button"
          className="text-white px-2 py-1 rounded-sm bg-gray-800 w-full h-full font-bold"
          onClick={async () => {
            try {
              await db
                .collection("products")
                .doc(id)
                .collection("orderQty")
                .doc(de.id)
                .delete();
              alert("삭제 되었습니다.");
            } catch (e) {
              console.log(e);
              alert("삭제가 실패했습니다.");
            } finally {
              const res = await db
                .collection("products")
                .doc(id)
                .collection("orderQty")
                .get();

              const orders = res.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
              }));
              setOrderQty(orders.reduce((a, c) => a + c.data.orderQty, 0));
            }
          }}
        >
          삭제
        </button>
      </div>
      <div className="col-span-2">{de?.data?.nickName}</div>
      <div className="col-span-2">
        {de?.data?.createdAt && toDate(de.data.createdAt.seconds)}
      </div>

      <div className="col-span-2">{de.data.orderQty}</div>
      <input
        className="col-span-4 py-1 text-left text-gray-800 outline-none w-full border pl-2"
        type="text"
        placeholder="MEMO"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        onKeyPress={async (e) => {
          if (e.key === "Enter") {
            try {
              await db
                .collection("products")
                .doc(id)
                .collection("orderQty")
                .doc(de.id)
                .update({
                  memo,
                });

              alert("메모를 수정했습니다.");
            } catch (e) {
              console.log(e);
              alert("메모 수정을 실패 했습니다.");
            }
          }
        }}
      />
    </div>
  );
}
