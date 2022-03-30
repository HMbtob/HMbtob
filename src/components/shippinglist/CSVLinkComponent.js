import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import { db } from "../../firebase";

export function CSVLinkComponent({ shipping }) {
  const [csvData, setCsvData] = useState("a");
  // csv down
  const today = new Date();

  const date = `${today
    .toLocaleDateString()
    .replaceAll(".", "-")
    .replaceAll(" ", "")}han.csv`;

  useEffect(() => {
    db.collection("accounts")
      .doc(shipping.data.customer || shipping.data.userId)
      .collection("shippingsInAccount")
      .doc(shipping.id)
      .collection("orderListInShippings")
      .onSnapshot((snapshot) =>
        setCsvData(
          snapshot.docs.map((doc) => [
            doc.data().sku,
            doc.data().sku,
            doc.data().title,
            doc.data().barcode,
            "interasia01",
            doc.data().quan,
            doc.data().price,
          ])
        )
      );
  }, [shipping]);
  return (
    <div>
      <CSVLink data={csvData} filename={date} target="_blank" className="ml-2">
        <CalendarViewMonthIcon />
      </CSVLink>
    </div>
  );
}
