import { useState } from "react";
import { db } from "../../firebase";

export function OrderListInShippingsRow({ li, i, shipping }) {
  // 가격, 수량, 총액 수정
  const [price, setPrice] = useState(li.data.price);
  const [quan, setQuan] = useState(li.data.quan);

  const editShipping = async (shipping, li, e) => {
    e.preventDefault();
    console.log("shipping", shipping);
    console.log("li", li);
    try {
      await db
        .collection("accounts")
        .doc(shipping.data.userId)
        .collection("shippingsInAccount")
        .doc(shipping.id)
        .collection("orderListInShippings")
        .doc(li.id)
        .update({ price, quan, totalPrice: price * quan });

      const orderListInShippings = await db
        .collection("accounts")
        .doc(shipping.data.userId)
        .collection("shippingsInAccount")
        .doc(shipping.id)
        .collection("orderListInShippings")
        .get();
      console.log(
        "orderListInShippings",
        orderListInShippings.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );

      alert("가격과 수량이 수정되었습니다.");
    } catch (e) {
      console.log(e);
      alert("수정이 실패했습니다.");
    }
  };

  // 취소
  const cancelShipping = async (e, li) => {
    e.preventDefault();

    try {
      await db
        .collection("accounts")
        .doc(shipping.data.userId)
        .collection("order")
        .doc(li.id)
        .set({ ...li.data });
      await db
        .collection("accounts")
        .doc(shipping.data.userId)
        .collection("shippingsInAccount")
        .doc(shipping.id)
        .collection("orderListInShippings")
        .doc(li.id)
        .delete();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div key={i} className="grid grid-cols-20 text-gray-800 items-center pt-1">
      <div className="col-span-3">{li.data.childOrderNumber}</div>
      <div className="col-span-9 text-left">
        {" "}
        {li.data.title} {li?.data?.optionName}
      </div>
      <div className="col-span-2 flex flex-row items-center">
        <input
          className="p-2 outline-none w-1/2 "
          type="number"
          step={0.01}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <div className="w-1/2 text-left">{li.data.currency}</div>
      </div>
      <div className="col-span-2">{li.data.barcode} </div>
      <div className="col-span-2 flex flex-row items-center">
        <input
          className="p-2 outline-none w-1/2 text-right"
          type="number"
          value={quan}
          onChange={(e) => setQuan(Number(e.target.value))}
        />
        <div className="w-1/2 text-left">EA</div>
      </div>
      <div className="col-span-2">
        {" "}
        {/* <button
          className="bg-gray-800 text-gray-100 py-1 px-2 rounded-sm cursor-pointer mr-2"
          onClick={(e) => editShipping(shipping, li, e)}
        >
          수정
        </button>{" "}
        <button
          className="bg-gray-800 text-gray-100 py-1 px-2 rounded-sm cursor-pointer mr-2"
          onClick={(e) => cancelShipping(e, li)}
        >
          취소
        </button>{" "} */}
      </div>
    </div>
  );
}
