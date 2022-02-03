// import React from "react";
// // import BuildIcon from "@mui/icons-material/Build";

// export function HiddenRowRow({ shipping, li }) {
//   // const [forFix, setForFix] = useState(false);
//   // const handleForFix = () => {
//   //   setForFix(!forFix);
//   // };
//   // const [trackingNumber, setTrackingNumber] = useState(
//   //   shipping.data.trackingNumber
//   // );

//   return (
//     <div className="grid grid-cols-20 text-gray-800 items-center py-1">
//       <div className="col-span-9"></div>
//       {/* <div className="col-span-1">
//         <BuildIcon
//           className="cursor-pointer"
//           style={{ fontSize: "medium" }}
//           onClick={() => handleForFix()}
//         />
//       </div> */}

//       <div
//         className="col-span-10 text-left cursor-pointer"
//         onClick={() =>
//           window.open(
//             `https://www.dhl.com/global-en/home/tracking/tracking-express.html?submit=1&tracking-id=${li}`,
//             "_blank"
//           )
//         }
//       >
//         {li}
//       </div>
//     </div>
//   );
// }

// const HiddenRow = ({ shipping }) => {
//   return (
//     <div
//       className="grid-flow-col text-center
//     py-2 text-xs bg-white"
//     >
//       {shipping && shipping?.data?.trackingNumber?.split("\n")?.length > 1 && (
//         <div className="border-b">
//           {shipping?.data?.trackingNumber?.split("\n")?.map((li, i) => (
//             <HiddenRowRow key={i} li={li} shipping={shipping} />
//           ))}
//         </div>
//       )}
//       {shipping &&
//         shipping?.data?.list?.map((li, i) => (
//           <div
//             key={i}
//             className="grid grid-cols-20 text-gray-800 items-center pt-1"
//           >
//             {/* <div className="col-span-2"></div> */}
//             <div className="col-span-3">{li.childOrderNumber}</div>
//             <div className="col-span-9 text-left">{li.title}</div>
//             <div className="col-span-2">
//               {li.price} {li.currency}
//             </div>
//             <div className="col-span-2">{li.barcode} </div>
//             <div className="col-span-2">{li.quan} ea</div>
//           </div>
//         ))}
//     </div>
//   );
// };

// export default HiddenRow;
