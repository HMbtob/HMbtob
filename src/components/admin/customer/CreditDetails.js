import React from "react";

const CreditDetails = ({ creditDetails }) => {
  return (
    <div className="overflow-y-auto">
      <div className="grid grid-cols-5 text-gray-200 bg-gray-800 text-center">
        <div className="col-span-2">DATE</div>
        <div>TYPE</div>
        <div>PRICE</div>
        <div>AMOUNT</div>
      </div>
      {creditDetails &&
        creditDetails.map((de, i) => (
          <div key={i} className="grid grid-cols-5 text-center border-b py-1">
            <div className="col-span-2">
              {de.date.toDate().toLocaleString()}
            </div>
            <div>{de.type}</div>
            <div>
              {de.type === "makeOrder" ? "-" : de.type === "charge" ? "+" : ""}
              {de.currency === "KRW"
                ? Math.round(de.amount).toLocaleString("ko-KR")
                : de.amount.toFixed(2).toLocaleString("ko-KR")}{" "}
              {de.currency}
            </div>

            <div>
              {de.currency === "KRW"
                ? Math.round(de.totalAmount).toLocaleString("ko-KR")
                : de.totalAmount.toFixed(2).toLocaleString("ko-KR")}{" "}
              {de.currency}
            </div>
          </div>
        ))}
    </div>
  );
};

export default CreditDetails;
