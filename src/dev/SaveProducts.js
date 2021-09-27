import React, { useContext } from "react";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { db } from "../firebase";
import { SPREADSHEET_ID, PRIVATE_KEY } from "../evir";
import { InitDataContext } from "../App";
import axios from "axios";

const SaveProducts = () => {
  const state = useContext(InitDataContext);
  const { allOrderProductsList, user } = state;
  const CLIENT_EMAIL = "forsheet@interasiastock.iam.gserviceaccount.com";

  const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

  const batch = db.batch();
  const testBatch = async () => {
    // 모든 상품정보 가져오기 에서 상품 아이디 가져오기

    // 모든 상품 가격정보 구글시트에서 가져오기
    await doc.useServiceAccountAuth({
      client_email: CLIENT_EMAIL,
      private_key: PRIVATE_KEY.replace(/\\n/g, "\n"),
    });
    // loads document properties and worksheets
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[2];

    // 행으로 입력하기
    const rows = await sheet.getRows();

    console.log("반복문 시작");
    for (let i = 3042; i < 3101; i++) {
      console.log(i, "번째");

      const productId = allOrderProductsList?.data[i]?.id;
      const productRef = db.collection("products").doc(`${productId}`);
      // id로 도매가 가져오기
      const price = Number(
        rows?.find(row => row["barcode"] === allOrderProductsList?.data[i]?.upc)
          ? rows
              ?.find(
                row => row["barcode"] === allOrderProductsList?.data[i]?.upc
              )
              ["price"]?.replace(",", "")
          : 0
      );
      // id로 매입가 가져오기
      const pPrice = Number(
        rows?.find(row => row["barcode"] === allOrderProductsList?.data[i]?.upc)
          ? rows
              ?.find(
                row => row["barcode"] === allOrderProductsList?.data[i]?.upc
              )
              ["purchasePrice"]?.replace(",", "")
          : 0
      );

      // id로 출시일 가져오기
      let relDate = await axios
        .get(
          `/stores/7uw7zc08qw/v3/catalog/products/${productId}/custom-fields`,
          {
            headers: {
              "x-auth-token": "23t2vx6zwiq32xa8b0uspfo7mb7181x",
              accept: "application/json",
              "content-type": "application/json",
            },
          }
        )
        .then(field =>
          field?.data?.data[0]?.name === "RELEASE DATE"
            ? field?.data?.data[0]?.value
            : "2024-01-01"
        )
        .catch(error => console.log(error));
      console.log(relDate);

      relDate =
        relDate.includes("Jan") ||
        relDate.includes("Feb") ||
        relDate.includes("Mar") ||
        relDate.includes("Apr") ||
        relDate.includes("May") ||
        relDate.includes("Jun") ||
        relDate.includes("Jul") ||
        relDate.includes("Aug") ||
        relDate.includes("Sep") ||
        relDate.includes("Oct") ||
        relDate.includes("Nov") ||
        relDate.includes("Dec")
          ? relDate
          : relDate.includes(".") && relDate.length >= 9
          ? relDate.replaceAll(".", "/")
          : relDate.includes("/") && relDate.length >= 9
          ? relDate
          : relDate
              .replaceAll("-", "")
              .replaceAll("/", "")
              .replaceAll("_", "")
              .replaceAll(",", "")
              .replaceAll(".", "").length === 8
          ? relDate
              .replaceAll("-", "")
              .replaceAll("/", "")
              .replaceAll("_", "")
              .replaceAll(",", "")
              .replaceAll(".", "")
              .slice(0, 4) +
            "-" +
            relDate
              .replaceAll("-", "")
              .replaceAll("/", "")
              .replaceAll("_", "")
              .replaceAll(",", "")
              .replaceAll(".", "")
              .slice(4, 6) +
            "-" +
            relDate
              .replaceAll("-", "")
              .replaceAll("/", "")
              .replaceAll("_", "")
              .replaceAll(",", "")
              .replaceAll(".", "")
              .slice(6, 8)
          : relDate
              .replaceAll("-", "")
              .replaceAll("/", "")
              .replaceAll("_", "")
              .replaceAll(",", "")
              .replaceAll(".", "").length === 6
          ? ("20" + relDate)
              .replaceAll("-", "")
              .replaceAll("/", "")
              .replaceAll("_", "")
              .replaceAll(",", "")
              .replaceAll(".", "")
              .slice(0, 4) +
            "/" +
            ("20" + relDate)
              .replaceAll("-", "")
              .replaceAll("/", "")
              .replaceAll("_", "")
              .replaceAll(",", "")
              .replaceAll(".", "")
              .slice(4, 6) +
            "/" +
            ("20" + relDate)
              .replaceAll("-", "")
              .replaceAll("/", "")
              .replaceAll("_", "")
              .replaceAll(",", "")
              .replaceAll(".", "")
              .slice(6, 8)
          : "2023-01-01";

      // relDate.length === 8
      //   ? relDate.slice(0, 4) +
      //     "-" +
      //     relDate.slice(4, 6) +
      //     "-" +
      //     relDate.slice(6, 8)
      //   : relDate === 6
      //   ? "20" + relDate
      //   : "2023-01-01";

      console.log(relDate);
      // 썸네일 주소
      const thumb = await axios
        .get(`/stores/7uw7zc08qw/v3/catalog/products/${productId}/images`, {
          headers: {
            "x-auth-token": "23t2vx6zwiq32xa8b0uspfo7mb7181x",
            accept: "application/json",
            "content-type": "application/json",
          },
        })
        .then(imageUrl => imageUrl?.data?.data[0]?.url_thumbnail)
        .catch(error => console.log(error));
      // console.log(
      //   relDate?.length === 8
      //     ? new Date("20".concat(relDate))
      //     : (relDate?.length < 12 && relDate?.length) > 7
      //     ? new Date(relDate)
      //     : new Date("20 Oct 2021")
      // );
      await batch.set(productRef, {
        sku: allOrderProductsList?.data[i]?.sku || "...",
        purchasePrice: pPrice || 0,
        price: price || 0,
        artist: "...",
        ent: "...",
        x: 0,
        y: 0,
        z: 0,
        title: allOrderProductsList?.data[i]?.name,
        thumbNail: thumb || "...",
        descrip: "...",
        weight: allOrderProductsList?.data[i]?.weight * 1000,
        category:
          allOrderProductsList?.data[i]?.categories.filter(arr =>
            [196].includes(arr)
          ).length > 0
            ? "cd"
            : allOrderProductsList?.data[i]?.categories.filter(arr =>
                [200, 245].includes(arr)
              ).length > 0
            ? "dvdBlueRay"
            : allOrderProductsList?.data[i]?.categories.filter(arr =>
                [203].includes(arr)
              ).length > 0
            ? "photoBook"
            : allOrderProductsList?.data[i]?.categories.filter(arr =>
                [205, 207, 243, 244, 209, 246, 222, 210].includes(arr)
              ).length > 0
            ? "goods"
            : allOrderProductsList?.data[i]?.categories.filter(arr =>
                [237, 208, 241, 238, 239, 240].includes(arr)
              ).length > 0
            ? "officialStore"
            : allOrderProductsList?.data[i]?.categories.filter(arr =>
                [
                  206, 216, 230, 233, 225, 229, 219, 224, 231, 215, 221, 220,
                  214, 223,
                ].includes(arr)
              ).length > 0
            ? "beauty"
            : "beauty",
        relDate: new Date(relDate),
        // // relDate?.length === 8
        // //   ? new Date("20".concat(relDate))
        // //   : relDate?.length < 12 && relDate?.length > 6
        // //   ? new Date(relDate)
        // //   : new Date("20 Oct 2021")
        preOrderDeadline: new Date(relDate),
        // // relDate?.length === 8
        // //   ? new Date("20".concat(relDate))
        // //   : relDate?.length < 12 && relDate?.length > 6
        // //   ? new Date(relDate)
        // //   : new Date("20 Oct 2021")
        preOrderDeadlineTime: new Date(relDate),
        // // relDate?.length === 8
        // //   ? new Date("20".concat(relDate))
        // //   : relDate?.length < 12 && relDate?.length > 6
        // //   ? new Date(relDate)
        // //   : new Date("20 Oct 2021")
        options: {
          poster: false,
          pob: false,
          photocard: false,
          weverseGift: false,
          interAsiaPhotocard: false,
        },
        barcode: allOrderProductsList?.data[i]?.upc || "...",
        reStockable:
          allOrderProductsList.data[i].inventory_level === 0
            ? "불가능"
            : "가능",
        stock: allOrderProductsList.data[i].inventory_level,
        exposeToB2b: allOrderProductsList?.data[i]?.is_visible
          ? "노출"
          : "숨김",
        bigC: { ...allOrderProductsList?.data[i] },
        limitedStock:
          allOrderProductsList.data[i].inventory_level === 0 ? true : false,
        productMemo: [
          {
            memo: "add product",
            date: new Date(),
            writer: "server",
          },
        ],
        stockHistory: [
          {
            type: "add product on list",
            writer: user.email,
            amount: 0,
            date: new Date(),
          },
        ],
        totalStock:
          allOrderProductsList.data[i].inventory_level +
          allOrderProductsList.data[i].total_sold,
        totalSold: 0,
      });
    }

    console.log("커밋");
    batch.commit();
  };

  return (
    <>
      <button
        onClick={testBatch}
        className="text-left text-2xl  
         mb-1 ml-2 bg-gray-500 text-gray-200 p-1 rounded m-1"
      >
        test{" "}
      </button>
      <button
        onClick={() => console.log(allOrderProductsList.data[2879])}
        className="text-left text-2xl  
         mb-1 ml-2 bg-gray-500 text-gray-200 p-1 rounded m-1"
      >
        상품 추가
      </button>
      {/* <button
        onClick={() => console.log(allOrderProductsList[982])}
        className="text-left text-2xl  
         mb-1 ml-2 bg-gray-500 text-gray-200 p-1 rounded m-1"
      >
        상품 추가
      </button>
      <button
        onClick={() => console.log(allOrderProductsList[983])}
        className="text-left text-2xl  
         mb-1 ml-2 bg-gray-500 text-gray-200 p-1 rounded m-1"
      >
        상품 추가
      </button> */}
    </>
  );
};

export default SaveProducts;
