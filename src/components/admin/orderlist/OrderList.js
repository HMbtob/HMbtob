import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { InitDataContext } from "../../../App";
import OrderListRow from "./OrderListRow";
import SearchIcon from "@material-ui/icons/Search";
import RestoreIcon from "@material-ui/icons/Restore";
import AddCircleOutlinedIcon from "@material-ui/icons/AddCircleOutlined";
import AssignmentIcon from "@material-ui/icons/Assignment";
import Paging from "../../b2bshop/b2bshop/mobile/Paging";

const OrderList = ({ location, match }) => {
  const state = useContext(InitDataContext);
  const { orders, shippings, accounts } = state;

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
  const [orderState, setOrderSate] = useState("");
  const handleOrderState = e => {
    const { value } = e.target;
    setOrderSate(value);
    setOrder(
      order
        .filter(doc => doc?.data?.orderState === value)
        .sort((a, b) => {
          return (
            new Date(a.data.createdAt.seconds) -
            new Date(b.data.createdAt.seconds)
          );
        })
    );
  };
  // 담당자별 sort
  const [inChargeState, setInChargeSate] = useState("");
  const handleInChargeState = e => {
    const { value } = e.target; // 담당자 메일
    // account 에서 선택된 담당자 메일로 필터
    // 필터된 메일들이
    setInChargeSate(value);
    setOrder(
      order
        .filter(doc =>
          accounts
            .filter(account => account.data.inCharge === value)
            .map(account => account.data.email)
            .includes(doc.data.customer)
        )
        .sort((a, b) => {
          return (
            new Date(a.data.createdAt.seconds) -
            new Date(b.data.createdAt.seconds)
          );
        })
    );
  };

  // 검색어
  const [query, setQuery] = useState();
  const queryOnChange = e => {
    const { value } = e.target;
    setQuery(value);
  };
  // 검색하기 orderNumber, customer
  const searchProduct = e => {
    e.preventDefault();

    setOrder(
      orders
        .filter(
          doc =>
            doc.data.orderNumber.toLowerCase().includes(query.split(" ")[0]) ||
            doc.data.orderNumber.toLowerCase().includes(query.split(" ")[1]) ||
            doc.data.customer.toLowerCase().includes(query.split(" ")[0]) ||
            doc.data.customer.toLowerCase().includes(query.split(" ")[1]) ||
            doc.data.customer.toUpperCase().includes(query.split(" ")[0]) ||
            doc.data.customer.toUpperCase().includes(query.split(" ")[1]) ||
            doc?.data?.nickName?.toLowerCase().includes(query.split(" ")[0]) ||
            doc?.data?.nickName?.toLowerCase().includes(query.split(" ")[1]) ||
            doc?.data?.nickName?.toUpperCase().includes(query.split(" ")[0]) ||
            doc?.data?.nickName?.toUpperCase().includes(query.split(" ")[1])
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
        orders.sort((a, b) => {
          if (a.data.customer < b.data.customer) return 1;
          if (a.data.customer > b.data.customer) return -1;
          if (a.data.customer === b.data.customer) return 0;
        })
      );
      handleSortDefault(true);
    } else if (sortDefault === true) {
      setOrder(
        orders.sort((a, b) => {
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
        orders.sort((a, b) => {
          return (
            new Date(a.data.createdAt.seconds) -
            new Date(b.data.createdAt.seconds)
          );
        })
      );
      handleSortDefault(true);
    } else if (sortDefault === true) {
      setOrder(
        orders.sort((a, b) => {
          return (
            new Date(b.data.createdAt.seconds) -
            new Date(a.data.createdAt.seconds)
          );
        })
      );
      handleSortDefault(false);
    }
  };

  // 초기화 ;버튼
  const handleClear = e => {
    e.preventDefault();
    setOrderSate("");
    setInChargeSate("");
    setOrder(orders);
  };

  // 페이징
  const [page, setPage] = useState(1);
  const count = order?.length;
  const handlePageChange = page => {
    setPage(page);
  };

  // 페이지당 항목수
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const handleItemsPerPage = e => {
    const { value } = e.target;
    setItemsPerPage(Number(value));
  };

  useEffect(() => {
    setOrder(location.state ? location?.state?.includedProducts : orders);
  }, [location]);
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
              value={query}
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
          <div>No.</div>
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
          {/* <div>STATUS</div> */}
          <select
            value={orderState}
            onChange={handleOrderState}
            className="bg-transparent text-center outline-none"
          >
            <option>STATUS</option>
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
            <option>In Charge</option>
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
              .slice(page * itemsPerPage - itemsPerPage, page * itemsPerPage)
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
          page={page}
          count={count}
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
        />{" "}
      </div>
    </div>
  );
};

export default OrderList;
