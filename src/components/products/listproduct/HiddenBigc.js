import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { InitDataContext } from "../../../App";

const HiddenBigc = ({
  id,
  sku,
  thumbNail,
  title,
  price,
  stock,
  totalSell,
  unShipped,
  relDate,
  preOrderDeadline,
  orders,
  shippings,
  bigcProductId,
}) => {
  const state = useContext(InitDataContext);
  const { unShippedProductsIdandQty } = state;
  const [product, setProduct] = useState({
    handlePrice: "",
    handleStock: "",
    total_sold: "",
    productName: "",
  });

  const { handlePrice, handleStock, total_sold, productName } = product;

  const onChange = e => {
    const { name, value } = e.target;

    setProduct({
      ...product,
      [name]: value,
    });
  };

  const fixfix = async (id, qty, price) => {
    await axios
      .get(
        `https://us-central1-interasiastock.cloudfunctions.net/app/big/fixproductinventoryprice/${id}/${qty}/${price}`
      )
      .then(() => alert("수정되었습니다."))
      .catch(e => console.log(e));
  };

  useEffect(() => {
    const sdadasdasd = async () => {
      await axios
        .get(
          `https://us-central1-interasiastock.cloudfunctions.net/app/big/getproductinfo/${bigcProductId}`
        )
        .then(p =>
          setProduct({
            handlePrice: p.data.data.price,
            handleStock: p.data.data.inventory_level,
            total_sold: p.data.data.total_sold,
            productName: p.data.data.name,
          })
        )
        .catch(e => console.log(e));
    };
    sdadasdasd();
  }, [bigcProductId]);
  return (
    <div
      className="grid grid-cols-36 items-center 
place-items-center text-xs bg-white"
    >
      {bigcProductId && (
        <>
          <button
            onClick={() => fixfix(bigcProductId, handleStock, handlePrice)}
            className="col-span-2"
          >
            수정
          </button>
          <div className="col-span-3">big</div>
          <div className="col-span-3"></div>
          <div className="col-span-2"></div>
          <div className="col-span-14">{productName && productName}</div>
          <input
            type="number"
            className="col-span-2 border w-3/4 p-1 text-center"
            name="handlePrice"
            value={handlePrice}
            onChange={onChange}
          />
          <input
            type="number"
            className="col-span-2 border w-3/4 p-1 text-center"
            name="handleStock"
            value={handleStock}
            onChange={onChange}
          />
          <div className="col-span-2">{total_sold && total_sold}</div>

          <div className="col-span-2">
            {unShippedProductsIdandQty &&
              (unShippedProductsIdandQty.filter(
                doc => Object.keys(doc)[0] === bigcProductId.toString()
              )[0]
                ? Object.values(
                    unShippedProductsIdandQty.filter(
                      doc => Object.keys(doc)[0] === bigcProductId.toString()
                    )[0]
                  )
                : 0)}
          </div>

          <div className="col-span-2 text-xs">
            {relDate &&
              new Date(relDate.seconds * 1000).toISOString().substring(0, 10)}
          </div>

          <div className="col-span-2 text-xs">
            {preOrderDeadline &&
              new Date(preOrderDeadline.seconds * 1000)
                .toISOString()
                .substring(0, 10)}
          </div>
        </>
      )}
    </div>
  );
};

export default HiddenBigc;
