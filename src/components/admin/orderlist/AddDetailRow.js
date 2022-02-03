// import React, { useEffect, useState } from "react";
// import { db } from "../../../firebase";
// import firebase from "firebase";
// import useInputs from "../../../hooks/useInput";

// const AddDetailRow = ({ order }) => {
//   const [title, setTitle] = useState("");
//   const [price, setPrice] = useState(0);
//   const [quan, setQuan] = useState(0);
//   const [totalWeight, setTotalWeight] = useState(0);
//   const [form, onChange] = useInputs({
//     barcode: "",
//     canceled: false,
//     createdAt: new Date(),
//     currency: order.data.currency,
//     dcAmount: 0,
//     dcRate: 0,
//     exchangeRate: order.data.list[0].exchangeRate,
//     moveTo: "",
//     moved: false,
//     nickName: order.data.nickName,
//     orderNumber: order.data.orderNumber,
//     preOrderDeadline: new Date(),
//     productId: "",
//     relDate: new Date(),
//     shipped: false,
//     sku: "",
//     memoInList: "",
//   });

//   const {
//     barcode,
//     canceled,
//     createdAt,
//     currency,
//     dcAmount,
//     dcRate,
//     exchangeRate,
//     moveTo,
//     moved,
//     nickName,
//     orderNumber,
//     productId,
//     relDate,
//     shipped,
//     sku,
//     memoInList,
//   } = form;

//   const [childOrderNumber, setChildOrderNumber] = useState(
//     `${order.data.orderNumber.trim()}-${order.data.list.length + 1}`
//   );
//   const [totalPrice, setTotalPrice] = useState(price * quan);

//   const addList = () => {
//     console.log(title.length, price.length, quan.length, totalWeight.length);
//     if (
//       title.length >= 1 &&
//       price.length >= 1 &&
//       quan.length >= 1 &&
//       totalWeight.length >= 1
//     ) {
//       db.collection("orders")
//         .doc("b2b")
//         .collection("b2borders")
//         .doc(order.id)
//         .update({
//           list: firebase.firestore.FieldValue.arrayUnion({
//             barcode,
//             canceled,
//             childOrderNumber,
//             createdAt: new Date(createdAt),
//             currency,
//             dcAmount,
//             dcRate,
//             exchangeRate,
//             moveTo,
//             moved,
//             nickName,
//             orderNumber,
//             preOrderDeadline: new Date(relDate),
//             price: Number(price),
//             productId,
//             quan: Number(quan),
//             relDate: new Date(relDate),
//             shipped,
//             sku,
//             title,
//             totalPrice: Number(totalPrice),
//             totalWeight: Number(totalWeight) * 1000,
//             weight: (Number(totalWeight) * 1000) / quan,
//             memoInList,
//           }),
//         });
//       setTitle("");
//       setPrice(0);
//       setQuan(0);
//       setTotalWeight(0);
//     } else {
//       alert("올바른 값을 입력해 주세요.");
//     }
//   };
//   useEffect(() => {
//     setTotalPrice(price * quan);
//   }, [price, quan, order.data.currency]);

//   useEffect(() => {
//     setChildOrderNumber(
//       `${order.data.orderNumber.trim()}-${order.data.list.length + 1}`
//     );
//   }, [order]);

//   return (
//     <div
//       className="text-xs grid grid-cols-28 text-center
//                 border-b border-l border-r py-1 place-items-center"
//     >
//       <button
//         className="rounded bg-gray-700 py-1 font-semibold w-11/12
//       text-white text-sm"
//         onClick={addList}
//       >
//         ADD
//       </button>

//       {/* No. (자동생성되야함) */}
//       <div className="col-span-3">{childOrderNumber}</div>
//       {/* 주문일 */}
//       <input
//         type="date"
//         name="createdAt"
//         value={createdAt}
//         onChange={onChange}
//         className="col-span-2 w-full bg-transparent"
//       />

//       {/* 출시일 */}
//       <input
//         type="date"
//         name="relDate"
//         value={relDate}
//         onChange={onChange}
//         className="col-span-2 w-full bg-transparent"
//       />

//       {/* 타이틀 */}
//       <div className="col-span-10 text-left w-full flex flex-col">
//         <input
//           type="text"
//           name="title"
//           value={title}
//           onChange={e => setTitle(e.target.value)}
//           className="w-full outline-none py-1 px-2 border"
//         />
//       </div>
//       {/* 가격 */}
//       <div className="col-span-2 flex flex-row p-1 border bg-white">
//         <input
//           type="number"
//           name="price"
//           value={price}
//           onChange={e => setPrice(e.target.value)}
//           className="w-16 text-center outline-none"
//         />
//         {order && order?.data?.currency}
//       </div>
//       <div className="col-span-2 flex flex-row p-1 border bg-white">
//         <input
//           type="number"
//           name="quan"
//           value={quan}
//           onChange={e => setQuan(e.target.value)}
//           className="w-12 text-center outline-none"
//         />
//         {/* {quan && quan}  */}
//         EA
//       </div>
//       <div className="col-span-2 flex flex-row p-1 border bg-white">
//         <input
//           type="number"
//           name="totalWeight"
//           value={totalWeight}
//           onChange={e => setTotalWeight(e.target.value)}
//           className="w-12 text-center outline-none"
//         />
//         {/* {quan && quan}  */}
//         KG
//       </div>
//       <div className="col-span-2">
//         {price &&
//           quan &&
//           Number(Number(totalPrice).toFixed(2)).toLocaleString("ko-KR")}{" "}
//         {order && order?.data?.currency}
//       </div>
//       <div className="col-span-2 text-left w-full flex flex-col border">
//         <input
//           type="text"
//           name="memoInList"
//           value={memoInList}
//           onChange={onChange}
//           className="w-full outline-none py-1 px-1"
//         />
//       </div>
//     </div>
//   );
// };

// export default AddDetailRow;
