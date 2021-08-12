import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router";
import useInputs from "../../../hooks/useInput";
import { db } from "../../../firebase";
import axios from "axios";
import { InitDataContext, InitDispatchContext } from "../../../App";

const AddProduct = () => {
  const history = useHistory();
  const state = useContext(InitDataContext);
  const { allOrderProductsList } = state;
  const [
    {
      sku,
      title,
      purchasePrice,

      artist,
      ent,
      category,
      thumbNail,
      descrip,
      weight,
      x,
      y,
      z,
      relDate,
      preOrderDeadline,
      poster,
      pob,
      photocard,
      weverseGift,
      interAsiaPhotocard,
      barcode,
      reStockable,
      stock,
      exposeToB2b,
      KRW,
      USD,
      EUR,
      SGD,
      JPY,
      CNY,
    },
    onChange,
    reset,
  ] = useInputs({
    sku: "",
    title: "",
    purchasePrice: 0,
    price: {
      KRW: 0,
      USD: 0,
      EUR: 0,
      SGD: 0,
      JPY: 0,
      CNY: 0,
    },
    artist: "",
    ent: "",
    thumbNail: "",
    descrip: "",
    weight: 0,
    x: 0,
    y: 0,
    z: 0,
    category: "",
    relDate: new Date(),
    preOrderDeadline: new Date(),
    pob: false,
    poster: false,
    photocard: false,
    weverseGift: false,
    interAsiaPhotocard: false,
    barcode: "",
    reStockable: "",
    exposeToB2b: "",
    stock: 0,
  });

  // 텍스트 숫자인풋
  const Inputs = [
    { sku: "sku" },
    { title: "제목" },
    { purchasePrice: "매입가" },
    { artist: "그룹명" },
    { ent: "소속사" },
    { thumbNail: "썸네일" },
    { descrip: "상세페이지" },
    { weight: "무게" },
    { x: "가로" },
    { y: "세로" },
    { z: "높이" },
    { barcode: "바코드" },
    { stock: "재고" },
    { KRW: "KRW" },
    { USD: "USD" },
    { EUR: "EUR" },
    { SGD: "SGD" },
    { JPY: "JPY" },
    { CNY: "CNY" },
  ];

  // 셀렉트인풋
  const selects = [
    {
      category: [
        { cd: "cd" },
        { "dvd/blue-ray": "dvdBlueRay" },
        { "photo book": "photoBook" },
        { goods: "goods" },
        { "official store": "officialStore" },
        { beauty: "beauty" },
      ],
    },
  ];

  const selectsName = ["카테고리"];

  // 체크박스 인풋
  const checkboxInput = [
    { poster: "Poster" },
    { pob: "POB" },
    { photocard: "Photocard" },
    { weverseGift: "Weverse Gift" },
    { interAsiaPhotocard: " InterAsia Photocard" },
  ];
  const Appp = async e => {
    e.preventDefault();

    await db
      .collection("products")
      .doc()
      .set({
        sku,
        purchasePrice: Number(purchasePrice),
        price: {
          KRW: Number(KRW),
          USD: Number(USD),
          EUR: Number(EUR),
          SGD: Number(SGD),
          JPY: Number(JPY),
          CNY: Number(CNY),
        },
        artist,
        ent,
        x: Number(x),
        stock: stock,
        y: Number(y),
        z: Number(z),
        title,
        thumbNail,
        descrip,
        weight: Number(weight),
        category,
        relDate: new Date(relDate),
        preOrderDeadline: new Date(preOrderDeadline),
        options: {
          poster,
          pob,
          photocard,
          weverseGift,
          interAsiaPhotocard,
        },
        barcode,
        reStockable: reStockable,
        exposeToB2b: exposeToB2b,
        bigC: {},
      });

    await reset();
    await alert("추가완료");
    history.push("/listproduct");
  };
  const saveProduct = async () => {
    allOrderProductsList.data.slice(0, 3).map(async (doc, index) => {
      await console.log(index);
      const batch = db.batch();
      const nycRef = db.collection("products").doc();

      await batch.set(nycRef, {
        sku: doc.sku,
        purchasePrice: 0,
        price: {
          KRW: 12000 + Number(index),
          USD: 10 + Number(index),
          EUR: 20 + Number(index),
          SGD: 30 + Number(index),
          JPY: 1200 + Number(index),
          CNY: 1300 + Number(index),
        },
        artist: "dummy",
        ent: "dummy",
        x: 10,
        stock: doc.inventory_level,
        y: 10,
        z: 10,
        title: doc.name,
        thumbNail:
          "https://firebasestorage.googleapis.com/v0/b/interasiastock.appspot.com/o/images%2FthumbNail%2F%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%5B%EB%AC%B4%EB%A3%8C%EB%B0%B0%EC%86%A1%5D%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20JYPN%20-%20BLIND%20PACKAGE%20(%ED%95%9C%EC%A0%95%EB%B0%98)%20%5B%ED%8C%90%EB%A7%A4%EA%B8%B0%EA%B0%84%207%EC%9B%94%2016%EC%9D%BC(%EA%B8%88)%20~%207%EC%9B%94%2025%EC%9D%BC(%EC%9D%BC)%20%EA%B9%8C%EC%A7%80%5D.jpg?alt=media&token=91208c5c-2060-4c34-a67c-f33642981115",
        descrip:
          "https://firebasestorage.googleapis.com/v0/b/interasiastock.appspot.com/o/images%2FthumbNail%2F%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%5B%EB%AC%B4%EB%A3%8C%EB%B0%B0%EC%86%A1%5D%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20JYPN%20-%20BLIND%20PACKAGE%20(%ED%95%9C%EC%A0%95%EB%B0%98)%20%5B%ED%8C%90%EB%A7%A4%EA%B8%B0%EA%B0%84%207%EC%9B%94%2016%EC%9D%BC(%EA%B8%88)%20~%207%EC%9B%94%2025%EC%9D%BC(%EC%9D%BC)%20%EA%B9%8C%EC%A7%80%5D.jpg?alt=media&token=91208c5c-2060-4c34-a67c-f33642981115",
        weight: doc.weight * 1000,
        category:
          doc.categories[0] === 169
            ? "cd"
            : doc.categories[0] === 200
            ? "dvdBlueRay"
            : doc.categories[0] === 205
            ? "goods"
            : doc.categories[0] === 237
            ? "officialStore"
            : doc.categories[0] === 206
            ? "beauty"
            : "cd",
        relDate: new Date(),
        preOrderDeadline: new Date(),
        options: {
          poster: false,
          pob: false,
          photocard: false,
          weverseGift: false,
          interAsiaPhotocard: false,
        },
        barcode: doc.upc,
        reStockable: "가능",
        exposeToB2b: "노출",
        bigC: { ...doc },
      });
      await batch.commit();
    });
  };

  return (
    <>
      <form className="w-3/5 m-auto my-20" onSubmit={Appp}>
        <div
          onClick={saveProduct}
          className="text-left text-2xl  
        text-gray-800 mb-1 ml-2 "
        >
          상품 추가
        </div>

        <div className="bg-white p-10 border">
          {Inputs.map((doc, index) => (
            <div key={index} className="grid grid-cols-4 p-2 items-center">
              <div className="text-gray-600 text-right mr-3">
                {Object.values(doc)}
              </div>
              <input
                required
                className="col-span-3 border h-9 pl-2"
                type="text"
                onChange={onChange}
                name={Object.keys(doc)}
              />
            </div>
          ))}
          {/* 날짜 인풋 */}
          <div className="grid grid-cols-4 p-2 items-center">
            <div className="text-gray-600 text-right  mr-3">출시일</div>
            <input
              required
              className="col-span-3 border h-9 pl-3"
              type="date"
              onChange={onChange}
              name="relDate"
            />
          </div>
          <div className="grid grid-cols-4 p-2 items-center">
            <div className="text-gray-600 text-right  mr-3">주문마감일</div>
            <input
              required
              className="col-span-3 border h-9 pl-3"
              type="date"
              onChange={onChange}
              name="preOrderDeadline"
            />
          </div>
          {/* 드랍박스 인풋 */}
          {/* 카테고리 */}
          {selects.map((select, index) => (
            <div key={index} className="grid grid-cols-4 p-2 items-center">
              <div className="text-gray-600 text-right  mr-3">
                {selectsName[index]}
              </div>
              <select
                required
                key={index}
                name={Object.keys(select)}
                onChange={onChange}
                className="col-span-3 border h-9 pl-3"
              >
                <option value="" defaultValue>
                  필수선택
                </option>
                {Object.values(select)[0].map((option, index) => (
                  <option key={index} value={Object.values(option)}>
                    {Object.keys(option)}
                  </option>
                ))}
              </select>
            </div>
          ))}
          {/* restockable, 활성/비활성 */}
          <div className="grid grid-cols-4 p-2 items-center">
            <div className="text-gray-600 text-right  mr-3">재고추가가능</div>
            <select
              required
              name="reStockable"
              onChange={onChange}
              className="col-span-3 border h-9 pl-3"
            >
              <option value="" defaultValue>
                필수선택
              </option>
              <option value={true}>가능</option>
              <option value={false}>불가능</option>
            </select>
          </div>
          <div className="grid grid-cols-4 p-2 items-center">
            <div className="text-gray-600 text-right  mr-3">B2B 활성화</div>
            <select
              required
              name="exposeToB2b"
              onChange={onChange}
              className="col-span-3 border h-9 pl-3"
            >
              <option value="" defaultValue>
                필수선택
              </option>
              <option value="노출">노출</option>
              <option value="숨김">숨김</option>
              <option value="DEAL">DEAL</option>
            </select>
          </div>
          {/* 체크박스 인풋 */}
          <div className="mt-10 mb-3 text-gray-800 text-lg">OPTIONS</div>
          <div className="grid grid-cols-3">
            {checkboxInput.map((doc, index) => (
              <div key={index} className="grid grid-cols-2 p-2 items-center">
                <div key={index} className="text-gray-600 text-right mr-3">
                  {Object.values(checkboxInput[index])}
                </div>
                <input
                  className=""
                  type="checkbox"
                  onChange={onChange}
                  name={Object.keys(doc)}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gray-600 py-2 px-10 rounded 
            text-gray-200 text-lg font-light
             "
            >
              SAVE
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddProduct;
