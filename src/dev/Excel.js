import React from "react";
import { CSVLink } from "react-csv";

const Excel = () => {
  const csvData = [
    ["firstname", "lastname", "email"],
    ["Ahmed", "Tomi", "ah@smthing.co.com"],
    ["Raed", "Labes", "rl@smthing.co.com"],
    ["Yezzi", "Min l3b", "ymin@cocococo.com"],
  ];

  return (
    <CSVLink data={csvData} filename="hi.csv" target="_blank">
      Download me
    </CSVLink>
  );
};

export default Excel;
