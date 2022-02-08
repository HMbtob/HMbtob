import React, { useState } from "react";
import { useEffect } from "react";
import { db } from "../../firebase";
// import { ByMonth } from "./ByMonth";
import { ByUsers } from "./ByUsers";
import { FirstContainer } from "./FirstContainer";
import { Last7Days } from "./Last7Days";
import { SecondContainer } from "./SecondContainer";

export function DashBoard() {
  const [orders, setOrders] = useState([]);
  const [ordersInShippings, setOrdersInShippings] = useState([]);
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState([]);

  // datas
  const [lifetime, setLifetime] = useState(null);
  const [byDate, setByDate] = useState(null);
  const [top5, setTop5] = useState(null);
  const [byUser, setByUser] = useState(null);

  useEffect(() => {
    setLifetime(
      total.reduce(
        (a, c) => {
          return {
            quan: Number(a.quan) + Number(c.quan),
            totalPrice: Number(a.totalPrice) + Number(c.totalPrice),
          };
        },
        { title: "", quan: 0, totalPrice: 0 }
      )
    );

    setByDate(
      [
        ...new Set(
          total
            ?.sort((a, b) => {
              return a?.createdAt < b?.createdAt
                ? -1
                : a?.createdAt > b?.createdAt
                ? 1
                : 0;
            })
            .map(
              order =>
                `${
                  new Date(order.createdAt.seconds * 1000).getMonth() + 1
                }-${new Date(order.createdAt.seconds * 1000).getDate()}`
            )
        ),
      ].map(d =>
        total
          ?.sort((a, b) => {
            return a?.createdAt < b?.createdAt
              ? -1
              : a?.createdAt > b?.createdAt
              ? 1
              : 0;
          })
          .map(order => ({
            monthDate: `${
              new Date(order.createdAt.seconds * 1000).getMonth() + 1
            }-${new Date(order.createdAt.seconds * 1000).getDate()}`,
            quan: order.quan,
          }))
          .filter(f => f.monthDate === d && f.quan < 10000)
          .reduce(
            (a, c) => {
              return {
                monthDate: c.monthDate,
                quan: Number(a.quan) + Number(c.quan),
              };
            },
            { monthDate: "", quan: 0 }
          )
      )
    );

    setTop5(
      [
        ...new Set(
          total
            .sort((a, b) => {
              return a?.title?.trim() < b?.title?.trim()
                ? -1
                : a?.title?.trim() > b?.title?.trim()
                ? 1
                : 0;
            })
            // .filter(order => {
            //   let today = new Date().getTime();
            //   let gap = new Date(order.createdAt.seconds * 1000).getTime() - today;
            //   let day = Math.ceil(gap / (1000 * 60 * 60 * 24));
            //   return day > -8;
            // })
            .map(li => li.title.trim())
        ),
      ]
        .reduce((a, c) => {
          a.push(
            total
              .filter(li => li.title.trim() === c.trim())
              .reduce(
                (a, c) => {
                  return {
                    title: c.title.trim(),
                    quan: Number(a.quan) + Number(c.quan),
                    totalPrice: Number(a.totalPrice) + Number(c.totalPrice),
                  };
                },
                { title: "", quan: 0, totalPrice: 0 }
              )
          );
          return a;
        }, [])
        .sort((a, b) => {
          return a.totalPrice < b.totalPrice ? 1 : -1;
        })
        .slice(0, 5)
    );

    setByUser(
      [
        ...new Set(
          total
            // .sort((a, b) => {
            //   return a?.nickName?.trim() < b?.nickName?.trim()
            //     ? -1
            //     : a?.nickName?.trim() > b?.nickName?.trim()
            //     ? 1
            //     : 0;
            // })
            // .filter(order => {
            //   let today = new Date().getTime();
            //   let gap = new Date(order.createdAt.seconds * 1000).getTime() - today;
            //   let day = Math.ceil(gap / (1000 * 60 * 60 * 24));
            //   return day > -8;
            // })
            .map(li => li.nickName.trim())
        ),
      ]
        .reduce((a, c) => {
          a.push(
            total
              .filter(li => li.nickName.trim() === c.trim())
              .reduce(
                (a, c) => {
                  return {
                    nickName: c.nickName.trim(),
                    quan: Number(a.quan) + Number(c.quan),
                    totalPrice: Number(a.totalPrice) + Number(c.totalPrice),
                  };
                },
                { nickName: "", quan: 0, totalPrice: 0 }
              )
          );
          return a;
        }, [])
        .sort((a, b) => {
          return a.totalPrice < b.totalPrice ? 1 : -1;
        })
        .slice(0, 5)
    );
  }, [total]);

  useEffect(() => {
    db.collectionGroup("order")
      .get()
      .then(order => setOrders(order.docs.map(doc => doc.data())));
    db.collectionGroup("orderListInShippings")
      .get()
      .then(order => setOrdersInShippings(order.docs.map(doc => doc.data())));
    db.collection("accounts")
      .get()
      .then(user => setUsers(user.docs.map(doc => doc.data())));
  }, []);

  useEffect(() => {
    setTotal([...orders, ...ordersInShippings]);
  }, [orders, ordersInShippings]);

  return (
    <div className="mt-32 mb-32 w-full flex flex-col items-center">
      <div className="text-4xl font-semibold mb-5">Dash Board</div>
      <FirstContainer
        lifetime={lifetime}
        orderQty={total.length}
        byDate={byDate}
      />
      <SecondContainer top5={top5} byUser={byUser} />
      <Last7Days orders={total} />
      {/* <ByMonth orders={total} /> */}
      <ByUsers orders={total} users={users} />
    </div>
  );
}
