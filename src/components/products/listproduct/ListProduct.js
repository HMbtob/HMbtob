import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { InitDataContext, InitDispatchContext } from "../../../App";
import ListProductRow from "./ListProductRow";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import LastPageIcon from "@material-ui/icons/LastPage";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import RestockRequests from "./restockrequests/RestockRequests";
const ListProduct = () => {
  const state = useContext(InitDataContext);
  const dispatch = useContext(InitDispatchContext);
  const { products, orders, shippings, user, exchangeRate, reStockRequests } =
    state;
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState([-4, -3, -2, -1, 0, 1, 2, 3, 4]);
  // 로딩관리
  const [loading, setLoading] = useState("미발송 정보를 불러오는 중입니다.");
  // 헤더 항목
  const headers = [
    "BTN",
    "BARCODE",
    "SKU",
    "COVER",
    "TITLE",
    "PRICE",
    "STORE",
    "STOCK",
    "SOLD",
    "UNSHIPPED",
    "RELEASE",
  ];

  useEffect(() => {
    // FIXME:여기다가 미발송 건수 요청하는 함수 넣어서 랜더링 되면
    // 실행해서 디스패치로 스테이트에 넣기
    // 로딩관리

    const callLast = async () => {
      await axios
        .get(
          `https://us-central1-interasiastock.cloudfunctions.net/app/big/callOrdersByStatusId/9`
        )
        .then(r =>
          dispatch({
            type: "UNSHIPPED_PRODUCTS_ID_QTY",
            unShippedProductsIdandQty: r.data,
          })
        )
        .catch(e => console.log(e));

      setLoading("미발송 정보를 불러왔습니다.");
    };
    callLast();
  }, [dispatch]);
  return (
    <div className="flex flex-col w-full">
      <div className="ml-28 mt-16 text-gray-800 text-xl">PRODUCT LIST</div>
      <div className="ml-28 mt-2 text-gray-800 text-xs">{loading}</div>
      <div className="border w-11/12 m-auto mt-4 mb-12">
        <div className="grid grid-cols-36 text-center border-b p-1 bg-gray-100 sticky top-0 text-sm">
          {headers.map((header, index) => (
            <div
              key={index}
              className={
                header === "TITLE"
                  ? "col-span-12"
                  : header === "BARCODE" || header === "SKU"
                  ? "col-span-3"
                  : header === "BTN"
                  ? "col-span-4"
                  : "col-span-2"
              }
            >
              {header}
            </div>
          ))}
        </div>
        <div className="w-full flex flex-col items-center">
          <div className="w-full">
            {products?.slice(0 + page * 20, 20 + page * 20).map(product => (
              <ListProductRow
                key={product.id}
                id={product.id}
                sku={product.data.sku}
                thumbNail={product.data.thumbNail}
                title={product.data.title}
                price={product.data.price}
                barcode={product.data.barcode}
                stock={product.data.stock}
                totalStock={product.data.totalStock}
                totalSell={product.data.totalSell}
                unShipped={product.data.unShipped}
                relDate={product.data.relDate}
                preOrderDeadline={product.data.preOrderDeadline}
                bigcProductId={product?.data?.bigC?.id}
                product={product}
                orders={orders}
                shippings={shippings}
                user={user}
                exchangeRate={exchangeRate}
                products={products}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-row w-full items-center justify-center">
          <FirstPageIcon
            onClick={() => setPage(0)}
            className="cursor-pointer"
          />
          <ArrowLeftIcon
            className="cursor-pointer"
            onClick={() => (page === 0 ? setPage(0) : setPage(page - 1))}
          />
          {pages.map(
            (pag, i) =>
              pag + page > 0 &&
              pag + page < products?.length / 20 + 1 && (
                <div
                  key={i}
                  className={`cursor-pointer text-lg px-2 py-1 text-gray-600 ${
                    i === 5 && "font-bold"
                  }`}
                  onClick={() => setPage(page + pag - 1)}
                >
                  {pag + page}{" "}
                </div>
              )
          )}
          <ArrowRightIcon
            className="cursor-pointer"
            onClick={() =>
              page === products?.length / 20 - 1
                ? setPage(products?.length / 20 - 1)
                : setPage(page + 1)
            }
          />
          <LastPageIcon
            className="cursor-pointer"
            onClick={() => setPage(products?.length / 20 - 1)}
          />
        </div>
      </div>
      <RestockRequests reStockRequests={reStockRequests} />
    </div>
  );
};

export default ListProduct;
