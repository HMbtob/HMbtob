import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import { db } from "../../firebase";
import { toDate } from "../../utils/shippingUtils";

export function CSVInvoice({ shipping }) {
  const [csvData, setCsvData] = useState("a");
  // csv down
  const today = new Date();
  const date = `${today.toLocaleDateString()}-invoice.csv`;

  useEffect(() => {
    db.collection("accounts")
      .doc(shipping.data.customer || shipping.data.userId)
      .collection("shippingsInAccount")
      .doc(shipping.id)
      .collection("orderListInShippings")
      .onSnapshot((snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        const pIds = [
          ...new Set(
            items.map((doc) =>
              doc.data.optioned === true
                ? doc.data.optionId
                : doc.data.productId
            )
          ),
        ];
        const reducedItems = pIds.map((id) => ({
          barcode: items.find((item) =>
            item.data.optioned === true
              ? item.data.optionId === id
              : item.data.productId === id
          ).data.barcode,
          price: items.find((item) =>
            item.data.optioned === true
              ? item.data.optionId === id
              : item.data.productId === id
          ).data.price,
          currency: items.find((item) =>
            item.data.optioned === true
              ? item.data.optionId === id
              : item.data.productId === id
          ).data.currency,
          sku: items.find((item) =>
            item.data.optioned === true
              ? item.data.optionId === id
              : item.data.productId === id
          ).data.sku,
          title: items.find((item) =>
            item.data.optioned === true
              ? item.data.optionId === id
              : item.data.productId === id
          ).data.title,
          memo:
            items.find((item) =>
              item.data.optioned === true
                ? item.data.optionId === id
                : item.data.productId === id
            ).data.memo || "",
          quan: items
            .filter((item) =>
              item.data.optioned === true
                ? item.data.optionId === id
                : item.data.productId === id
            )
            .reduce((a, c) => {
              return a + Number(c.data.quan);
            }, 0),
        }));
        setCsvData([
          ["INVOICE"],
          ["Seller"],
          ["INTERASIA"],
          [
            "#417, 78 Digital-ro 10-gil",
            "",
            "",
            `Invoice No. : ${shipping?.data?.shippingNumber}`,
          ],
          [
            "Geumcheon-gu, Seoul, Korea",
            "",
            "",
            `Invoice Date : ${toDate(shipping?.data?.shippedDate?.seconds)}`,
          ],
          ["Tel 82 2 10 2088 0022"],
          ["Fax +82 2 3281 0125"],
          [],
          ["Consignee", "", "", `Shipping : ${shipping?.data?.shippingType}`],
          [],
          ["", "", "", `Tracking No. : ${shipping?.data?.trackingNumber}`],
          ["", "Description of goods", "Option", "Qty", "Unit Price", "Amount"],
          ...reducedItems.map((doc, i) => [
            i + 1,
            doc.title,
            "",
            `${doc.quan} EA`,
            `${Number(Number(doc.price).toFixed(2)).toLocaleString()} ${
              doc.currency
            }`,
            `${Number(
              (Number(doc.quan) * Number(doc.price)).toFixed(2)
            ).toLocaleString()} ${doc.currency}`,
          ]),
          [],
          [],
          [],
          [],
          [],
          [],
          ["", "Total Amount in USD", "", "", "", "total"],
          ["Declaration of origin :  ", "", "", "Date & Company Chop"],
          [
            "We the undersigned, the exporter of the products, \ncovered by this document, declare that, except where \notherwise clearly indicated, these products are of South Korea \npreferential origin.",
          ],
          ["", "", "", "INTERASIA"],
        ]);
      });
  }, [shipping]);
  return (
    <div>
      <CSVLink data={csvData} filename={date} target="_blank" className="ml-2">
        <CalendarViewMonthIcon />
      </CSVLink>
    </div>
  );
}

// import React, { Component } from "react";
// import ReactHTMLTableToExcel from "react-html-table-to-excel";

// export const CSVInvoice = () => {
//   return (
//     <div>
//       <ReactHTMLTableToExcel
//         id="test-table-xls-button"
//         className="download-table-xls-button"
//         table="table-to-xls"
//         filename="INVOICE"
//         sheet="invoice"
//         buttonText="Download as XLS"
//       />
//       <table id="table-to-xls" className="hidden">
//         <tr>
//           <td className="text-lg">INVOICE</td>
//         </tr>
//         <tr>
//           <th>Firstname</th>
//           <th>Lastname</th>
//           <th>Age</th>
//         </tr>
//         <tr>
//           <td>Jill</td>
//           <td>Smith</td>
//           <td>50</td>
//         </tr>
//         <tr>
//           <td>Eve</td>
//           <td>Jackson</td>
//           <td>94</td>
//         </tr>
//       </table>
//     </div>
//   );
// };
