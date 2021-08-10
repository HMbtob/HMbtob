import React from "react";

const PreOrderRow = ({
  id,
  title,
  relDate,
  thumbNail,
  onChange,
  name,
  preOrderDeadline,
  price,
  product,
  user,
}) => {
  return (
    <div
      id={id}
      className="grid  grid-cols-20 place-items-center text-center 
      text-xs border-b p-1 border-l border-r bg-white relative"
    >
      <img
        className="h-8 bg-contain bg-center bg-no-repeat rounded-sm"
        src={thumbNail}
        alt=""
      />

      <div className="col-span-2">{product.data.barcode}</div>
      <div className="col-span-2">{product.data.sku}</div>
      <div className="col-span-5">{title}</div>
      <div className="col-span-2">
        {new Date(relDate.seconds * 1000).toISOString().substring(0, 10)}
      </div>
      <div className="col-span-2">
        {new Date(preOrderDeadline.seconds * 1000)
          .toISOString()
          .substring(0, 10)}
      </div>
      <div className="col-span-2">{price} 원</div>
      <div className="col-span-2">
        {price - price * user?.dcRates[product.data.category]} 원
      </div>
      {/* 재고 */}
      <input
        id={id}
        disabled={Number(product.data.stock) > 0 ? false : true}
        type="number"
        name={name}
        onChange={onChange}
        className="w-1/2 h-6 border text-center col-span-2"
      />
      {Number(product.data.stock) > 0 ? (
        ""
      ) : (
        // FIXME: 요청하면 어디서 받을지 확인 후 수정
        <div
          className="font-extrabold text-red-600 
      text-lg absolute pl-8 items-center flex flex-row "
        >
          OUT OF STOCK ‼️ OUT OF STOCK ‼️
          {product.data.reStockable === "가능" ? (
            <>
              <div
                className="border w-36 mx-5 text-gray-800 text-center 
           font-light text-base bg-white"
              >
                <input
                  type="number"
                  placeholder="RE STOCK"
                  className="w-28 p-1"
                />{" "}
                EA
              </div>
              <button className="bg-red-500 text-white rounded px-3 font-semibold">
                REQUEST{" "}
              </button>
            </>
          ) : (
            "OUT OF STOCK ‼️"
          )}
        </div>
      )}
    </div>
  );
};

export default PreOrderRow;
