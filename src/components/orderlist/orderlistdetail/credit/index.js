import React, { useState } from "react";
import { useEffect } from "react";
import { db } from "../../../../firebase";
import { CreditAdd } from "./CreditAdd";
import { CreditHeader } from "./CreditHeader";
import Paging from "../../../b2bshop/b2bshop/mobile/Paging";

export function Credit({ id }) {
  const CreditRow = React.lazy(() =>
    import("./CreditRow").then(module => ({
      default: module.CreditRow,
    }))
  );
  const [credits, setCredits] = useState([]);
  const [user, setUser] = useState("");
  const [exchangeRate, setExchangeRate] = useState({});

  // 페이지당 항목수
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const handleItemsPerPage = e => {
    const { value } = e.target;
    setItemsPerPage(Number(value));
  };
  // 페이징
  const count = credits?.length;
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  useEffect(() => {
    db.collection("accounts")
      .doc(id)
      .collection("credit")
      .orderBy("createdAt", "asc")
      .onSnapshot(snapshot =>
        setCredits(snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })))
      );
    db.collection("accounts")
      .doc(id)
      .onSnapshot(snapshot => setUser(snapshot.data()));
    db.collection("exchangeRate")
      .doc("rates")
      .onSnapshot(snapshot => setExchangeRate(snapshot.data()));
  }, [id]);

  useEffect(() => {
    setCurrentPage(parseInt(credits.length / itemsPerPage) + 1);
  }, [credits, itemsPerPage]);

  return (
    <div className="flex flex-col mb-20">
      <div className="w-full flex justify-end">
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPage}
          className="outline-none"
        >
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        개씩 보기
      </div>
      <CreditHeader />
      {credits
        .slice(
          currentPage * itemsPerPage - itemsPerPage,
          currentPage * itemsPerPage
        )
        .reduce((a, c, i) => {
          let balance =
            i === 0
              ? c.data.balance || 0
              : a[i - 1].data.balance + c.data.plus - c.data.minus;
          c.data.balance = balance;
          a.push(c);
          return a;
        }, [])
        .map((credit, i) => (
          <React.Suspense key={i} fallback={<div>Loading...</div>}>
            <CreditRow credit={credit} />
          </React.Suspense>
        ))}
      <div className="flex flex-row w-full items-center justify-center">
        <Paging
          page={currentPage}
          count={count}
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
        />
      </div>

      <CreditAdd id={id} user={user} exchangeRate={exchangeRate} />
    </div>
  );
}
