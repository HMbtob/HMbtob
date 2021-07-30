import React from "react";

const ShippingListRow = ({ shipping }) => {
  if (shipping) {
    return (
      <div
        className="text-xs place-items-center grid 
      grid-cols-20 grid-flow-col text-center border-b 
      border-l border-r py-1"
      >
        <div className="col-span-1">{shipping.data.shippingNumber}</div>
        <div className="col-span-2">
          {new Date(shipping.data.shippedDate.toDate()).toLocaleString()}
        </div>
        <div className="col-span-2">{shipping.data.orderNumber}</div>
        <div className="col-span-2">
          {new Date(shipping.data.orderCreatedAt.toDate()).toLocaleString()}
        </div>
        <div className="col-span-3">{shipping.data.customer}</div>
        <div>{shipping.data.shippingType}</div>
        <div>{shipping.data.country}</div>
        <div className="col-span-1">{shipping.data.list.length}</div>
        <div className="col-span-1">{shipping.data.shippingNumber}</div>
        <div className="col-span-2">
          {Number(
            shipping.data.list.reduce((i, c) => {
              return i + c.weight * c.quan;
            }, 0)
          ) / 1000}{" "}
          KG
        </div>
        <div className="col-span-2">
          {(Number(
            shipping.data.list.reduce((i, c) => {
              return i + c.weight * c.quan;
            }, 0)
          ) /
            1000) *
            Number(shipping.data.shippingRate[shipping.data.shippingType])}{" "}
          원
        </div>
        <div className="col-span-2">
          {shipping.data.list.reduce((i, c) => {
            return i + (c.price - c.dcRate * c.price) * c.quan;
          }, 0)}{" "}
          원
        </div>
      </div>
    );
  }
  return "loading";
};

export default ShippingListRow;
