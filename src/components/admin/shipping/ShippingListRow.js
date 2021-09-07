import React, { useState } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import HiddenRow from "./HiddenRow";
const ShippingListRow = ({ shipping, from }) => {
  const [forHidden, setForHidden] = useState(true);
  const handleHidden = forHidden => {
    if (forHidden === true) {
      setForHidden(false);
    } else if (forHidden === false) {
      setForHidden(true);
    }
  };
  if (shipping) {
    return (
      <div className="border-b border-r border-l w-full border-gray-500">
        <div
          className="text-xs place-items-center grid 
      grid-cols-28 grid-flow-col text-center border-b 
       py-1 bg-white"
        >
          <div className="col-span-3">{shipping?.data?.shippingNumber}</div>
          <div className="col-span-3">
            {new Date(shipping?.data?.shippedDate.toDate()).toLocaleString()}
          </div>
          <div className="col-span-3">{shipping?.data?.orderNumber}</div>
          <div className="col-span-3">
            {new Date(shipping?.data?.orderCreatedAt.toDate()).toLocaleString()}
          </div>
          {shipping?.data?.trackingNumber?.split("\n")?.length > 1 ? (
            <div className="col-span-2">Boxes</div>
          ) : (
            <div
              className="col-span-2 cursor-pointer"
              onClick={() =>
                window.open(
                  `https://www.dhl.com/global-en/home/tracking/tracking-express.html?submit=1&tracking-id=${shipping?.data?.trackingNumber}`,
                  "_blank"
                )
              }
            >
              {shipping?.data?.trackingNumber}
            </div>
          )}

          <ExpandMoreIcon
            className="cursor-pointer mr-3"
            onClick={() => handleHidden(forHidden)}
          />
          <div className="col-span-3">{shipping?.data?.customer}</div>
          <div>{shipping?.data?.shippingType}</div>
          <div className="col-span-2">{shipping?.data?.country}</div>
          <div className="col-span-1">{shipping?.data?.list.length} type</div>
          <div className="col-span-1">
            {Number(
              shipping?.data?.list.reduce((i, c) => {
                return i + c.quan;
              }, 0)
            )}{" "}
            EA
          </div>
          {from !== "myorder" && (
            <div className="col-span-1">
              {Number(
                shipping?.data?.list.reduce((i, c) => {
                  return i + c.weight * c.quan;
                }, 0)
              ) / 1000}{" "}
              KG
            </div>
          )}
          <div className="col-span-2">
            {" "}
            {Math.round(
              (Number(
                shipping?.data?.list.reduce((i, c) => {
                  return i + c.weight * c.quan;
                }, 0)
              ) /
                1000) *
                Number(
                  shipping?.data?.shippingRate[shipping?.data?.shippingType]
                )
            ).toLocaleString("ko-KR")}
          </div>

          <div className="col-span-2">
            {" "}
            {Math.round(
              shipping?.data?.list.reduce((i, c) => {
                return i + (c.price - c.dcRate * c.price) * c.quan;
              }, 0)
            ).toLocaleString("ko-KR")}{" "}
          </div>
        </div>
        {forHidden ? "" : <HiddenRow shipping={shipping} />}
      </div>
    );
  }
  return "loading";
};

export default ShippingListRow;
