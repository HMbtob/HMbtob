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
  exchangeRate,
  simpleList,
}) => {
  let today = new Date().getTime();
  let gap = new Date(preOrderDeadline.seconds * 1000).getTime() - today;
  let day = Math.ceil(gap / (1000 * 60 * 60 * 24));
  let hour = Math.ceil((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

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
      <div className="col-span-2 z-10">{product.data.barcode}</div>
      <div className="col-span-2 z-10">{product.data.sku}</div>
      <div className="col-span-5 z-10">{title}</div>
      <div className="col-span-2 z-10">
        {new Date(relDate.seconds * 1000).toISOString().substring(0, 10)}
      </div>
      <div className="col-span-2 z-10">
        <div>
          {new Date(preOrderDeadline.seconds * 1000)
            .toISOString()
            .substring(0, 10)}
        </div>
        <div className=" font-extrabold text-red-500">{`${day} D, ${hour} H`}</div>
      </div>
      <div className="col-span-2 z-10">
        {exchangeRate[user?.currency] === 1
          ? (price / exchangeRate[user?.currency])?.toLocaleString("ko-KR")
          : (price / exchangeRate[user?.currency])
              ?.toFixed(2)
              ?.toLocaleString("ko-KR")}{" "}
        {user?.currency}
      </div>
      <div className="col-span-2 z-10">
        {exchangeRate[user?.currency] === 1
          ? (
              (price - price * user?.dcRates[product.data.category]) /
              exchangeRate[user?.currency]
            ).toLocaleString("ko-KR")
          : (
              (price -
                (price * user?.dcRates[product.data.category])?.toFixed(2)) /
              exchangeRate[user?.currency]
            )
              .toFixed(2)
              .toLocaleString("ko-KR")}{" "}
        {user?.currency}
      </div>
      {/* 재고 */}
      <input
        id={id}
        disabled={Number(product.data.stock) > 0 ? false : true}
        type="number"
        name={name}
        onChange={onChange}
        value={simpleList?.find(list => list.productId === name)?.quan}
        className="w-1/2 h-6 border text-center col-span-2 outline-none"
      />
      {Number(product.data.stock) > 0 ? (
        ""
      ) : (
        // FIXME: 요청하면 어디서 받을지 확인 후 수정
        <div
          className="font-extrabold text-red-600 
      text-xl absolute pl-8 items-center flex flex-row"
        >
          <div className="opacity-40 z-0">OUT OF STOCK ‼️ </div>
          {product.data.reStockable === "가능" ? (
            <>
              <div
                className="border w-36 mx-5 text-gray-800 text-center 
           font-light text-base bg-white z-20 opacity-100"
              >
                <input
                  type="number"
                  placeholder="RE STOCK"
                  className="w-28 p-1 z-20 opacity-100"
                />{" "}
                EA
              </div>
              <button className="bg-red-500 text-white rounded px-3 font-semibold z-20 opacity-100">
                REQUEST{" "}
              </button>
            </>
          ) : (
            <div className="opacity-40 z-0">
              OUT OF STOCK ‼️ NO MORE REPUBLISHED !!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PreOrderRow;
