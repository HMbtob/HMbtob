import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { ShippingListsHeader } from "./ShippingListsHeader";
import { ShippingListsRow } from "./ShippingListsRow";
export function ShippingLists() {
  const [users, setUsers] = useState([]);
  const [shippings, setShippings] = useState([]);
  const [hiddenAll, setHiddenAll] = useState(true);
  const handelHiddenAll = () => {
    setHiddenAll(!hiddenAll);
  };
  useEffect(() => {
    db.collectionGroup("shippingsInAccount").onSnapshot(snapshot =>
      setShippings(snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })))
    );
    db.collection("accounts").onSnapshot(snapshot =>
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })))
    );
  }, []);

  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-11/12 flex-col mt-20">
        <div
          className="w-full text-center my-4 
        text-gray-800 font-semibold"
        >
          Shipped Items{" "}
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
                  users={users}
                  // exchangeRate={exchangeRate}
                  hiddenAll={hiddenAll}
                />
              </React.Suspense>
            ))}
        </div>
      </div>
    </div>
  );
}
