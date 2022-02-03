// import React from "react";
// import SimpleListRow from "./SimpleListRow";

// const SimpleList = ({
//   simpleList,
//   confirmChecked,
//   B2bMakeOrder,
//   state,
//   onChange,
//   deleteList,
// }) => {
//   const { user } = state;
//   return (
//     <div
//       className="m-auto h-auto lg:h-full w-full lg:w-11/12 mt-12 flex flex-col
//     text-center text-sm font-bold text-gray-800
//     absolute lg:static bg-white lg:bg-transparent"
//     >
//       CART LIST
//       <div
//         className="grid grid-cols-7 place-items-center text-center
//         text-xs bg-blue-900 lg:bg-gray-800 py-1 text-gray-200"
//       >
//         <div className="col-span-3">TITLE</div>
//         <div className="col-span-2">QUAN</div>
//         <div className="col-span-1">PRICE</div>
//         <div className="col-span-1">TOTAL</div>
//       </div>
//       <div className="h-2/3 lg:mb-10 overflow-y-auto">
//         {simpleList &&
//           simpleList.map(doc => (
//             <SimpleListRow
//               key={doc.title}
//               title={doc.title}
//               quan={doc.quan}
//               price={doc.price}
//               totalPrice={doc.totalPrice}
//               onChange={onChange}
//               id={doc.productId}
//               simpleList={simpleList}
//               deleteList={deleteList}
//             />
//           ))}
//         {/* 버튼들 */}
//         <div className="w-full lg:flex flex-col justify-evenly mt-10 hidden">
//           <div className="w- full flex flex-row justify-evenly">
//             {user && (
//               <>
//                 <div>MY CREDIT : </div>
//                 <div>
//                   {Math.round(user.credit).toLocaleString("ko-KR")}{" "}
//                   {user.currency}
//                 </div>
//               </>
//             )}
//           </div>

//           <div className="flex justify-evenly mt-2">
//             <button
//               disabled={!confirmChecked}
//               onClick={B2bMakeOrder}
//               className={`${
//                 confirmChecked
//                   ? "cursor-pointer bg-gray-800 px-3 py-1 rounded-sm text-gray-100 font-semibold mb-2"
//                   : "cursor-pointer bg-gray-200 px-3 py-1 rounded-sm text-gray-300 font-semibold mb-2"
//               }`}
//             >
//               ORDER
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SimpleList;
