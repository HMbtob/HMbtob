import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { useForm } from "react-hook-form";
import { OrderListDetailHeader } from "./OrderListDetailHeader";
import { OrderListDetailPrice } from "./OrderListDetailPrice";
import { AddOrder } from "./AddOrder";
import { ToTals } from "./ToTals";
// import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

export function OrderListDetail({ match, location }) {
  const history = useHistory();
  const { id } = match.params;
  const { state } = location;
  const [orders, setOrders] = useState([]);
  const { register, handleSubmit, setValue, getValues } = useForm();

  // for 전체선택
  const [checkAll, setCheckAll] = useState(false);

  // checked item
  const asdasd = async () => {
    const asdad = getValues();
    const checkedItems = orders.filter(order =>
      Object.keys(asdad)
        .reduce((a, c) => {
          if (asdad[c] === true) {
            a.push(c);
          }
          return a;
        }, [])
        .includes(order.id)
    );
    const ids = checkedItems.map(doc => doc.id);
    history.push({
      pathname: "/pickuplist2",
      state: { checkedItems, ids },
    });
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
          유저별 주문 확인
        </div>

        <OrderListDetailHeader handleSort={handleSort} />
        {orders.map((order, i) => (
          <React.Suspense key={i} fallback={<div>Loading...</div>}>
            <OrderListDetailRow
              order={order}
              register={register}
              checkAll={checkAll}
              setValue={setValue}
            />
          </React.Suspense>
        ))}
        <AddOrder id={id} />
        <div>
          <button
            type="button"
            onClick={() => setCheckAll(!checkAll)}
            className=" bg-blue-900 text-white py-1 px-3 rounded-sm my-3"
          >
            전체선택
          </button>

          {/* <Link
            to={{
              pathname: "/pickuplist2",
              state: checkedItems?.map(doc => doc.id),
              checkedItems,
            }}
          > */}
          <button
            type="button"
            onClick={() => asdasd()}
            className=" bg-blue-900 text-white py-1 px-3 rounded-sm my-3"
          >
            PickUp List
          </button>
          {/* </Link> */}
          <ToTals orders={orders} />
        </div>
        <OrderListDetailPrice
          handleSubmit={handleSubmit}
          getValues={getValues}
          orders={orders}
          account={state}
        />
      </div>
    </form>
  );
}
