import React, { useContext, useEffect, useState } from "react";
import { InitDataContext, InitDispatchContext } from "../../../App";
import ListProductRow from "./ListProductRow";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import LastPageIcon from "@material-ui/icons/LastPage";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import RestockRequests from "./restockrequests/RestockRequests";
import SearchIcon from "@material-ui/icons/Search";
import RestoreIcon from "@material-ui/icons/Restore";
import TopStoreProduct from "./TopStoreProduct";

const ListProduct = () => {
  const state = useContext(InitDataContext);
  const dispatch = useContext(InitDispatchContext);
  const { products, orders, shippings, user, exchangeRate, reStockRequests } =
    state;
  const [page, setPage] = useState(0);
  const [pages] = useState([-4, -3, -2, -1, 0, 1, 2, 3, 4]);
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
  // 검색기능구현
  // 상품들
  const [preProduct, setPreProduct] = useState(products);
  // 검색어
  const [query, setQuery] = useState();
  const queryOnChange = e => {
    const { value } = e.target;
    setQuery(value);
  };
  // 검색하기

  const searchProducts = e => {
    e.preventDefault();

    setPreProduct(
      products
        .filter(
          doc =>
            doc.data.title.includes(query.split(" ")[0]) ||
            doc.data.title.includes(query.split(" ")[1]) ||
            doc.data.title.toLowerCase().includes(query.split(" ")[0]) ||
            doc.data.title.toLowerCase().includes(query.split(" ")[1]) ||
            doc.data.sku.includes(query.split(" ")[0]) ||
            doc.data.sku.includes(query.split(" ")[1]) ||
            doc.data.barcode.toLowerCase().includes(query.split(" ")[0]) ||
            doc.data.barcode.toLowerCase().includes(query.split(" ")[1])
        )
        .sort((a, b) => {
          return (
            new Date(a.data.preOrderDeadline.seconds) -
            new Date(b.data.preOrderDeadline.seconds)
          );
        })
    );
  };
  // 초기화
  const handleClear = e => {
    e.preventDefault();
    setPreProduct(products);
  };

  useEffect(() => {
    setPreProduct(products);
  }, [dispatch, products]);

  return (
    <div className="flex flex-col w-full">
      <form
        onSubmit={searchProducts}
        className="top-2 left-40 fixed z-50 flex flex-row
        "
      >
        <div className="bg-gray-200 p-1 rounded-lg w-96 flex flex-row">
          <input
            type="text"
            className=" rounded-md outline-none pl-3 w-80"
            placeholder="search"
            onChange={queryOnChange}
            value={query}
          />{" "}
          <div className="flex flex-row justify-evenly w-1/4">
            <SearchIcon
              className="cursor-pointer"
              type="submit"
              onClick={searchProducts}
            />
            <RestoreIcon onClick={handleClear} className="cursor-pointer" />
          </div>
        </div>
      </form>
      <div className="ml-28 mt-16 text-gray-800 text-xl">PRODUCT LIST</div>
      <div className="border w-11/12 m-auto mt-4 mb-12">
        <TopStoreProduct
          products={products}
          user={user}
          exchangeRate={exchangeRate}
        />
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
            {preProduct?.slice(0 + page * 20, 20 + page * 20).map(product => (
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
