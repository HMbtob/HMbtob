import React from "react";

const CreditDetails = ({ creditDetails }) => {
  return (
    <>
      <div className="grid grid-cols-5 text-gray-200 bg-gray-800 text-center">
        <div>종류</div>
        <div>액수</div>
        <div className="col-span-2">날짜</div>
        <div>총액</div>
      </div>
      {creditDetails &&
        creditDetails.map((de, i) => (
          <div key={i} className="grid grid-cols-5 text-center">
            <div>{de.type}</div>
            <div>{de.amount} 원</div>
            <div className="col-span-2">
              {new Date(de.date.toDate()).toLocaleString()}
            </div>

            <div>{de.totalAmount} 원</div>
          </div>
        ))}
    </>
  );
};

export default CreditDetails;
