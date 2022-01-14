import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { toDate } from "../../../utils/shippingUtils";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
const StockTable = ({ stockHistory, bigTotalSold, totalStock, id }) => {
  const [newStockHistory, setNewStockHistory] = useState([]);
  useEffect(() => {
    db.collection("products")
      .doc(id)
      .collection("newStockHistory")
      .onSnapshot(snapshot =>
        setNewStockHistory(
          snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }))
        )
      );
  }, [id]);
  return (
    <div className="overflow-y-auto">
      <div className="mb-2 font-semibold text-base">New Stock History</div>
      <div className="grid grid-cols-12 text-gray-200 bg-gray-800 text-center">
        <div className="col-span-2">주문방법</div>
        <div className="col-span-2">주문일</div>
        <div className="col-span-2">발송일</div>
        <div className="col-span-2">발송방법</div>
        <div className="col-span-2">주문인</div>
        <div className="col-span-1">수량</div>
        <div className="col-span-1">발송수량</div>
      </div>
      {newStockHistory &&
        newStockHistory.map((de, i) => (
          <div
            key={i}
            className="grid grid-cols-12 text-center 
      border-b  py-1 place-items-center"
          >
            <div className="col-span-2 flex flex-row items-center justify-around">
              {de.data.shipped && <LocalShippingIcon />}
              &nbsp;&nbsp;&nbsp;{de?.data?.shippingType && "B2B"}
            </div>
            <div className="col-span-2">
              {de?.data?.createdAt && toDate(de.data.createdAt.seconds)}
            </div>
            <div className="col-span-2">
              {de?.data?.shippedDate && toDate(de.data.shippedDate.seconds)}
            </div>
            <div className="col-span-2">{de?.data?.shippingType} </div>
            <div className="col-span-2 text-sm">
              {de?.data?.nickName ? de.data.nickName : de?.data?.userId}
            </div>
            <div className="col-span-1">{de.data.quan}</div>
            <div className="col-span-1">
              {de?.data?.shippedQty && de.data.shippedQty}
            </div>
          </div>
        ))}
      <div
        className="grid grid-cols-12 text-center 
      border-b  py-1 place-items-center"
      >
        <div className="col-span-2">sell on BigCommerce</div>
        <div className="col-span-9"></div>
        <div> - {bigTotalSold} </div>
      </div>
      <div
        className="grid grid-cols-8 text-center 
      border-b  py-1 place-items-center"
      >
        <div className="col-span-2"></div>
        <div className="col-span-2"></div>
        <div className="col-span-3 text-sm"> Amount</div>

        <div> {totalStock - bigTotalSold}</div>
      </div>
      <div className="mt-12">기존</div>
      <div className="grid grid-cols-8 text-gray-200 bg-gray-800 text-center">
        <div className="col-span-2">Date</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-3">Writer</div>
        <div className="col-span-1">Qty</div>
      </div>
      {stockHistory &&
        stockHistory.map((de, i) => (
          <div
            key={i}
            className="grid grid-cols-8 text-center 
      border-b  py-1 place-items-center"
          >
            <div className="col-span-2">
              {de.date.toDate().toLocaleString()}
            </div>
            <div className="col-span-2">{de.type}</div>
            <div className="col-span-3 text-sm"> {de.writer}</div>

            <div>
              {de.type === "sell on B2B" && `- ${de.amount}`}
              {de.type !== "sell on B2B" && de.amount === 0 && de.amount}
              {de.type !== "sell on B2B" && de.amount < 0 && de.amount}
              {de.type !== "sell on B2B" && de.amount > 0 && `+ ${de.amount}`}
            </div>
          </div>
        ))}
      <div
        className="grid grid-cols-8 text-center 
      border-b  py-1 place-items-center"
      >
        <div className="col-span-2">all the time</div>
        <div className="col-span-2">sell on BigC</div>
        <div className="col-span-3 text-sm"> Total</div>

        <div> - {bigTotalSold} </div>
      </div>
      <div
        className="grid grid-cols-8 text-center 
      border-b  py-1 place-items-center"
      >
        <div className="col-span-2"></div>
        <div className="col-span-2"></div>
        <div className="col-span-3 text-sm"> Amount</div>

        <div> {totalStock - bigTotalSold}</div>
      </div>
    </div>
  );
};

export default StockTable;
