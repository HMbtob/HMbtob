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

    for (let i = 0; i < 50; i++) {
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
      const relDate = await axios
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
        .then(field => field?.data?.data[0]?.value)
        .catch(error => console.log(error));

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

      await batch.set(productRef, {
        sku: allOrderProductsList?.data[i]?.sku || "...",
        purchasePrice: pPrice || 0,
        price: price || 0,
        artist: "...",
        ent: "...",
        x: 0,
        stock: allOrderProductsList?.data[i]?.inventory_level,
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
        relDate:
          relDate?.length < 11 && relDate?.length > 7
            ? new Date(relDate)
            : new Date(),
        preOrderDeadline:
          relDate?.length < 11 && relDate?.length
            ? new Date(relDate)
            : new Date(),
        preOrderDeadlineTime:
          relDate?.length < 11 && relDate?.length
            ? new Date(relDate)
            : new Date(),
        options: {
          poster: false,
          pob: false,
          photocard: false,
          weverseGift: false,
          interAsiaPhotocard: false,
        },
        barcode: allOrderProductsList?.data[i]?.upc || "...",
        reStockable: "불가능",
        exposeToB2b: allOrderProductsList?.data[i]?.is_visible
          ? "노출"
          : "숨김",
        bigC: { ...allOrderProductsList?.data[i] },
        limitedStock: false,
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
        totalStock: 0,
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
        // onClick={saveProduct}
        className="text-left text-2xl  
         mb-1 ml-2 bg-gray-500 text-gray-200 p-1 rounded m-1"
      >
        상품 추가
      </button>
    </>
  );
};

export default SaveProducts;
