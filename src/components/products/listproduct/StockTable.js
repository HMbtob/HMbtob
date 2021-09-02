import React from "react";

const StockTable = ({ stockHistory, bigTotalSold, totalStock }) => {
  return (
    <div className="overflow-y-auto">
      <div className="grid grid-cols-8 text-gray-200 bg-gray-800 text-center">
        <div className="col-span-2">Type</div>
        <div className="col-span-2">Date</div>
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
        <div className="col-span-2">sell on BigC</div>
        <div className="col-span-2">all the time</div>
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
