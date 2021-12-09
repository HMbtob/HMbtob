import React from "react";

export function Caled({
  setCheckedRadio,
  onCal,
  caledPrice,
  caledshippingFee,
  checkedRadio,
}) {
  return (
    <div className="flex flex-col w-full items-center">
      <div>DHL</div>
      <div className="flex flex-row">
        <input
          type="radio"
          name="price"
          value="caled"
          defaultChecked
          onChange={e => setCheckedRadio(e.target.value)}
        />
        <div>계산된 가격으로 발송처리</div>
      </div>
      {checkedRadio === "caled" && (
        <>
          <div className="flex flex-row">
            <div>상품가격</div>
            <div>{caledPrice}</div>
          </div>
          <div className="flex flex-row">
            <div>배송비</div>
            <div>{caledshippingFee}</div>
          </div>
          <div className="flex flex-row">
            <div>합계</div>
            <div>{caledPrice + caledshippingFee}</div>
          </div>
          <button
            type="button"
            onClick={() => onCal()}
            className=" bg-blue-900 text-white py-1 px-3 rounded-sm my-3"
          >
            계산하기
          </button>
        </>
      )}
    </div>
  );
}
