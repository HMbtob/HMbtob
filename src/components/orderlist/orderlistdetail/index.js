import React, { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { db } from "../../../firebase";
import { useForm } from "react-hook-form";
import { OrderListDetailHeader } from "./OrderListDetailHeader";
import { OrderListDetailPrice } from "./OrderListDetailPrice";
import { AddOrder } from "./AddOrder";
import { ToTals } from "./ToTals";
import { CSVLink } from "react-csv";
import { OrderListPie } from "../OrderListPie";
import { ContentsToPrint } from "./ContentsToPrint";
import { toDate } from "../../../utils/shippingUtils";

export function OrderListDetail({ match, location }) {
  const { id } = match.params;
  const { state } = location;
  const today = new Date();
  const [orders, setOrders] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  // for 전체선택
  const [checkAll, setCheckAll] = useState(false);

  // for 출시상품 전체선택
  const [checkAllReled, setCheckAllReled] = useState(false);

  // 픽업상품 선택
  const [checkPickingUp, setCheckPickingUp] = useState(false);

  // checked item -> confirmed
  const confirmOrder = () => {
    const getOrders = getValues();
    const checkedItems = orders.filter(order =>
      Object.keys(getOrders)
        .reduce((a, c) => {
          if (getOrders[c] === true) {
            a.push(c);
          }
          return a;
        }, [])
        .includes(order.id)
    );
    checkedItems.map(
      async item =>
        await db
          .collection("accounts")
          .doc(id)
          .collection("order")
          .doc(item.id)
          .update({ confirmed: true })
    );
  };
  // PickUpList -> OrderList
  const cancelPickUp = () => {
    const getOrders = getValues();
    const checkedItems = orders.filter(order =>
      Object.keys(getOrders)
        .reduce((a, c) => {
          if (getOrders[c] === true) {
            a.push(c);
          }
          return a;
        }, [])
        .includes(order.id)
    );
    checkedItems.map(
      async item =>
        await db
          .collection("accounts")
          .doc(id)
          .collection("order")
          .doc(item.id)
          .update({ pickingUp: false })
    );
  };

  // for sort
  const [forSort, setForSort] = useState({
    sortBy: "title",
    order: true,
  });

  const handleSort = e => {
    try {
      setForSort({
        sortBy: e.target.id || "title",
        order: !forSort.order,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const OrderListDetailRow = React.lazy(() =>
    import("./OrderListDetailRow").then(module => ({
      default: module.OrderListDetailRow,
    }))
  );
  ////////////////////////////////////////////////////////////////////
  // 인쇄
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [pickUpLists, setPickUpLists] = useState([]);
  const printGoback = async () => {
    const asdad = getValues();
    const checkedItems = orders
      .filter(order =>
        Object.keys(asdad)
          .reduce((a, c) => {
            if (asdad[c] === true) {
              a.push(c);
            }
            return a;
          }, [])
          .includes(order.id)
      )
      .sort((a, b) => {
        return a?.title?.trim() < b?.title?.trim()
          ? -1
          : a?.title?.trim() > b?.title?.trim()
          ? 1
          : 0;
      });
    if (checkedItems.length === 0) {
      return alert("인쇄할 상품을 선택해 주세요.");
    }
    const ids = checkedItems.map(doc => doc.id);
    const pIds = [...new Set(checkedItems.map(doc => doc.data.productId))];
    setPickUpLists(
      pIds.map(id => ({
        barcode: checkedItems.find(item => item.data.productId === id).data
          .barcode,
        sku: checkedItems.find(item => item.data.productId === id).data.sku,
        title: checkedItems.find(item => item.data.productId === id).data.title,
        memo:
          checkedItems.find(item => item.data.productId === id).data.memo || "",
        quan: checkedItems
          .filter(item => item.data.productId === id)
          .reduce((a, c) => {
            return a + Number(c.data.quan);
          }, 0),
      }))
    );

    ids.map(
      async doc =>
        await db
          .collection("accounts")
          .doc(id)
          .collection("order")
          .doc(doc)
          .update({ pickingUp: true })
    );
    setTimeout(() => handlePrint(), 3000);
  };
  /////////////////////////////////////////////////////////////////////

  useEffect(() => {
    db.collection("accounts")
      .doc(id)
      .collection("order")
      .orderBy(forSort.sortBy || "title", forSort.order ? "asc" : "desc")
      .onSnapshot(snapshot =>
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })))
      );
  }, [id, forSort]);

  return (
    <form className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-11/12 flex-col mt-20">
        <div
          className="text-center text-xl bg-gray-800 py-1 
          rounded-sm font-bold text-gray-100 mb-5 w-full"
        >
          유저별 주문 확인({orders[0]?.data?.nickName})
        </div>

        <OrderListDetailHeader handleSort={handleSort} />
        {orders
          .filter(order => order.data.pickingUp !== true)
          .map((order, i) => (
            <React.Suspense key={i} fallback={<div>Loading...</div>}>
              <OrderListDetailRow
                order={order}
                register={register}
                checkAll={checkAll}
                checkAllReled={checkAllReled}
                checkPickingUp={checkPickingUp}
                setValue={setValue}
                handleSubmit={handleSubmit}
                errors={errors}
              />
            </React.Suspense>
          ))}
        <AddOrder id={id} from="order" />
        <div
          className="text-center text-lg bg-gray-800 py-1 
          rounded-sm font-bold text-gray-100 mb-5 w-full mt-10"
        >
          Picking Up List
        </div>
        <OrderListDetailHeader handleSort={handleSort} />
        {orders
          .filter(order => order.data.pickingUp === true)
          .map((order, i) => (
            <React.Suspense key={i} fallback={<div>Loading...</div>}>
              <OrderListDetailRow
                order={order}
                register={register}
                checkAll={checkAll}
                checkAllReled={checkAllReled}
                checkPickingUp={checkPickingUp}
                setValue={setValue}
                handleSubmit={handleSubmit}
                errors={errors}
              />
            </React.Suspense>
          ))}
        <AddOrder id={id} from="picking" />
        <div>
          <button
            type="button"
            onClick={() => setCheckAll(!checkAll)}
            className=" bg-blue-900 text-white py-1 px-3 rounded-sm my-3"
          >
            전체선택
          </button>
          <button
            type="button"
            onClick={() => setCheckAllReled(!checkAllReled)}
            className=" bg-blue-900 text-white py-1 px-3 rounded-sm my-3 ml-5"
          >
            출시상품선택
          </button>
          <button
            type="button"
            onClick={() => setCheckPickingUp(!checkPickingUp)}
            className=" bg-blue-900 text-white py-1 px-3 rounded-sm my-3 ml-5"
          >
            픽업선택
          </button>
          <button
            type="button"
            onClick={() => printGoback()}
            className=" bg-blue-900 text-white py-1 px-3 rounded-sm my-3 ml-5"
          >
            PickUp List
          </button>
          <button
            type="button"
            onClick={() => confirmOrder()}
            className=" bg-blue-900 text-white py-1 px-3 rounded-sm my-3 ml-5"
          >
            주문확인
          </button>
          <button
            type="button"
            onClick={() => cancelPickUp()}
            className=" bg-blue-900 text-white py-1 px-3 rounded-sm my-3 ml-5"
          >
            픽업취소
          </button>
          {/* <CSVLink /> */}
          <ToTals orders={orders} />
        </div>
        <OrderListDetailPrice
          handleSubmit={handleSubmit}
          getValues={getValues}
          orders={orders}
          account={state}
        />
      </div>
      <div hidden>
        <ContentsToPrint
          ref={componentRef}
          pickUpLists={pickUpLists}
          today={today.toLocaleString()}
          nickName={orders[0]?.data?.nickName || ""}
        />
      </div>
    </form>
  );
}
