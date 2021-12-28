import React from "react";

export function Addresses({ type, setType, shippingAddresses, add }) {
  return (
    <div>
      <select
        value={type}
        onChange={e => setType(e.target.value)}
        className="py-1 px-1 border rounded-sm w-4/5 outline-none"
      >
        {shippingAddresses.map(li => (
          <option key={li.data.name} value={li.data.name}>
            {li.data.name}
          </option>
        ))}
      </select>
      {add && type !== "Ship To Korea" ? (
        <div>
          <div>
            {"shippingType : "}
            {add?.data?.shippingType}
          </div>
          <div>
            {"paymentMethod : "}
            {add?.data?.paymentMethod}
          </div>
          <div>
            {"recipient : "}
            {add?.data?.recipient}
          </div>
          <div>
            {"recipientEmail : "}
            {add?.data?.recipientEmail}
          </div>
          <div>
            {"recipientPhoneNumber : "}
            {add?.data?.recipientPhoneNumber}
          </div>
          <div>
            {"country : "}
            {add?.data?.country}
          </div>
          <div>
            {"states : "}
            {add?.data?.states}
          </div>
          <div>
            {"city : "}
            {add?.data?.city}
          </div>
          <div>
            {"street : "}
            {add?.data?.street}
          </div>
          <div>
            {"zipcode : "}
            {add?.data?.zipcode}
          </div>
        </div>
      ) : (
        <div>
          <div>
            {"shippingType : "}
            {add?.data?.shippingType}
          </div>
          <div>
            {"paymentMethod : "}
            {add?.data?.paymentMethod}
          </div>
          <div>
            {"recipient : "}
            {add?.data?.recipient}
          </div>
          <div>
            {"recipientEmail : "}
            {add?.data?.recipientEmail}
          </div>
          <div>
            {"recipientPhoneNumber : "}
            {add?.data?.recipientPhoneNumber}
          </div>
          <div>
            {"country : "}
            {add?.data?.address}
          </div>
          <div>
            {"states : "}
            {add?.data?.detailAddress}
          </div>
          <div>
            {"city : "}
            {add?.data?.zipcode}
          </div>
        </div>
      )}
    </div>
  );
}
