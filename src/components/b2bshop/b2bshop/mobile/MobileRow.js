// import React from "react";

// const MobileRow = ({ product, user, exchangeRate, simpleList, onChange }) => {
//   return (
//     <div className="flex flex-row w-full items-center border-b">
//       {/* 첫칸 이미지 */}
//       <div className="w-1/12">
//         <img src={product?.data?.thumbNail} alt="" className="ml-1" />
//       </div>
//       {/* 두번칸 상단-> 타이틀, 하단->출시일, 가격  */}
//       <div className="flex flex-col w-9/12">
//         <div className="p-1 pl-3 text-gray-800 text-xs">
//           {product?.data?.title}
//         </div>
//         <div
//           className="flex flex-row justify-evenly
//         text-gray-800 font-semibold my-1 text-sm"
//         >
//           <div>
//             {new Date(product?.data?.relDate?.seconds * 1000)
//               .toISOString()
//               .substring(0, 10)}
//           </div>
//           <div>
//             {exchangeRate[user?.currency] === 1
//               ? (
//                   (product?.data?.price -
//                     product?.data?.price *
//                       user?.dcRates[product?.data?.category] -
//                     user?.dcAmount[`${product?.data?.category}A`]) /
//                   exchangeRate[user?.currency]
//                 ).toLocaleString("ko-KR")
//               : (
//                   (product?.data?.price -
//                     (
//                       product?.data?.price *
//                         user?.dcRates[product?.data?.category] -
//                       user?.dcAmount[`${product?.data?.category}A`]
//                     )?.toFixed(2)) /
//                   exchangeRate[user?.currency]
//                 )
//                   .toFixed(2)
//                   .toLocaleString("ko-KR")}{" "}
//             {user?.currency}
//           </div>{" "}
//         </div>
//       </div>
//       {/* 세번째칸 수량 */}
//       <div className="w-2/12 h-full">
//         <input
//           id={product.id}
//           disabled={
//             Number(product.data.stock) > 0 ||
//             product.data.limitedStock === false
//               ? false
//               : true
//           }
//           type="number"
//           name={product.id}
//           onChange={onChange}
//           value={simpleList?.find(list => list.productId === product.id)?.quan}
//           className="w-11/12 h-10 text-center
//           text-lg border outline-none"
//         />
//       </div>
//     </div>
//   );
// };

// export default MobileRow;
