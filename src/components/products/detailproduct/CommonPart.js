import React from "react";
import useInputs from "../../../hooks/useInput";
import { db } from "../../../firebase";

const CommonPart = ({ product, id }) => {
  const [form, onChange] = useInputs({
    sku: product.data.sku,
    title: product.data.title,
    purchasePrice: product.data.purchasePrice,
    price: product.data.price,
    artist: product.data.artist,
    ent: product.data.ent,
    thumbNail: product.data.thumbNail,
    descrip: product.data.descrip,
    weight: product.data.weight,
    x: product.data.x,
    y: product.data.y,
    z: product.data.z,
    category: product.data.category,
    relDate: new Date(product?.data?.relDate?.seconds * 1000)
      .toISOString()
      .substring(0, 10),
    preOrderDeadline: new Date(product?.data?.preOrderDeadline?.seconds * 1000)
      .toISOString()
      .substring(0, 10),
    pob: product.data.options.pob,
    poster: product.data.options.poster,
    photocard: product.data.options.photocard,
    weverseGift: product.data.options.weverseGift,
    interAsiaPhotocard: product.data.options.interAsiaPhotocard,
    barcode: product.data.barcode,
    reStockable: product.data.reStockable,
    stock: product.data.stock,
    exposeToB2b: product.data.exposeToB2b,
  });
  const {
    sku,
    title,
    purchasePrice,
    price,
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
  } = form;

  // 텍스트 숫자인풋
  const Inputs = [
    { sku: "sku" },
    { title: "제목" },
    { purchasePrice: "매입가" },
    { price: "판매가" },
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
      .doc(id)
      .update({
        sku,
        purchasePrice: Number(purchasePrice),
        price: Number(price),
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
        reStockable,
        exposeToB2b,
      });

    await alert("수정 완료");
  };
  return (
    <div className="w-5/6 m-auto my-20">
      <div
        className="text-left text-xl  
        text-gray-800 mb-1 ml-2 "
      >
        COMMON
      </div>
      <form className="bg-white p-10 border" onSubmit={Appp}>
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
              value={form[Object.keys(doc)]}
              name={Object.keys(doc)}
            />
          </div>
        ))}{" "}
        {/* 날짜 인풋 */}
        <div className="grid grid-cols-4 p-2 items-center">
          <div className="text-gray-600 text-right  mr-3">출시일</div>
          <input
            required
            className="col-span-3 border h-9 pl-3"
            type="date"
            onChange={onChange}
            value={relDate}
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
            value={preOrderDeadline}
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
              value={form[Object.keys(select)]}
              className="col-span-3 border h-9 pl-3"
            >
              {/* <option value="" defaultValue>
                필수선택
              </option> */}
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
            value={reStockable}
            className="col-span-3 border h-9 pl-3"
          >
            {/* <option value="" defaultValue>
              필수선택
            </option> */}
            <option value="가능">가능</option>
            <option value="불가능">불가능</option>
          </select>
        </div>
        <div className="grid grid-cols-4 p-2 items-center">
          <div className="text-gray-600 text-right  mr-3">B2B 활성화</div>
          <select
            required
            name="exposeToB2b"
            onChange={onChange}
            value={exposeToB2b}
            className="col-span-3 border h-9 pl-3"
          >
            {/* <option value="" defaultValue>
              필수선택
            </option> */}
            <option value="노출">노출</option>
            <option value="숨김">숨김</option>
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
                value={form[Object.values(checkboxInput[index])]}
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
      </form>
    </div>
  );
};

export default CommonPart;
