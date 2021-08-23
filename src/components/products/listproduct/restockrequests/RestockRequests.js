import React from "react";

const RestockRequests = ({ reStockRequests }) => {
  const headers = ["DATE", "BARCODE", "SKU", "TITLE", "CUSTOMER", "REQUESTS"];
  return (
    <div>
      <div className="ml-28 mt-16 text-gray-800 text-xl">RESTOCK REQUEST</div>
      <div className="border w-11/12 m-auto mt-4 mb-12">
        <div className="grid grid-cols-12 text-center border-b p-1 bg-gray-100 sticky top-0 text-sm">
          {headers.map((header, index) => (
            <div
              key={index}
              className={
                header === "TITLE"
                  ? "col-span-4"
                  : header === "BARCODE" || header === "SKU"
                  ? "col-span-1"
                  : "col-span-2"
              }
            >
              {header}
            </div>
          ))}
        </div>
        <div className="w-full flex flex-col items-center">
          <div className="w-full">
            {reStockRequests?.map((request, i) => (
              <div
                key={i}
                className="grid grid-cols-12 items-center place-items-center 
              text-xs bg-white w-full border-b py-1"
              >
                <div className="col-span-2">
                  {request.data.requestDate &&
                    new Date(
                      request.data.requestDate.seconds * 1000
                    ).toLocaleDateString()}
                </div>
                <div className="col-span-1">{request.data.barcode}</div>
                <div className="col-span-1">{request.data.sku}</div>
                <div className="col-span-4">{request.data.title}</div>
                <div className="col-span-2">{request.data.customer}</div>
                <div className="col-span-2">{request.data.qty} EA</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestockRequests;
