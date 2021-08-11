import React from "react";

const CreditDetails = ({ creditDetails }) => {
  return (
    <div className="overflow-y-auto">
      <div className="grid grid-cols-5 text-gray-200 bg-gray-800 text-center">
        <div>TYPE</div>
        <div>PRICE</div>
        <div className="col-span-2">DATE</div>
        <div>AMOUNT</div>
      </div>
      {creditDetails &&
        creditDetails.map((de, i) => (
          <div key={i} className="grid grid-cols-5 text-center">
            <div>{de.type}</div>
            <div>{Math.round(de.amount).toLocaleString("ko-KR")} 원</div>
            <div className="col-span-2">
              {de.date.toDate().toLocaleString()}
            </div>

            <div>{Math.round(de.totalAmount).toLocaleString("ko-KR")} 원</div>
          </div>
        ))}
    </div>
  );
};

export default CreditDetails;