export default function CommonRow({
  id,
  title,
  relDate,
  thumbNail,
  name,
  onChange,
  price,
  product,
  user,
  exchangeRate,
}) {
  return (
    <div
      id={id}
      className="grid grid-cols-20 place-items-center text-center
      text-xs border-b border-l border-r py-1 bg-white relative "
    >
      <img
        className="col-span-2 h-10 bg-contain bg-center bg-no-repeat rounded-sm  z-10"
        src={thumbNail}
        alt=""
      />
      <div className="col-span-2 z-10">{product.data.barcode}</div>
      <div className="col-span-2 z-10">{product.data.sku}</div>
      <div className="col-span-5 text-left z-10">{title}</div>
      <div className="col-span-3 z-10">
        {new Date(relDate.seconds * 1000).toISOString().substring(0, 10)}
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
        disabled={
          Number(product.data.stock) > 0 || product.data.limitedStock === false
            ? false
            : true
        }
        type="number"
        name={name}
        onChange={onChange}
        className="w-1/2 h-7 border text-center col-span-2"
      />
      {Number(product.data.stock) > 0 || product.data.limitedStock === false ? (
        ""
      ) : (
        // FIXME: 요청하면 어디서 받을지 확인 후 수정
        <div
          className="font-extrabold text-red-600 
      text-xl absolute pl-8 items-center flex flex-row"
        >
          <div className="opacity-50 z-0">OUT OF STOCK ‼️ OUT OF STOCK ‼️</div>
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
            <div className="opacity-50 z-0">OUT OF STOCK ‼️</div>
          )}
        </div>
      )}
    </div>
  );
}
