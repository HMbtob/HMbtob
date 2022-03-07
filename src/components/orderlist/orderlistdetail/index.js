import React, { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { db } from "../../../firebase";
import { useForm } from "react-hook-form";
import { OrderListDetailHeader } from "./OrderListDetailHeader";
import { OrderListDetailPrice } from "./OrderListDetailPrice";
import { AddOrder } from "./AddOrder";
import { ToTals } from "./ToTals";
// import { CSVLink } from "react-csv";
import { ContentsToPrint } from "./ContentsToPrint";
import { Credit } from "./credit";
import { ShippingListsHeader } from "../../shippinglist/ShippingListsHeader";
import { Addresses } from "./Addresses";
import { AddProduct } from "./addproduct";

export function OrderListDetail({ match, location }) {
  const { id } = match.params;
  const { state } = location;

  const today = new Date();
  const [orders, setOrders] = useState([]);
  const { handleSubmit } = useForm();

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
  // 체크박스
  const [checkedInputs, setCheckedInputs] = useState([]);

  const changeHandler = (checked, id) => {
    checked
      ? setCheckedInputs([...checkedInputs, id])
      : setCheckedInputs(checkedInputs.filter((el) => el !== id));
  };
  const idArray = [];

  // 전체 선택
  const handleAllCheck = () => {
    if (
      checkedInputs.length !==
      orders.filter((li) => li.data.canceled === false).length
    ) {
      // 전체 체크 박스가 체크 되면 id를 가진 모든 elements를 배열에 넣어주어서,
      // 전체 체크 박스 체크
      orders
        .filter((li) => li.data.canceled === false)
        .map((el) => idArray.push(el.id));
      setCheckedInputs(idArray);
    }
    // 반대의 경우 전체 체크 박스 체크 삭제
    else if (
      checkedInputs.length ===
      orders.filter((li) => li.data.canceled === false).length
    ) {
      setCheckedInputs([]);
    }
  };
  // 출시상품선택
  const handleRelCheck = () => {
    const today = new Date();
    checkedInputs.length !==
    orders.filter(
      (order) =>
        order.data.relDate.toDate() < today && order.data.canceled === false
    ).length
      ? setCheckedInputs(
          orders
            .filter(
              (order) =>
                order.data.relDate.toDate() < today &&
                order.data.canceled === false
            )
            .map((doc) => doc.id)
        )
      : setCheckedInputs([]);
  };

  // picking up 상품 선택
  const handlePickUpCheck = () => {
    checkedInputs.length !==
    orders.filter(
      (order) => order.data.pickingUp === true && order.data.canceled === false
    ).length
      ? setCheckedInputs(
          orders
            .filter(
              (order) =>
                order.data.pickingUp === true && order.data.canceled === false
            )
            .map((doc) => doc.id)
        )
      : setCheckedInputs([]);
  };

  // checked item -> confirmed
  const confirmOrder = () => {
    const checkedItems = orders.filter((order) =>
      checkedInputs.includes(order.id)
    );

    checkedItems.map(
      async (item) =>
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
    const checkedItems = orders.filter((order) =>
      checkedInputs.includes(order.id)
    );

    checkedItems.map(
      async (item) =>
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

  const handleSort = (e) => {
    try {
      setForSort({
        sortBy: e.target.id,
        order: !forSort.order,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const ShippingListsRow = React.lazy(() =>
    import("../../shippinglist/ShippingListsRow").then((module) => ({
      default: module.ShippingListsRow,
    }))
  );

  ////////////////////////////////////////////////////////////////////
  // For shippings
  const OrderListDetailRow = React.lazy(() =>
    import("./OrderListDetailRow").then((module) => ({
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
    const checkedItems = orders
      .filter((order) => checkedInputs.includes(order.id))
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
    const ids = checkedItems.map((doc) => doc.id);
    const pIds = [
      ...new Set(
        checkedItems.map((doc) =>
          doc.data.optioned === true ? doc.data.optionId : doc.data.productId
        )
      ),
    ];
    setPickUpLists(
      pIds.map((id) => ({
        barcode: checkedItems.find((item) =>
          item.data.optioned === true
            ? item.data.optionId === id
            : item.data.productId === id
        ).data.barcode,
        sku: checkedItems.find((item) =>
          item.data.optioned === true
            ? item.data.optionId === id
            : item.data.productId === id
        ).data.sku,
        title: checkedItems.find((item) =>
          item.data.optioned === true
            ? item.data.optionId === id
            : item.data.productId === id
        ).data.title,
        memo:
          checkedItems.find((item) =>
            item.data.optioned === true
              ? item.data.optionId === id
              : item.data.productId === id
          ).data.memo || "",
        quan: checkedItems
          .filter((item) =>
            item.data.optioned === true
              ? item.data.optionId === id
              : item.data.productId === id
          )
          .reduce((a, c) => {
            return a + Number(c.data.quan);
          }, 0),
      }))
    );

    ids.map(
      async (doc) =>
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
      .onSnapshot((snapshot) =>
        setShippingAddresses(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        )
      );
    return () => unsub1();
  }, [id]);

  useEffect(() => {
    setAdd(shippingAddresses.find((li) => li.data.name === type));
  }, [shippingAddresses, type]);

  useEffect(() => {
    const unsub2 = db
      .collection("accounts")
      .doc(id)
      .collection("order")
      .orderBy(forSort.sortBy || "title", forSort.order ? "asc" : "desc")
      // .get()
      .onSnapshot((snapshot) =>
        setOrders(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        )
      );

    const unsub3 = db
      .collection("accounts")
      .doc(id)
      .collection("shippingsInAccount")
      // .get()
      .onSnapshot((snapshot) =>
        setShippings(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        )
      );
    return () => {
      unsub2();
      unsub3();
    };
  }, [id, forSort]);

  const [exR, setExR] = useState(null);

  useEffect(() => {
    db.collection("exchangeRate")
      .get()
      .then((snapshot) => snapshot.docs.map((doc) => setExR(doc.data())));
  }, []);

  return (
    <form className="w-full h-full flex flex-col justify-center items-center mb-20">
      <div className="w-11/12 flex-col mt-20">
        {/* 크레딧 */}
        {console.log(state?.data?.nickName)}
        <div
          className="text-center text-xl bg-gray-800 py-1 
          rounded-sm font-bold text-gray-100 mb-5 w-full"
        >
          Credit ({state?.data?.nickName})
        </div>

        <Credit id={id} />

        {/* 주문 */}
        <div
          className="text-center text-xl bg-gray-800 py-1 
          rounded-sm font-bold text-gray-100 mb-5 w-full"
        >
          추가 주문 ({state?.data?.nickName})
        </div>
        <AddProduct id={id} add={add} />

        <OrderListDetailHeader handleSort={handleSort} />
        {orders
          .filter((order) => order.data.pickingUp !== true)
          .reduce((a, c, i) => {
            let before =
              i === 0
                ? new Date(c.data.createdAt.seconds * 1000)
                    .toISOString()
                    .substring(0, 10)
                : new Date(a[i - 1].data.createdAt.seconds * 1000)
                    .toISOString()
                    .substring(0, 10);
            c.data.before = before;
            a.push(c);
            return a;
          }, [])
          .map((order, i) => (
            <React.Suspense key={i} fallback={<div>Loading...</div>}>
              <OrderListDetailRow
                forSort={forSort}
                order={order}
                changeHandler={changeHandler}
                checkedInputs={checkedInputs}
              />
            </React.Suspense>
          ))}
        <AddOrder id={id} from="order" />
        <div
          className="text-center text-lg bg-gray-800 py-1 
          rounded-sm font-bold text-gray-100 mb-5 w-full mt-10"
        >
          Picking Up List ({state?.data?.nickName})
        </div>
        <OrderListDetailHeader handleSort={handleSort} />
        {orders
          .filter((order) => order.data.pickingUp === true)
          .reduce((a, c, i) => {
            let before =
              i === 0
                ? new Date(c.data.createdAt.seconds * 1000)
                    .toISOString()
                    .substring(0, 10)
                : new Date(a[i - 1].data.createdAt.seconds * 1000)
                    .toISOString()
                    .substring(0, 10);
            c.data.before = before;
            a.push(c);
            return a;
          }, [])
          .map((order, i) => (
            <React.Suspense key={i} fallback={<div>Loading...</div>}>
              <OrderListDetailRow
                forSort={forSort}
                order={order}
                changeHandler={changeHandler}
                checkedInputs={checkedInputs}
              />
            </React.Suspense>
          ))}
        <AddOrder id={id} from="picking" />

        {/* 하단 버튼 영역 */}
        <div className="flex flex-row justify-between">
          {/* <CSVLink /> */}
          <ToTals
            orders={orders.filter((order) => order.data.canceled === false)}
          />
          <div>
            <button
              type="button"
              onClick={() => handleAllCheck()}
              className=" bg-blue-900 text-white py-1 px-3 rounded-sm my-3"
            >
              전체선택
            </button>
            <button
              type="button"
              onClick={() => handleRelCheck()}
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
                onClick={() => handlePickUpCheck()}
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
          orders={orders}
          account={state}
          checkedInputs={checkedInputs}
          exR={exR}
        />
        <div
          className="text-center text-lg bg-gray-800 py-1 
          rounded-sm font-bold text-gray-100 mb-5 w-full mt-10"
        >
          Shipping List ({state?.data?.nickName})
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
          nickName={state?.data?.nickName || ""}
          add={add}
          type={type}
        />
      </div>
    </form>
  );
}
