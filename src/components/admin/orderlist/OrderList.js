import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { InitDataContext } from "../../../App";
import OrderListRow from "./OrderListRow";
import SearchIcon from "@material-ui/icons/Search";
import RestoreIcon from "@material-ui/icons/Restore";
import AddCircleOutlinedIcon from "@material-ui/icons/AddCircleOutlined";
import AssignmentIcon from "@material-ui/icons/Assignment";

const OrderList = () => {
  const state = useContext(InitDataContext);
  const { orders } = state;

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
  const [order, setOrder] = useState(orders);

  // sort default
  const [sortDefault, setSortDefault] = useState(true);
  const handleSortDefault = () => {
    if (sortDefault === true) {
      setSortDefault(false);
    } else if (sortDefault === false) {
      setSortDefault(true);
    }
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
            doc.data.customer.toLowerCase().includes(query.split(" ")[1])
        )
        .sort((a, b) => {
          return (
            new Date(a.data.createdAt.seconds) -
            new Date(b.data.createdAt.seconds)
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
    setOrder(orders);
  };
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
        {/* <button>주문확인</button> */}
        <div
          className="grid grid-cols-12  grid-flow-col text-center 
           bg-gray-800 text-gray-100 py-1 rounded-sm text-sm"
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
          <div>STATUS</div>
          <div>PRICE</div>
          <div>AMOUNT</div>
          <div>SORTS</div>
          <div>EA</div>
          <div>WEIGHT</div>
        </div>

        <div>
          {order &&
            order.map(order => (
              <OrderListRow
                key={order.id}
                id={order.id}
                orderNumber={order.data.orderNumber}
                createdAt={order.data.createdAt}
                customer={order.data.customer}
                orderState={order.data.orderState}
                order={order}
                orders={orders}
                setCheckedAllItems={setCheckedAllItems}
                checkedAllItems={checkedAllItems}
                hiddenAll={hiddenAll}
                handelHiddenAll={handelHiddenAll}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
export default OrderList;
