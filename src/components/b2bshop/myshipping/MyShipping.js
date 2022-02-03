// import React, { useContext } from "react";
// import { InitDataContext } from "../../../App";
// import ShippingList from "../../admin/shipping/ShippingList";

// export function MyShipping() {
//   const state = useContext(InitDataContext);
//   const { shippings, user } = state;
//   const shipping = shippings.filter(
//     shipping => shipping.data.customer === user.email
//   );

//   return (
//     <div className="w-full flex justify-center">
//       <div className="w-11/12">
//         <ShippingList shipping={shipping} from="myorder" />
//       </div>
//     </div>
//   );
// }
