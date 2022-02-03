// import React, { useState } from "react";
// import UnshippedHidden from "./UnshippedHidden";

// const UnshippedByProductRow = ({ title, quan, relDate, unshipped, orders }) => {
//   const today = new Date();
//   // 아래에 숨겨진 목록 숨기고 열기 기능
//   const [forHidden, setForHidden] = useState(true);
//   const handleHidden = forHidden => {
//     if (forHidden === true) {
//       setForHidden(false);
//     } else if (forHidden === false) {
//       setForHidden(true);
//     }
//   };
//   return (
//     <div
//       className={`border-b border-l border-r border-black text-sm ${
//         relDate.toDate() > today ? "bg-red-100" : ""
//       }`}
//     >
//       <div
//         className="grid grid-cols-10 py-1 text-sm border-b cursor-pointer"
//         onClick={() => handleHidden(forHidden)}
//       >
//         <div className="col-span-7 pl-3">{title}</div>
//         <div className="col-span-1 text-center">{quan} EA</div>
//         <div className="col-span-2 text-center">
//           {relDate.toDate().toLocaleDateString()}
//         </div>
//       </div>
//       {forHidden ? (
//         ""
//       ) : (
//         <UnshippedHidden title={title} unshipped={unshipped} orders={orders} />
//       )}
//     </div>
//   );
// };

// export default UnshippedByProductRow;
