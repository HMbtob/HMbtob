import React, { useContext } from "react";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { db } from "../firebase";
import { SPREADSHEET_ID, PRIVATE_KEY } from "../evir";
import { InitDataContext } from "../App";
import axios from "axios";

const Sheets = () => {
  const state = useContext(InitDataContext);
  const { products } = state;
  console.log(products);
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

  // 상품 가격, 출시일 업데이트
  // 바코드, 매입가 , 도매가

  const reaBarcodePrice = async () => {
    try {
      await doc.useServiceAccountAuth({
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY.replace(/\\n/g, "\n"),
      });
      // loads document properties and worksheets
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[2];

      // 행으로 입력하기
      const rows = await sheet.getRows();

      for (let i = 0; i < 5; i++) {
        setTimeout(() => console.log(i, "번째 인터벌"), 1000);
      }
      rows.slice(0, 10).map(async (prii, index) => {
        const fireDocIdbySkuForSavePriceRelDate = products.find(
          product => product.data.barcode === prii["barcode"]
        )?.id;
        const bigProIdBySkuForRelDate = products.find(
          product => product.data.barcode === prii["barcode"]
        )?.data.bigC.id;
        if (fireDocIdbySkuForSavePriceRelDate) {
          console.log(index, "시작, 성공");
          console.log("id ->", fireDocIdbySkuForSavePriceRelDate);
          const relDate = await axios
            .get(
              `/stores/7uw7zc08qw/v3/catalog/products/${bigProIdBySkuForRelDate}/custom-fields`,
              {
                headers: {
                  "x-auth-token": "23t2vx6zwiq32xa8b0uspfo7mb7181x",
                  accept: "application/json",
                  "content-type": "application/json",
                },
              }
            )
            .then(field => field.data.data[0].value)
            .catch(error => console.log(error));

          // 썸네일 주소
          const thumb = await axios
            .get(
              `/stores/7uw7zc08qw/v3/catalog/products/${bigProIdBySkuForRelDate}/images`,
              {
                headers: {
                  "x-auth-token": "23t2vx6zwiq32xa8b0uspfo7mb7181x",
                  accept: "application/json",
                  "content-type": "application/json",
                },
              }
            )
            .then(imageUrl => imageUrl.data.data[0].url_thumbnail)
            .catch(error => console.log(error));

          // 저장하기
          await db
            .collection("products")
            .doc(fireDocIdbySkuForSavePriceRelDate)
            .update({
              thumbNail: thumb,
              relDate: new Date(relDate),
              preOrderDeadline: new Date(relDate),
              purchasePrice: Number(prii["purchasePrice"].replace(",", "")),
              price: Number(prii["price"].replace(",", "")),
            });
        } else {
          console.log("실패");
        }
        // 출시일
      });
    } catch (e) {
      console.error("Error: ", e);
    }
  };
  return (
    <>
      <button
        className="bg-gray-500 text-gray-200 p-1 rounded m-1"
        onClick={reaBarcodePrice}
      >
        {" "}
        바코드 가격정보 가져오기{" "}
      </button>

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
