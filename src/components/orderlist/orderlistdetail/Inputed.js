import React from "react";

export function Inputed({
  setInputedPrice,
  setInputedShippingFee,
  inputedPrice,
  inputedShippingFee,
  setCheckedRadio,
  checkedRadio,
}) {
  return (
    <div className="flex flex-col  w-full items-center">
      <div className="flex flex-row">
        <input
          type="radio"
          name="price"
          value="inputed"
          onChange={e => setCheckedRadio(e.target.value)}
        />
        <div>입력한 가격으로 발송처리</div>
      </div>
      {checkedRadio === "inputed" && (
        <>
          <div className="flex flex-row">
            <div> 상품 가격</div>
            <div>
              <input
                onChange={e => setInputedPrice(Number(e.target.value))}
                value={inputedPrice}
                type="number"
              />
            </div>
          </div>
          <div className="flex flex-row">
            <div> 배송비</div>
            <div className="flex flex-row">
              <input
                onChange={e => setInputedShippingFee(Number(e.target.value))}
                value={inputedShippingFee}
                type="number"
              />
            </div>
          </div>
          <div className="flex flex-row">
            <div> 합계 금액</div>
            <div className="flex flex-row">
              <input
                disabled
                value={inputedPrice + inputedShippingFee}
                type="number"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
