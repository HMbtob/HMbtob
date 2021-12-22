import React, { useState } from "react";
import { CSVLink } from "react-csv";
import { db } from "../../firebase";

export function CSVLink() {
  //   const [csvData, setCsvData] = useState([{ a: "a" }]);
  const csvData = "as";
  const today = new Date();
  const date = `${today
    .toLocaleDateString()
    .replaceAll(".", "-")
    .replaceAll(" ", "")}han.csv`;

  return (
    <div>
      <CSVLink data={csvData} filename={date} target="_blank" className="ml-2">
        <button
          type="button"
          className=" bg-blue-900 text-white py-1 px-3 rounded-sm my-3 ml-5"
        >
          EXCEL DOWN
        </button>
      </CSVLink>
    </div>
  );
}
