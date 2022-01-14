import { useState } from "react";
import { toDate } from "../../../../utils/shippingUtils";

export function AddProductRow({
  product,
  user,
  exchangeRate,
  toLocalCurrency,
  toSalePriceToLocaleCurrency,
  add,
  addOrder,
}) {
  const [price, setPrice] = useState(
    toSalePriceToLocaleCurrency(
      product.data.price,
      user.data,
      exchangeRate,
      product.data.category
    )
  );
  const [memo, setMemo] = useState("");
  const [qty, setQty] = useState("");
  const [soldOut] = useState(
    Number(product.data.stock) > 0 || product.data.limitedStock === false
      ? false
      : true
  );

  return (
    <div
      id={product.id}
      className="grid  grid-cols-20 place-items-center text-center 
        text-sm border-b py-2 border bg-white relative"
    >
      <img
        className="col-span-2 h-14 w-14 bg-contain bg-center bg-no-repeat rounded-sm"
        src={product.data.thumbNail}
        alt="thumbNail"
      />{" "}
      <div className="col-span-2 h-full flex flex-col items-center">
        <div className="h-full items-center flex">{product.data.barcode}</div>
        <div className="h-full items-center flex">{product.data.sku}</div>
      </div>
      <div className="col-span-6 text-left w-full">{product.data.title}</div>
      <div className="col-span-2">
        출시일 : {toDate(product.data.relDate.seconds)}
      </div>
      {soldOut ? (
        <div className=" font-bold text-red-600 text-sm text-center ">
          SOLD OUT
        </div>
      ) : (
        <>
          <div className="col-span-3">
            <div className="line-through">
              {toLocalCurrency(product.data.price, user.data, exchangeRate)}{" "}
              {user?.data.currency}
            </div>
            <div className="font-semibold">
              <input
                className="w-1/2 text-right border py-1 outline-none"
                type="number"
                value={price}
                onChange={e =>
                  setPrice(
                    toSalePriceToLocaleCurrency(
                      e.target.value,
                      user.data,
                      exchangeRate,
                      product.data.category
                    )
                  )
                }
              />

              {user?.data.currency}
            </div>
          </div>
          <div>
            <input
              className="border w-2/3 py-1 px-2 outline-none"
              type="number"
              value={qty}
              onChange={e => setQty(Number(e.target.value))}
            />
            {"EA"}
          </div>
          <div className="col-span-3">
            <input
              placeholder="memo"
              className="border w-full py-1 px-3"
              type="text"
              value={memo}
              onChange={e => setMemo(e.target.value)}
            />
          </div>
          <div
            className="col-span-1 bg-blue-800 rounded-md text-white py-2 px-3 font-semibold cursor-pointer"
            onClick={() => addOrder(product, add, price, qty, memo, user)}
          >
            추가
          </div>
        </>
      )}
    </div>
  );
}
