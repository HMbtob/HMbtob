import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { InitDataContext, InitDispatchContext } from "../../../App";
import OrderListRow from "./OrderListRow";
import SearchIcon from "@material-ui/icons/Search";
import RestoreIcon from "@material-ui/icons/Restore";
import AddCircleOutlinedIcon from "@material-ui/icons/AddCircleOutlined";
import AssignmentIcon from "@material-ui/icons/Assignment";
import Paging from "../../b2bshop/b2bshop/mobile/Paging";
import { SearchOrder } from "../../../utils/SearchUtils";

const OrderList = ({ location, history }) => {
  const state = useContext(InitDataContext);
  const dispatch = useContext(InitDispatchContext);
  const {
    orders,
    shippings,
    accounts,
    orderState,
    inChargeState,
    currentPage,
    searchQuery,
  } = state;
  console.log(SearchOrder(orders, searchQuery));
  // 뒤로가기시 페이지 유지
  // 체크된 상품 전체
  const [checkedAllItems, setCheckedAllItems] = useState([]);

  // 전체 펼치기
  const [hiddenAll, setHiddenAll] = useState(true);
  const handelHiddenAll = hiddenAll => {
    if (hiddenAll === true) {
      setHiddenAll(false);
    } else if (hiddenAll === false) {
      setHiddenAll(true);
    }
  };

  // 주문들
  const [order, setOrder] = useState([]);

  // sort default
  const [sortDefault, setSortDefault] = useState(true);
  const handleSortDefault = () => {
    if (sortDefault === true) {
      setSortDefault(false);
    } else if (sortDefault === false) {
      setSortDefault(true);
    }
  };

  // 주문상태별 sort

  const setOrderByFilter = () => {
    setOrder(
      orders
        .filter(doc =>
          inChargeState.length === 0 && orderState.length === 0
            ? doc
            : inChargeState.length !== 0 && orderState.length === 0
            ? accounts
                .filter(account => account.data.inCharge === inChargeState)
                .map(account => account.data.email)
                .includes(doc.data.customer)
            : inChargeState.length === 0 && orderState.length !== 0
            ? doc?.data?.orderState === orderState
            : inChargeState.length !== 0 && orderState.length !== 0
            ? accounts
                .filter(account => account.data.inCharge === inChargeState)
                .map(account => account.data.email)
                .includes(doc.data.customer) &&
              doc?.data?.orderState === orderState
            : doc
        )
        .filter(
          doc =>
            doc.data.orderNumber
              .toLowerCase()
              .includes(searchQuery.split(" ")[0]) ||
            doc.data.orderNumber
              .toLowerCase()
              .includes(searchQuery.split(" ")[1]) ||
            doc.data.customer
              .toLowerCase()
              .includes(searchQuery.split(" ")[0]) ||
            doc.data.customer
              .toLowerCase()
              .includes(searchQuery.split(" ")[1]) ||
            doc.data.customer
              .toUpperCase()
              .includes(searchQuery.split(" ")[0]) ||
            doc.data.customer
              .toUpperCase()
              .includes(searchQuery.split(" ")[1]) ||
            doc?.data?.nickName
              ?.toLowerCase()
              .includes(searchQuery.split(" ")[0]) ||
            doc?.data?.nickName
              ?.toLowerCase()
              .includes(searchQuery.split(" ")[1]) ||
            doc?.data?.nickName
              ?.toUpperCase()
              .includes(searchQuery.split(" ")[0]) ||
            doc?.data?.nickName
              ?.toUpperCase()
              .includes(searchQuery.split(" ")[1])
        )
        .sort((a, b) => {
          return (
            new Date(b.data.createdAt.seconds) -
            new Date(a.data.createdAt.seconds)
          );
        })
    );
  };
  const handleOrderState = e => {
    const { value } = e.target;
    dispatch({ type: "ORDER_STATE", orderState: value });
  };
  // 담당자별 sort
  const handleInChargeState = e => {
    const { value } = e.target;
    dispatch({ type: "INCHARGESTATE", inChargeState: value });
  };

  // 검색어
  const queryOnChange = e => {
    const { value } = e.target;
    dispatch({ type: "SEARCH_QUERY", searchQuery: value });
  };

  // 검색하기 orderNumber, customer
  const searchProduct = e => {
    if (e) {
      e.preventDefault();
    }
    setOrder(
      orders
        .filter(
          doc =>
            doc.data.orderNumber
              .toLowerCase()
              .includes(searchQuery.split(" ")[0]) ||
            doc.data.orderNumber
              .toLowerCase()
              .includes(searchQuery.split(" ")[1]) ||
            doc.data.customer
              .toLowerCase()
              .includes(searchQuery.split(" ")[0]) ||
            doc.data.customer
              .toLowerCase()
              .includes(searchQuery.split(" ")[1]) ||
            doc.data.customer
              .toUpperCase()
              .includes(searchQuery.split(" ")[0]) ||
            doc.data.customer
              .toUpperCase()
              .includes(searchQuery.split(" ")[1]) ||
            doc?.data?.nickName
              ?.toLowerCase()
              .includes(searchQuery.split(" ")[0]) ||
            doc?.data?.nickName
              ?.toLowerCase()
              .includes(searchQuery.split(" ")[1]) ||
            doc?.data?.nickName
              ?.toUpperCase()
              .includes(searchQuery.split(" ")[0]) ||
            doc?.data?.nickName
              ?.toUpperCase()
              .includes(searchQuery.split(" ")[1])
        )
        .filter(doc =>
          inChargeState.length === 0 && orderState.length === 0
            ? doc
            : inChargeState.length !== 0 && orderState.length === 0
            ? accounts
                .filter(account => account.data.inCharge === inChargeState)
                .map(account => account.data.email)
                .includes(doc.data.customer)
            : inChargeState.length === 0 && orderState.length !== 0
            ? doc?.data?.orderState === orderState
            : inChargeState.length !== 0 && orderState.length !== 0
            ? accounts
                .filter(account => account.data.inCharge === inChargeState)
                .map(account => account.data.email)
                .includes(doc.data.customer) &&
              doc?.data?.orderState === orderState
            : doc
        )
        .sort((a, b) => {
          return (
            new Date(b.data.createdAt.seconds) -
            new Date(a.data.createdAt.seconds)
          );
        })
    );
  };

  // 주문자정렬
  const sortProductByCustomer = e => {
    e.preventDefault();
    if (sortDefault === false) {
      setOrder(
        order.sort((a, b) => {
          if (a.data.customer < b.data.customer) return 1;
          if (a.data.customer > b.data.customer) return -1;
          if (a.data.customer === b.data.customer) return 0;
        })
      );
      handleSortDefault(true);
    } else if (sortDefault === true) {
      setOrder(
        order.sort((a, b) => {
          if (a.data.customer < b.data.customer) return -1;
          if (a.data.customer > b.data.customer) return 1;
          if (a.data.customer === b.data.customer) return 0;
        })
      );
      handleSortDefault(false);
    }
  };
  // 시간정렬
  const sortProductByDate = e => {
    e.preventDefault();
    if (sortDefault === false) {
      setOrder(
        order.sort((a, b) => {
          return (
            new Date(a.data.createdAt.seconds) -
            new Date(b.data.createdAt.seconds)
          );
        })
      );
      handleSortDefault(true);
    } else if (sortDefault === true) {
      setOrder(
        order.sort((a, b) => {
          return (
            new Date(b.data.createdAt.seconds) -
            new Date(a.data.createdAt.seconds)
          );
        })
      );
      handleSortDefault(false);
    }
  };

  // 페이징
  const count = order?.length;
  const handlePageChange = page => {
    dispatch({ type: "CURRENT_PAGE", currentPage: page });
  };

  // 페이지당 항목수
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const handleItemsPerPage = e => {
    const { value } = e.target;
    setItemsPerPage(Number(value));
  };

  // 초기화 ;버튼
  const handleClear = e => {
    if (e) {
      e.preventDefault();
    }
    dispatch({ type: "ORDER_STATE", orderState: "" });
    dispatch({ type: "INCHARGESTATE", inChargeState: "" });
    dispatch({ type: "CURRENT_PAGE", currentPage: 1 });
    dispatch({ type: "SEARCH_QUERY", searchQuery: "" });
    setOrder(
      orders.sort((a, b) => {
        return (
          new Date(b.data.createdAt.seconds) -
          new Date(a.data.createdAt.seconds)
        );
      })
    );
  };

  useEffect(() => {
    if (history.action === "POP") {
      searchProduct();
      setOrderByFilter();
    } else if (history.action === "PUSH") {
      if (location.state) {
        setOrder(location.state.includedProducts);
      } else if (orderState || inChargeState) {
        setOrderByFilter();
      } else {
        handleClear();
      }
    }
  }, [history.action, orderState, inChargeState]);

  return (
    <div className="w-full h-full flex justify-center">
      <div className=" w-11/12 flex-col mt-20">
        <form
          onSubmit={searchProduct}
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
                onClick={searchProduct}
              />
              <RestoreIcon onClick={handleClear} className="cursor-pointer" />
            </div>
          </div>
        </form>
        <div className="w-full text-center my-4 text-gray-800 text-lg">
          ORDERS
        </div>
        <div className="w-full flex justify-end text-sm">
          <select
            className="bg-transparent"
            value={itemsPerPage}
            onChange={handleItemsPerPage}
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          개씩 보기
        </div>
        {/* <button>주문확인</button> */}
        <div
          className="grid grid-cols-12  grid-flow-col text-center 
           bg-gray-800 text-gray-100 py-1 rounded-sm text-sm items-center"
        >
          <div className="flex flex-row justify-around">
            <AddCircleOutlinedIcon
              style={{ marginLeft: "11" }}
              className="cursor-pointer"
              onClick={() => handelHiddenAll(hiddenAll)}
            />
            <Link
              to={{
                pathname: "/pickuplist",
                state: checkedAllItems,
                orders,
              }}
            >
              <AssignmentIcon />
            </Link>
          </div>
          <div onClick={setOrderByFilter}>No.</div>
          <div
            className="col-span-2 cursor-pointer"
            onClick={sortProductByDate}
          >
            Date
          </div>
          <div
            className="col-span-2 cursor-pointer"
            onClick={sortProductByCustomer}
          >
            CUSTOMER
          </div>
          <select
            value={orderState}
            onChange={handleOrderState}
            className="bg-transparent text-center outline-none"
          >
            <option value="">STATUS</option>
            <option value="Order">Order</option>
            <option value="Pre-Order">Pre Order</option>
            <option value="Special-Order">Special Order</option>
            <option value="Confirmed-Order">Confirmed Order</option>
            <option value="Ready-to-ship">Ready to ship</option>
            <option value="Patially-shipped">Patially shipped</option>
            <option value="Shipped">Shipped</option>
          </select>
          <div>PRICE</div>
          <div>AMOUNT</div>
          <div>SORTS</div>
          <div>EA</div>
          <select
            value={inChargeState}
            onChange={handleInChargeState}
            className="bg-transparent text-center outline-none"
          >
            <option value="">In Charge</option>
            {accounts
              .filter(account => account.data.type === "admin")
              .map((acc, i) => (
                <option key={i} value={acc.data.email}>
                  {acc.data.nickName}
                </option>
              ))}
          </select>
        </div>
        <div>
          {order &&
            order
              .slice(
                currentPage * itemsPerPage - itemsPerPage,
                currentPage * itemsPerPage
              )
              .map(order => (
                <OrderListRow
                  key={order.id}
                  id={order.id}
                  orderNumber={order.data.orderNumber}
                  createdAt={order.data.createdAt}
                  customer={order.data.customer}
                  nickName={order?.data?.nickName}
                  orderState={order.data.orderState}
                  order={order}
                  orders={orders}
                  setCheckedAllItems={setCheckedAllItems}
                  checkedAllItems={checkedAllItems}
                  hiddenAll={hiddenAll}
                  handelHiddenAll={handelHiddenAll}
                  shippings={shippings}
                  accounts={accounts}
                />
              ))}
        </div>
        <Paging
          page={currentPage}
          count={count}
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
        />{" "}
      </div>
    </div>
  );
};

export default OrderList;
