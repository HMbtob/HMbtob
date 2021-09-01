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

  // 주문들
  const [order, setOrder] = useState(orders);

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

  // 초기화 버튼
  const handleClear = e => {
    e.preventDefault();
    setOrder(orders);
  };
  return (
    <div className="w-full h-full flex justify-center">
      <div className=" w-11/12 flex-col mt-20">
        <form
          onSubmit={searchProduct}
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
            <AddCircleOutlinedIcon style={{ marginLeft: "11" }} />
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
          <div className="col-span-2">Date</div>
          <div className="col-span-2">CUSTOMER</div>
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
              />
            ))}
        </div>
      </div>
    </div>
  );
};
export default OrderList;
