import React from "react";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { db } from "../firebase";
import { SPREADSHEET_ID, PRIVATE_KEY } from "../evir";
const Sheets = () => {
  //   const SHEET_ID = "Sheet2";
  const CLIENT_EMAIL = "forsheet@interasiastock.iam.gserviceaccount.com";

  const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

  const saveShippingFee = async z => {
    await db.collection("shippingFee").doc("dhl").set({
      z,
    });
  };

  //  dhl 존
  let zones = [];
  const readSheets = async () => {
    try {
      await doc.useServiceAccountAuth({
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY.replace(/\\n/g, "\n"),
      });
      // loads document properties and worksheets
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[1];

      // 행으로 가져오기
      const rows = await sheet.getRows();
      for (let i = 1; i < 10; i++) {
        let countries = rows
          .slice(60)
          .map(row => row[`zone${i}`])
          .filter(Boolean);
        let fees = rows
          .slice(0, 60)
          .map(row => row[`zone${i}`])
          .filter(Boolean);
        zones.push({ [`zone${i}`]: { country: countries, fee: fees } });
      }
      saveShippingFee(zones);
      alert("수집완료");
    } catch (e) {
      console.error("Error: ", e);
    }
  };
  return (
    <>
      <button
        className="bg-gray-500 text-gray-200 p-1 rounded m-1"
        onClick={readSheets}
      >
        {" "}
        dhl 배송료 수집하기
      </button>
      <button
        className="bg-gray-500 text-gray-200 p-1 rounded m-1"
        onClick={() =>
          window.open(
            "https://docs.google.com/spreadsheets/d/1fA8-4EPeHNCV_VMXQY2Xmlxw-PkIKedpK6oSWBTk6Zk/edit#gid=633633295",
            "_blank"
          )
        }
      >
        {" "}
        입력하러 가기
      </button>
    </>
  );
};

export default Sheets;
