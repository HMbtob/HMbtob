import React from "react";
import ImportExportIcon from "@mui/icons-material/ImportExport";
export function OrderListDetailHeader({ handleSort }) {
  return (
    <div
      className="grid grid-cols-36  grid-flow-col text-center bg-gray-800
           text-gray-100 py-1 rounded-sm text-sm items-center"
    >
      <div></div>
      <div className="col-span-3">배송지</div>
      <div
        id="createdAt"
        onClick={e => handleSort(e)}
        className="col-span-2 flex items-center justify-center cursor-pointer"
      >
        주문일 <ImportExportIcon style={{ height: "20" }} />
      </div>
      <div
        id="relDate"
        onClick={e => handleSort(e)}
        className="col-span-2 flex items-center justify-center cursor-pointer"
      >
        출시일
        <ImportExportIcon style={{ height: "20" }} />
      </div>
      <div className="col-span-3">sku</div>
      <div className="col-span-3">barcode</div>
      <div
        id="title"
        onClick={e => handleSort(e)}
        className="col-span-10 flex items-center justify-center cursor-pointer"
      >
        title
        <ImportExportIcon style={{ height: "20" }} />
      </div>
      <div className="col-span-3">price</div>
      <div className="col-span-2">qty</div>
      <div className="col-span-3">totalPrice</div>
      <div className="col-span-4">memo</div>
    </div>
  );
}
