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
      className="grid grid-cols-28 items-center 
place-items-center text-sm p-1 bg-white"
    >
      {bigcProductId && (
        <>
          <button
            onClick={() => fixfix(bigcProductId, handleStock, handlePrice)}
            className="col-span-2"
          >
            수정
          </button>
          <div className="col-span-2">big</div>
          <div></div>
          <div className="col-span-2"></div>
          <div className="col-span-9">{productName && productName}</div>
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

          <div className="col-span-2">t</div>

          {/* <div className="col-span-2 text-xs">
            {new Date(relDate.toDate()).toLocaleDateString()}
          </div>

          <div className="col-span-2 text-xs">
            {new Date(preOrderDeadline.toDate()).toLocaleDateString()}
          </div> */}
        </>
      )}
    </div>
  );
};

export default HiddenBigc;
