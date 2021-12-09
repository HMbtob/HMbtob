import React, { useEffect, useState } from "react";
import uuid from "react-uuid";
import { db } from "../firebase";

export function OrderListToNew() {
  const [accounts, setAccounts] = useState([]);
  const [shippings, setShippings] = useState([]);
  const [orders, setOrders] = useState([]);

  const asdasdasdasd = () => {
    // 유저별 전체 발송저장 -> 리스트도 저장해야함(어카운트 맵)
    accounts.map(async acc => {
      console.log(acc.id, "차례");
      shippings
        ?.filter(or => or.data.customer === acc.id)
        ?.map(async ship => {
          const saveId = uuid();
          await db
            .collection("accounts")
            .doc(acc.id)
            .collection("shippingsInAccount")
            .doc(saveId)
            .set({
              ...ship.data,
              country: accounts.find(doc => doc.id === acc.id).data.country,
              itemsPrice: Number(
                ship?.data?.checkedItemPrice?.toString().replaceAll(",", "")
              ),
              shippingFee: Number(
                ship?.data?.checkedItemsFee?.toString().replaceAll(",", "")
              ),
              totalAmount: Number(
                ship?.data?.checkItemAmountPrice?.toString().replaceAll(",", "")
              ),
            });

          ship.data.list.map(async li => {
            await db
              .collection("accounts")
              .doc(acc.id)
              .collection("shippingsInAccount")
              .doc(saveId)
              .collection("orderListInShippings")
              .doc()
              .set({
                ...li,
                price: Number(li?.price?.toString().replaceAll(",", "")),
                totalPrice:
                  Number(li?.price?.toString().replaceAll(",", "")) * li.quan,
                weight: Number(li?.weight?.toString().replaceAll(",", "")),
                totalWeight: Number(
                  li?.totalWeight?.toString().replaceAll(",", "")
                ),
                addName: "Default Address",
                country: accounts.find(doc => doc.id === acc.id).data.country,
              });
          });
        });

      [].concat
        .apply(
          [],
          orders
            ?.filter(or => or.data.customer === acc.id)
            ?.map(asd => asd.data.list)
        )
        ?.filter(
          asdddd =>
            asdddd.shipped === false &&
            asdddd.canceled === false &&
            asdddd.moved === false
        )
        ?.map(
          async li =>
            await db
              .collection("accounts")
              .doc(acc.id)
              .collection("order")
              .doc()
              .set({
                ...li,
                price: Number(li?.price?.toString().replaceAll(",", "")),
                totalPrice:
                  Number(li?.price?.toString().replaceAll(",", "")) * li.quan,
                weight: Number(li?.weight?.toString().replaceAll(",", "")),
                totalWeight: Number(
                  li?.totalWeight?.toString().replaceAll(",", "")
                ),
                addName: "default Address",
                category: "cd",
                country: accounts.find(doc => doc.id === acc.id).data.country,
                shippingType: "dhl",
                userId: acc.id,
                userUid: acc.id,
              })
        );
    });

    // 리스트 저장(어카운트 맵)

    // 앞에 어카운츠.맵 붙이면 전체 적용(주문)
  };

  useEffect(() => {
    db.collection("orders")
      .doc("b2b")
      .collection("b2borders")
      .onSnapshot(snapshot =>
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })))
      );
    db.collection("shipping").onSnapshot(snapshot =>
      setShippings(snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })))
    );
  }, []);

  useEffect(() => {
    db.collection("accounts").onSnapshot(snapshot =>
      setAccounts(snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })))
    );
  }, []);
  return (
    <div>
      <button onClick={() => asdasdasdasd()}>gogolist</button>
    </div>
  );
}
