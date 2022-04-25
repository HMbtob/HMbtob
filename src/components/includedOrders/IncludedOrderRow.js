import React from "react";
import { useHistory } from "react-router-dom";

export default function IncludedOrderRow({ doc }) {
  const history = useHistory();

  const goToOrderDetail = () => {
    history.push({ pathname: `/orderlistdetail/${doc.data.userId}` });
  };
  return (
    <div className="border-gray-300 grid grid-cols-36 text-center border-r border-b border-l py-1 text-sm items-center">
      <div
        className="col-span-3 cursor-pointer"
        onClick={() => goToOrderDetail()}
      >
        {doc.data.nickName}
      </div>
      <div className="col-span-3">
        {new Date(doc.data.createdAt.seconds * 1000)
          .toISOString()
          .substring(0, 10)}
      </div>
      <div className="col-span-3">
        {new Date(doc.data.relDate.seconds * 1000)
          .toISOString()
          .substring(0, 10)}
      </div>

      <div className="col-span-3">{doc.data.sku}</div>
      <div className="col-span-3">{doc.data.barcode}</div>
      <div className="col-span-9 flex flex-row items-center justify-between">
        {doc.data.title}
      </div>
      <div className="col-span-3 flex flex-row justify-center items-center">
        {doc.data.price}
      </div>
      <div className="col-span-2 flex flex-row justify-center items-center">
        {doc.data.quan}
      </div>
      <div className="col-span-3">
        {Number(doc.data.totalPrice).toLocaleString()} {doc.data.currency}
      </div>
      <div className="col-span-4 text-left">{doc?.data?.memo}</div>
    </div>
  );
}
