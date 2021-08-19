import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { InitDataContext } from "../../../App";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

import VisibilityIcon from "@material-ui/icons/Visibility";

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
  handleBigTotalSold,
}) => {
  const state = useContext(InitDataContext);
  const { unShippedProductsIdandQty } = state;
  const [product, setProduct] = useState({
    handlePrice: "",
    handleStock: "",
    total_sold: "",
    productName: "",
    isVisible: "",
  });

  const { isVisible } = product;
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
          isVisible: p.data.data.is_visible,
        })
      )
      .catch(e => console.log(e));
  };
  useEffect(() => {
    sdadasdasd();
    handleBigTotalSold(total_sold);
  }, [bigcProductId, total_sold]);
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
            big-수정
          </button>
          <div className="col-span-5 flex flex-row justify-start w-full">
            {isVisible === true ? (
              <VisibilityIcon
                className="cursor-pointer"
                fontSize="small"
                style={{ color: "blue" }}
                onClick={async () =>
                  await axios
                    .put(
                      `/stores/7uw7zc08qw/v3/catalog/products/${bigcProductId}`,

                      { is_visible: false },
                      {
                        headers: {
                          accept: "application/json",
                          "content-type": "application/json",
                          "x-auth-token": "23t2vx6zwiq32xa8b0uspfo7mb7181x",
                        },
                      }
                    )
                    .then(() => sdadasdasd())
                    .catch(e => console.log(e))
                }
              />
            ) : isVisible === false ? (
              <VisibilityOffIcon
                className="cursor-pointer"
                fontSize="small"
                style={{ color: "red" }}
                onClick={async () =>
                  await axios
                    .put(
                      `/stores/7uw7zc08qw/v3/catalog/products/${bigcProductId}`,

                      { is_visible: true },
                      {
                        headers: {
                          accept: "application/json",
                          "content-type": "application/json",
                          "x-auth-token": "23t2vx6zwiq32xa8b0uspfo7mb7181x",
                        },
                      }
                    )
                    .then(() => sdadasdasd())
                    .catch(e => console.log(e))
                }
              />
            ) : (
              ""
            )}
          </div>
          <div className="col-span-3"></div>
          <div className="col-span-2"></div>
          <div className="col-span-12 w-full">{productName && productName}</div>
          <input
            type="number"
            className="col-span-2 border w-3/4 p-1 text-center"
            name="handlePrice"
            value={handlePrice}
            onChange={onChange}
          />
          <div className="col-span-2"></div>
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
        </>
      )}
    </div>
  );
};

export default HiddenBigc;
