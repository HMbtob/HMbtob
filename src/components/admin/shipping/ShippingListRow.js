import React from "react";

const ShippingListRow = ({ shipping }) => {
  if (shipping) {
    return (
      <div
        className="text-xs place-items-center grid 
      grid-cols-20 grid-flow-col text-center border-b 
      border-l border-r py-1 bg-white"
      >
        <div className="col-span-1">{shipping.data.shippingNumber}</div>
        <div className="col-span-3">
          {new Date(shipping.data.shippedDate.toDate()).toLocaleString()}
        </div>
        <div className="col-span-1">{shipping.data.orderNumber}</div>
        <div className="col-span-3">
          {new Date(shipping.data.orderCreatedAt.toDate()).toLocaleString()}
        </div>
        <div className="col-span-3">{shipping.data.customer}</div>
        <div>{shipping.data.shippingType}</div>
        <div>{shipping.data.country}</div>
        <div className="col-span-1">{shipping.data.list.length} type</div>
        <div className="col-span-1">{shipping.data.shippingNumber} EA</div>
        <div className="col-span-1">
          {Number(
            shipping.data.list.reduce((i, c) => {
              return i + c.weight * c.quan;
            }, 0)
          ) / 1000}{" "}
          KG
        </div>
        <div className="col-span-2">
          ₩{" "}
          {Math.round(
            (Number(
              shipping.data.list.reduce((i, c) => {
                return i + c.weight * c.quan;
              }, 0)
            ) /
              1000) *
              Number(shipping.data.shippingRate[shipping.data.shippingType])
          ).toLocaleString("ko-KR")}
        </div>
        <div className="col-span-2">
          ₩{" "}
          {Math.round(
            shipping.data.list.reduce((i, c) => {
              return i + (c.price - c.dcRate * c.price) * c.quan;
            }, 0)
          ).toLocaleString("ko-KR")}{" "}
        </div>
      </div>
    );
  }
  return "loading";
};

export default ShippingListRow;
