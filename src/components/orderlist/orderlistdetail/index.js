import React, { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { db } from "../../../firebase";
import { useForm } from "react-hook-form";
import { OrderListDetailHeader } from "./OrderListDetailHeader";
import { OrderListDetailPrice } from "./OrderListDetailPrice";
import { AddOrder } from "./AddOrder";
import { ToTals } from "./ToTals";
import { CSVLink } from "react-csv";
import { ContentsToPrint } from "./ContentsToPrint";
import { Credit } from "./credit";
import { ShippingListsHeader } from "../../shippinglist/ShippingListsHeader";
import { Addresses } from "./Addresses";

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

  const ShippingListsRow = React.lazy(() =>
    import("../../shippinglist/ShippingListsRow").then(module => ({
      default: module.ShippingListsRow,
    }))
  );

  ////////////////////////////////////////////////////////////////////
  // For shippings
  const OrderListDetailRow = React.lazy(() =>
    import("./OrderListDetailRow").then(module => ({
      default: module.OrderListDetailRow,
    }))
  );
  const [shippings, setShippings] = useState([]);
  const [hiddenAll, setHiddenAll] = useState(true);
  const handelHiddenAll = () => {
    setHiddenAll(!hiddenAll);
  };

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
  // shipping addresses
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [type, setType] = useState("Default Address");
  const [add, setAdd] = useState(null);

  useEffect(() => {
    const unsub1 = db
      .collection("accounts")
      .doc(id)
      .collection("addresses")
      .orderBy("name", "asc")
      .onSnapshot(snapshot =>
        setShippingAddresses(
          snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }))
        )
      );
    return () => unsub1();
  }, [id]);

  useEffect(() => {
    setAdd(shippingAddresses.find(li => li.data.name === type));
  }, [shippingAddresses, type]);

  useEffect(() => {
    db.collection("accounts")
      .doc(id)
      .collection("order")
      .orderBy(forSort.sortBy || "title", forSort.order ? "asc" : "desc")
      .get()
      .then(snapshot =>
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })))
      );

    db.collection("accounts")
      .doc(id)
      .collection("shippingsInAccount")
      .get()
      .then(snapshot =>
        setShippings(
          snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }))
        )
      );
  }, [id, forSort]);

  return (
    <form className="w-full h-full flex flex-col justify-center items-center mb-20">
      <div className="w-11/12 flex-col mt-20">
        {/* 크레딧 */}
        <div
          className="text-center text-xl bg-gray-800 py-1 
          rounded-sm font-bold text-gray-100 mb-5 w-full"
        >
          Credit ({orders[0]?.data?.nickName})
        </div>
        <Credit id={id} />

        {/* 주문 */}
        <div
          className="text-center text-xl bg-gray-800 py-1 
          rounded-sm font-bold text-gray-100 mb-5 w-full"
        >
          주문 확인 ({orders[0]?.data?.nickName})
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
          Picking Up List ({orders[0]?.data?.nickName})
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

        {/* 하단 버튼 영역 */}
        <div className="flex flex-row justify-between">
          {/* <CSVLink /> */}
          <ToTals
            orders={orders.filter(order => order.data.canceled === false)}
          />
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
              onClick={() => confirmOrder()}
              className=" bg-blue-900 text-white py-1 px-3 rounded-sm my-3 ml-5"
            >
              주문확인
            </button>
          </div>

          {/* 픽업 버튼들 영역 */}
          <div>
            <div>
              <button
                type="button"
                onClick={() => printGoback()}
                className=" bg-blue-900 text-white py-1 px-3 rounded-sm my-3 ml-5"
              >
                {"PickingUp&Print"}
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
                onClick={() => cancelPickUp()}
                className=" bg-blue-900 text-white py-1 px-3 rounded-sm my-3 ml-5"
              >
                픽업취소
              </button>
            </div>
            <div>
              <Addresses
                type={type}
                setType={setType}
                shippingAddresses={shippingAddresses}
                add={add}
              />
            </div>
          </div>
        </div>
        <OrderListDetailPrice
          handleSubmit={handleSubmit}
          getValues={getValues}
          orders={orders}
          account={state}
        />
        <div
          className="text-center text-lg bg-gray-800 py-1 
          rounded-sm font-bold text-gray-100 mb-5 w-full mt-10"
        >
          Shipping List ({orders[0]?.data?.nickName})
        </div>
        <ShippingListsHeader handelHiddenAll={handelHiddenAll} />
        <div>
          {shippings
            .sort((a, b) => {
              return a.data.shippedDate < b.data.shippedDate
                ? 1
                : a.data.shippedDate > b.data.shippedDate
                ? -1
                : 0;
            })
            .map((shipping, i) => (
              <React.Suspense key={i} fallback={<div>Loading...</div>}>
                <ShippingListsRow
                  shipping={shipping}
                  // users={users}
                  // exchangeRate={exchangeRate}
                  hiddenAll={hiddenAll}
                />
              </React.Suspense>
            ))}
        </div>
      </div>
      <div hidden>
        <ContentsToPrint
          ref={componentRef}
          pickUpLists={pickUpLists}
          today={today.toLocaleString()}
          nickName={orders[0]?.data?.nickName || ""}
          add={add}
          type={type}
        />
      </div>
    </form>
  );
}
