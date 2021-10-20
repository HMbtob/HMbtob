import React from "react";

const HiddenRow = ({ shipping }) => {
  return (
    <div
      className="grid-flow-col text-center
    py-2 text-xs bg-white"
    >
      {shipping && shipping?.data?.trackingNumber?.split("\n")?.length > 1 && (
        <div className="border-b">
          {shipping?.data?.trackingNumber?.split("\n")?.map((li, i) => (
            <div
              key={i}
              className="grid grid-cols-20 text-gray-800 items-center py-1"
            >
              <div className="col-span-9"></div>
              <div
                className="col-span-11 text-left cursor-pointer"
                onClick={() =>
                  window.open(
                    `https://www.dhl.com/global-en/home/tracking/tracking-express.html?submit=1&tracking-id=${li}`,
                    "_blank"
                  )
                }
              >
                {li}
              </div>
            </div>
          ))}
        </div>
      )}
      {shipping &&
        shipping?.data?.list?.map((li, i) => (
          <div
            key={i}
            className="grid grid-cols-20 text-gray-800 items-center pt-1"
          >
            {/* <div className="col-span-2"></div> */}
            <div className="col-span-3">{li.childOrderNumber}</div>
            <div className="col-span-9 text-left">{li.title}</div>
            <div className="col-span-2">
              {li.price} {li.currency}
            </div>
            <div className="col-span-2">{li.barcode} </div>
            <div className="col-span-2">{li.quan} ea</div>
          </div>
        ))}
    </div>
  );
};

export default HiddenRow;
