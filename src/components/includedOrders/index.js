import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import IncludedOrderRow from "./IncludedOrderRow";
import IncludedOrdersHeader from "./IncludedOrdersHeader";

export default function IncludedOrders({ match }) {
  const [includedOrders, setIncludedOrders] = useState([]);

  useEffect(() => {
    db.collectionGroup("order")
      .where("productId", "==", match.params.id)
      .get()
      .then((result) =>
        setIncludedOrders(
          result.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        )
      );
  }, [match.params.id]);
  return (
    <div className="w-full h-full flex flex-col justify-center items-center mb-20">
      <div className="w-11/12 flex-col mt-20">
        <div
          className="text-center text-xl bg-gray-800 py-1 
          rounded-sm font-bold text-gray-100 mb-5 w-full"
        >
          미발송 주문
        </div>
        <IncludedOrdersHeader />
        {includedOrders
          .filter((doc) => doc.data.pickingUp !== true)
          .map((doc, i) => (
            <React.Suspense key={i} fallback={<div>Loading...</div>}>
              <IncludedOrderRow doc={doc} />
            </React.Suspense>
          ))}
        <div className="border-gray-300 grid grid-cols-36 text-center border-r border-b border-l py-1 text-sm items-center">
          <div className="col-span-8"></div>
          <div className="col-span-8"></div>
          <div className="col-span-8"></div>
          <div className="col-span-3 font-semibold text-lg">총합</div>

          <div className="col-span-2  font-semibold text-lg">
            {includedOrders
              ?.filter((doc) => doc.data.pickingUp !== true)
              ?.reduce((a, c) => a + c.data.quan, 0)}{" "}
            EA
          </div>
        </div>

        <div
          className="text-center text-xl bg-gray-800 py-1 
          rounded-sm font-bold text-gray-100 mb-5 w-full mt-12"
        >
          미발송 픽킹리스트
        </div>
        <IncludedOrdersHeader />
        {includedOrders
          .filter((doc) => doc.data.pickingUp === true)
          .map((doc, i) => (
            <React.Suspense key={i} fallback={<div>Loading...</div>}>
              <IncludedOrderRow doc={doc} />
            </React.Suspense>
          ))}
        <div className="border-gray-300 grid grid-cols-36 text-center border-r border-b border-l py-1 text-sm items-center">
          <div className="col-span-8"></div>
          <div className="col-span-8"></div>
          <div className="col-span-8"></div>
          <div className="col-span-3  font-semibold text-lg">총합</div>

          <div className="col-span-2  font-semibold text-lg">
            {includedOrders
              ?.filter((doc) => doc.data.pickingUp === true)
              ?.reduce((a, c) => a + c.data.quan, 0)}{" "}
            EA
          </div>
        </div>
      </div>
    </div>
  );
}
