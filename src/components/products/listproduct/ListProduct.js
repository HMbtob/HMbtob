import React, { useCallback, useContext, useEffect, useState } from "react";
import { InitDataContext, InitDispatchContext } from "../../../App";
import ListProductRow from "./ListProductRow";
import Paging from "../../b2bshop/b2bshop/mobile/Paging";
import RestockRequests from "./restockrequests/RestockRequests";
import SearchIcon from "@material-ui/icons/Search";
import RestoreIcon from "@material-ui/icons/Restore";
import TopStoreProduct from "./TopStoreProduct";
import { SearchProduct } from "../../../utils/SearchUtils";
import AddCircleOutlinedIcon from "@material-ui/icons/AddCircleOutlined";
import { db } from "../../../firebase";

const ListProduct = ({ history }) => {
  const state = useContext(InitDataContext);
  const dispatch = useContext(InitDispatchContext);
  const {
    products,
    orders,
    shippings,
    user,
    exchangeRate,
    reStockRequests,
    searchQuery,
    currentPage,
  } = state;
  // 페이지당 항목수
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const handleItemsPerPage = e => {
    const { value } = e.target;
    setItemsPerPage(Number(value));
  };
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
    "UNSHIP",
    "WEIGHT",
  ];

  // 검색기능구현
  // 상품들
  const [preProduct, setPreProduct] = useState(
    products.sort((a, b) => {
      return (
        new Date(b.data.relDate.seconds) - new Date(a.data.relDate.seconds)
      );
    })
  );
  // 페이징
  const count = preProduct?.length;
  const handlePageChange = page => {
    dispatch({ type: "CURRENT_PAGE", currentPage: page });
  };
  // 검색어
  const queryOnChange = e => {
    const { value } = e.target;
    dispatch({ type: "SEARCH_QUERY", searchQuery: value });
  };

  // 검색하기
  const searchProducts = useCallback(
    e => {
      if (e) {
        e.preventDefault();
      }
      setPreProduct(SearchProduct(products, searchQuery));
    },
    [products, searchQuery]
  );

  // 초기화
  const handleClear = useCallback(
    e => {
      if (e) {
        e.preventDefault();
      }
      dispatch({ type: "ORDER_STATE", orderState: "" });
      dispatch({ type: "INCHARGESTATE", inChargeState: "" });
      dispatch({ type: "CURRENT_PAGE", currentPage: 1 });
      dispatch({ type: "SEARCH_QUERY", searchQuery: "" });
      setPreProduct(
        products.sort((a, b) => {
          return new Date(b.data.createdAt) - new Date(a.data.createdAt);
        })
      );
    },
    [products]
  );

  // 전체 펼치기
  const [hiddenAll, setHiddenAll] = useState(true);
  const handelHiddenAll = () => {
    setHiddenAll(!hiddenAll);
  };

  // orderListInShippings

  const [orderListInShippings, setOrderListInShippings] = useState([]);
  useEffect(() => {
    db.collectionGroup("orderListInShippings").onSnapshot(snapshot =>
      setOrderListInShippings(
        snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }))
      )
    );
  }, []);

  useEffect(() => {
    if (history.action === "POP") {
      searchProducts();
    } else if (history.action === "PUSH") {
      handleClear();
    }
  }, [history.action]);

  return (
    <div className="flex flex-col w-full">
      <form
        onSubmit={e => searchProducts(e)}
        className="top-2 left-40 absolute z-50 flex flex-row
        "
      >
        <div className="bg-gray-200 p-1 rounded-lg w-96 flex flex-row">
          <input
            type="text"
            className=" rounded-md outline-none pl-3 w-80"
            placeholder="search"
            onChange={queryOnChange}
            value={searchQuery}
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
      <div className="border border-gray-500 w-11/12 m-auto mt-4 mb-12">
        <TopStoreProduct
          products={products}
          user={user}
          exchangeRate={exchangeRate}
        />
        <div className="w-full bg-gray-100 flex justify-end">
          <select value={itemsPerPage} onChange={handleItemsPerPage}>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          개씩 보기
        </div>
        <div
          className="grid grid-cols-36 text-center border-b border-gray-500 p-1 
        bg-gray-100  top-0 text-sm"
        >
          {headers.map((header, index) => (
            <div
              key={index}
              className={
                header === "TITLE"
                  ? "col-span-9"
                  : header === "BARCODE" || header === "SKU"
                  ? "col-span-3"
                  : header === "BTN"
                  ? "col-span-4"
                  : header === "SOLD" || header === "UNSHIP"
                  ? "col-span-1"
                  : header === "PRICE"
                  ? "col-span-3"
                  : "col-span-2"
              }
            >
              {header}
              {header === "BTN" && (
                <AddCircleOutlinedIcon
                  className="ml-5"
                  style={{ color: "gray" }}
                  onClick={handelHiddenAll}
                />
              )}
            </div>
          ))}
          <div
            className="col-span-4"
            // onClick={sortProductByDate}
          >
            RELEASE
          </div>
        </div>
        <div className="w-full flex flex-col items-center">
          <div className="w-full">
            {preProduct
              ?.slice(
                currentPage * itemsPerPage - itemsPerPage,
                currentPage * itemsPerPage
              )
              .map(product => (
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
                  weight={product.data.weight}
                  isVisible={product.data.isVisible}
                  preOrderDeadline={product.data.preOrderDeadline}
                  bigcProductId={product?.data?.bigC?.id}
                  product={product}
                  orders={orders}
                  shippings={shippings}
                  user={user}
                  exchangeRate={exchangeRate}
                  products={products}
                  hiddenAll={hiddenAll}
                  orderListInShippings={orderListInShippings}
                />
              ))}
          </div>
        </div>
        <div className="flex flex-row w-full items-center justify-center">
          <Paging
            page={currentPage}
            count={count}
            handlePageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>
      <RestockRequests reStockRequests={reStockRequests} />
    </div>
  );
};

export default ListProduct;
