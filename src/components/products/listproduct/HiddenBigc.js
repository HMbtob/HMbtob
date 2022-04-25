import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { InitDataContext } from "../../../App";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import VisibilityIcon from "@material-ui/icons/Visibility";
// import SyncAltIcon from "@material-ui/icons/SyncAlt";
// import Modal from "../../modal/Modal";
// import StockTable from "./StockTable";
// import { db } from "../../../firebase";

const HiddenBigc = ({
  relDate,
  bigcProductId,
  handleBigTotalSold,
  option,
  optioned,
  // totalStock,
  // bigTotalSold,
  // id,
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

  const { isVisible, handlePrice, handleStock, total_sold, productName } =
    product;

  const onChange = (e) => {
    const { name, value } = e.target;

    setProduct({
      ...product,
      [name]: value,
    });
  };

  const fixfix = async (id, qty, price) => {
    // console.log(option);
    if (optioned) {
      await axios
        .get(
          `https://us-central1-interasiastock.cloudfunctions.net/app/big/fixproductinventoryprice/${id}/${option.id}/${qty}/${price}`
        )
        .then((res) => console.log(res))
        .catch((e) => console.log(e));
      alert("수정되었습니다.");
      return;
    }
    await axios
      .get(
        `https://us-central1-interasiastock.cloudfunctions.net/app/big/fixproductinventoryprice/${id}/${qty}/${price}`
      )
      .then(() => alert("수정되었습니다."))
      .catch((e) => console.log(e));
  };

  const sdadasdasd = useCallback(async () => {
    await axios
      .get(
        `https://us-central1-interasiastock.cloudfunctions.net/app/big/getproductinfo/${bigcProductId}`
      )
      .then((p) =>
        setProduct({
          handlePrice: optioned
            ? Number(option.price)
            : Number(p.data.data.price),
          handleStock: optioned
            ? Number(option.inventory_level)
            : Number(p.data.data.inventory_level),
          total_sold: Number(p.data.data.total_sold),
          productName: optioned ? option.sku : p.data.data.name,
          isVisible: p.data.data.is_visible,
        })
      )
      .catch((e) => console.log(e));
  }, [bigcProductId, optioned, option]);

  // // 재고수불부 모달
  // const [forHidden, setForHidden] = useState(true);

  // const handleHidden = (forHidden) => {
  //   if (forHidden === true) {
  //     setForHidden(false);
  //   } else if (forHidden === false) {
  //     setForHidden(true);
  //   }
  // };
  // const [modalOpen, setModalOpen] = useState(false);
  // const openModal = () => {
  //   if (forHidden) {
  //     handleHidden(forHidden);
  //   }
  //   setModalOpen(true);
  // };
  // const closeModal = () => {
  //   setModalOpen(false);
  // };

  // const [stockHistory, setStockHistory] = useState(null);

  useEffect(() => {
    sdadasdasd();
    handleBigTotalSold(total_sold);
  }, [total_sold, bigcProductId, handleBigTotalSold, sdadasdasd]);
  return (
    <div
      className="grid grid-cols-36 items-center 
place-items-center text-xs bg-transparent border-t"
    >
      {bigcProductId && (
        <>
          {/* <button
            onClick={() => fixfix(bigcProductId, handleStock, handlePrice)}
            className="col-span-2"
          >
            big-수정
          </button> */}
          <div className="col-span-5 flex flex-row justify-start w-full">
            {isVisible === true ? (
              <VisibilityIcon
                className="cursor-pointer"
                fontSize="small"
                style={{ color: "blue" }}
                onClick={async () =>
                  await axios
                    .get(
                      `https://us-central1-interasiastock.cloudfunctions.net/app/big/visible/${bigcProductId}/false`,

                      {
                        headers: {
                          accept: "application/json",
                          "content-type": "application/json",
                          "x-auth-token": "23t2vx6zwiq32xa8b0uspfo7mb7181x",
                        },
                      }
                    )
                    .then(() => sdadasdasd())
                    .catch((e) => console.log(e))
                }
              />
            ) : isVisible === false ? (
              <VisibilityOffIcon
                className="cursor-pointer"
                fontSize="small"
                style={{ color: "red" }}
                onClick={async () =>
                  await axios
                    .get(
                      `https://us-central1-interasiastock.cloudfunctions.net/app/big/visible/${bigcProductId}/true`,

                      {
                        headers: {
                          accept: "application/json",
                          "content-type": "application/json",
                          "x-auth-token": "23t2vx6zwiq32xa8b0uspfo7mb7181x",
                        },
                      }
                    )
                    .then(() => sdadasdasd())
                    .catch((e) => console.log(e))
                }
              />
            ) : (
              ""
            )}
          </div>
          <div className="col-span-3">
            {/* 재고수불부 아이콘
            <button onClick={openModal}>
              <SyncAltIcon fontSize="small" style={{ color: "gray" }} />
            </button>
            <Modal open={modalOpen} close={closeModal} header={"재고수불부"}>
              <StockTable
                product={product}
                stockHistory={product?.data?.stockHistory}
                bigTotalSold={bigTotalSold}
                totalStock={totalStock}
                id={id}
              />
            </Modal> */}
          </div>
          <div className="col-span-2"></div>
          <div className="col-span-9 w-full">
            {productName && (
              <input
                className="w-full p-1 bg-transparent"
                type="text"
                name="productName"
                value={productName}
                onChange={onChange}
                onKeyPress={async (e) => {
                  if (e.key === "Enter") {
                    await axios
                      .post(
                        `https://us-central1-interasiastock.cloudfunctions.net/app/big/fixproducttitle`,
                        {
                          id: bigcProductId,
                          name: productName,
                        }
                      )
                      .then((res) => {
                        // console.log(res);
                        alert("수정되었습니다.");
                      })
                      .catch((e) => {
                        console.log(e);
                        alert("실패했습니다.");
                      });
                  }
                }}
              />
            )}
          </div>
          <div className="col-span-3  flex flex-row items-center justify-center">
            <div>USD</div>
            <input
              type="number"
              className="col-span-2 border w-3/4 p-1 text-center"
              name="handlePrice"
              value={handlePrice}
              onChange={(e) => onChange(e)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  fixfix(bigcProductId, handleStock, handlePrice);
                }
              }}
            />
          </div>

          <div className="col-span-2"></div>
          <input
            type="number"
            className="col-span-2 border w-3/4 p-1 text-center"
            name="handleStock"
            value={handleStock}
            onChange={(e) => onChange(e)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                fixfix(bigcProductId, handleStock, handlePrice);
              }
            }}
          />
          <div className="col-span-1">{total_sold && total_sold}</div>

          <div className="col-span-1">
            {unShippedProductsIdandQty &&
              (unShippedProductsIdandQty.filter(
                (doc) => Object.keys(doc)[0] === bigcProductId.toString()
              )[0]
                ? Object.values(
                    unShippedProductsIdandQty.filter(
                      (doc) => Object.keys(doc)[0] === bigcProductId.toString()
                    )[0]
                  )
                : 0)}
          </div>
          <div className="col-span-2"></div>

          <div className="col-span-4 text-xs">
            {relDate &&
              new Date(relDate.seconds * 1000).toISOString().substring(0, 10)}
          </div>
        </>
      )}
    </div>
  );
};

export default HiddenBigc;
