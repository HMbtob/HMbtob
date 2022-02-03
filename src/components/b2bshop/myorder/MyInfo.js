// import React, { useContext, useState } from "react";
// import { InitDataContext } from "../../../App";
// import { db } from "../../../firebase";
// import Modal from "../../modal/Modal";
// import CreditDetails from "../../admin/customer/utils/CreditDetails";
// import useInputs from "../../../hooks/useInput";

// const MyInfo = ({ match }) => {
//   const { uid } = match.params;
//   const state = useContext(InitDataContext);
//   const { accounts, dhlShippingFee } = state;
//   const { z } = dhlShippingFee;
//   const countries = [].concat(
//     ...z
//       ?.map(zo => Object.values(zo).map(co => co.country))
//       .map(doc => [].concat(...doc))
//   );
//   const user = accounts.find(account => account.data.uid === uid);
//   const { creditDetails } = user.data;

//   const [modalOpen, setModalOpen] = useState(false);
//   const openModal = () => {
//     setModalOpen(true);
//   };
//   const closeModal = () => {
//     setModalOpen(false);
//   };
//   const [form, onChange] = useInputs({
//     recipientEmail: user?.data.recipientEmail,
//     recipientPhoneNumber: user?.data.recipientPhoneNumber,
//     street: user?.data.street,
//     city: user?.data.city,
//     states: user?.data.states,
//     country: user?.data.country,
//     zipcode: user?.data.zipcode,
//     recipient: user?.data.recipient,
//     shippingMessage: user?.data.shippingMessage,
//     taxId: user?.data.taxId,
//     companyName: user?.data.companyName,
//   });

//   const {
//     recipientEmail,
//     recipientPhoneNumber,
//     street,
//     city,
//     states,
//     country,
//     zipcode,
//     recipient,
//     shippingMessage,
//     taxId,
//     companyName,
//   } = form;

//   const saveDetails = () => {
//     db.collection("accounts").doc(user.id).update({
//       recipientEmail,
//       recipientPhoneNumber,
//       street,
//       city,
//       states,
//       country,
//       zipcode,
//       recipient,
//       shippingMessage,
//       taxId,
//       companyName,
//     });
//     alert("Modifications completed");
//   };

//   return (
//     <div className="w-full h-full flex justify-center">
//       <div className="w-11/12 flex-col mt-20">
//         <div
//           className="text-center text-md bg-gray-800
//     rounded-sm text-gray-100 mb-5 w-full"
//         >
//           MY INFOMATION
//         </div>
//         <div className="flex flex-col lg:flex-row justify-evenly">
//           {/* 주문내용 확인 */}
//           <div className="flex-col mb-20 lg:mb-10 flex space-y-2  items-center">
//             <div className="grid grid-cols-2">
//               <div className="text-right pr-2">E-MAIL :</div>
//               <div>{user?.id}</div>
//             </div>

//             <div className="grid grid-cols-2">
//               <div className="text-right pr-2">Name :</div>
//               <div>{user?.data.displayName}</div>
//             </div>

//             <div className="grid grid-cols-2">
//               <div className="text-right pr-2">Phone Number :</div>
//               {user?.data.phoneNumber}
//             </div>
//             <div className="grid grid-cols-2">
//               <div className="text-right pr-2">Tax Id :</div>
//               {user?.data.taxId}
//             </div>
//             <div className="grid grid-cols-2">
//               <div className="text-right pr-2">Company Name :</div>
//               {user?.data.companyName}
//             </div>

//             <div className="grid grid-cols-2">
//               <div className="text-right pr-2">CREDIT :</div>
//               <div>
//                 {Math.round(user?.data.credit).toLocaleString("ko-KR")}{" "}
//                 {user?.data.currency}
//               </div>
//             </div>
//             <div className="">
//               <Modal
//                 open={modalOpen}
//                 close={closeModal}
//                 header={"CREDIT DETAILS"}
//               >
//                 <CreditDetails creditDetails={creditDetails} />
//               </Modal>
//               <button
//                 onClick={openModal}
//                 className="bg-gray-500 p-1 rounded text-gray-200 mt-2 px-3"
//               >
//                 Credit Details
//               </button>
//             </div>
//           </div>
//           {/* 수령인 파트 */}

//           <div className="flex-col mb-10 flex space-y-2 items-center">
//             <div className="grid grid-cols-2 items-center  w-full">
//               <div className="text-right pr-2">Recipient Email</div>
//               <input
//                 name="recipientEmail"
//                 value={recipientEmail}
//                 onChange={onChange}
//                 className="border p-1"
//               />{" "}
//             </div>
//             <div className="grid grid-cols-2 items-center  w-full">
//               <div className="text-right pr-2">Recipient PhoneNumber</div>
//               <input
//                 name="recipientPhoneNumber"
//                 value={recipientPhoneNumber}
//                 onChange={onChange}
//                 className="border p-1"
//               />{" "}
//             </div>
//             <div className="grid grid-cols-2 items-center  w-full">
//               <div className="text-right pr-2">Street</div>
//               <input
//                 name="street"
//                 value={street}
//                 onChange={onChange}
//                 className="border p-1"
//               />{" "}
//             </div>
//             <div className="grid grid-cols-2 items-center  w-full">
//               <div className="text-right pr-2">City</div>
//               <input
//                 name="city"
//                 value={city}
//                 onChange={onChange}
//                 className="border p-1"
//               />{" "}
//             </div>
//             <div className="grid grid-cols-2 items-center w-full">
//               <div className="text-right pr-2">state</div>
//               <input
//                 name="states"
//                 value={states}
//                 onChange={onChange}
//                 className="border p-1"
//               />{" "}
//             </div>
//             <div className="grid grid-cols-2 items-center  w-full">
//               <div className="text-right pr-2">Country</div>
//               <select
//                 name="country"
//                 value={country}
//                 onChange={onChange}
//                 className="border p-1 pl-2"
//               >
//                 {countries.sort().map((co, i) => (
//                   <option key={i} value={co}>
//                     {co}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="grid grid-cols-2 items-center  w-full">
//               <div className="text-right pr-2">Zipcode</div>
//               <input
//                 name="zipcode"
//                 value={zipcode}
//                 onChange={onChange}
//                 className="border p-1"
//               />{" "}
//             </div>
//             <div className="grid grid-cols-2 items-center  w-full">
//               <div className="text-right pr-2">Recipient</div>
//               <input
//                 name="recipient"
//                 value={recipient}
//                 onChange={onChange}
//                 className="border p-1"
//               />{" "}
//             </div>
//             <div className="grid grid-cols-2 items-center  w-full">
//               <div className="text-right pr-2">MEMO</div>
//               <textarea
//                 required
//                 rows="5"
//                 cols="19"
//                 name="shippingMessage"
//                 value={shippingMessage}
//                 onChange={onChange}
//                 className="border p-1"
//               />
//             </div>
//             <button
//               onClick={saveDetails}
//               className="bg-gray-500 p-1 rounded text-gray-200 w-28"
//             >
//               SAVE
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyInfo;
