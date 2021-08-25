import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import { InitDataContext } from "../../../App";
import OrderListRow from "./OrderListRow";
import SearchIcon from "@material-ui/icons/Search";
import RestoreIcon from "@material-ui/icons/Restore";
import AddCircleOutlinedIcon from "@material-ui/icons/AddCircleOutlined";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const OrderList = () => {
  const state = useContext(InitDataContext);
  const { orders, user } = state;
  // pdf
  // Create styles
  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      backgroundColor: "#E4E4E4",
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
  });

  // Create Document Component
  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Section #1</Text>
        </View>
        <View style={styles.section}>
          <Text>Section #2</Text>
        </View>
      </Page>
    </Document>
  );

  const [checkedAllItems, setCheckedAllItems] = useState([]);

  // const handleCheckedAllItems = (checked, id) => {
  //   if (checked) {
  //     setCheckedAllItems([...checkedAllItems, id]);
  //     console.log(checkedAllItems);
  //   } else {
  //     // 체크 해제
  //     setCheckedAllItems(checkedAllItems.filter(el => el !== id));
  //     console.log(checkedAllItems);
  //   }
  // };
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
            <AssignmentIcon onClick={() => console.log(checkedAllItems)} />
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
                setCheckedAllItems={setCheckedAllItems}
                checkedAllItems={checkedAllItems}
              />
            ))}
        </div>
      </div>
      {/* 디테일 페이지 만들어서 인보이스 발행기능, 수량 수정가능하게, 목록 삭제도 가능하게 삭제나 수정했을때 기존인보이스에 취소선? 주문에 list를 orderlist 랑 confirmlist 로 분화? */}
    </div>
  );
};
export default OrderList;
