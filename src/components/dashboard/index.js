import React, { useState } from "react";
import { useEffect } from "react";
import { db } from "../../firebase";
import { ByDate } from "./ByDate";
import { ByMonth } from "./ByMonth";
import { ByUsers } from "./ByUsers";
import { Last7Days } from "./Last7Days";
//

export function DashBoard() {
  const [orders, setOrders] = useState([]);
  const [ordersInShippings, setOrdersInShippings] = useState([]);
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState([]);

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
      <div className="text-4xl font-semibold mb-10">Dash Board</div>

      <Last7Days orders={total} />
      <ByDate orders={total} />
      <ByMonth orders={total} />
      <ByUsers orders={total} users={users} />
    </div>
  );
}
