import React from "react";
import useInputs from "../../../hooks/useInput";
import { db } from "../../../firebase";
import { useHistory } from "react-router";

const AddProduct = () => {
  const history = useHistory();
  const [
    {
      sku,
      title,
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
      pob,
      poster,
      photocard,
      postcard,
      gift,
      barcode,
    },
    onChange,
    reset,
  ] = useInputs({
    sku: "",
    title: "",
    price: 0,
    artist: "",
    ent: "",
    thumbNail: "",
    descrip: "",
    weight: 0,
    x: 0,
    y: 0,
    z: 0,
    category: "cd",
    relDate: new Date(),
    preOrderDeadline: new Date(),
    pob: false,
    poster: false,
    photocard: false,
    postcard: false,
    gift: false,
    barcode: "",
  });

  // 텍스트 숫자인풋
  const Inputs = [
    { sku: "sku" },
    { title: "제목" },
    { price: "가격" },
    { artist: "그룹명" },
    { ent: "소속사" },
    { thumbNail: "썸네일" },
    { descrip: "상세페이지" },
    { weight: "무게" },
    { x: "가로" },
    { y: "세로" },
    { z: "높이" },
    { barcode: "바코드" },
  ];

  // 셀렉트인풋
  const selects = [
    {
      category: [
        { cd: "cd" },
        { dvd: "dvd" },
        { goods: "goods" },
        { limited: "limited" },
        { per: "per" },
        { beauty: "beauty" },
      ],
    },
  ];

  const selectsName = ["카테고리"];

  // 체크박스 인풋
  const checkboxInput = [
    { pob: "선주문특전" },
    { poster: "포스터" },
    { photocard: "포토카드" },
    { postcard: "엽서" },
    { gift: "특전" },
  ];
  const Appp = () => {
    db.collection("products")
      .doc()
      .set({
        sku,
        price: Number(price),
        artist,
        ent,
        x: Number(x),
        addedFrom: "add",
        stock: 0,
        added: { b2b: false },
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
          pob,
          poster,
          photocard,
          postcard,
          gift,
        },
        barcode,
        totalSell: 0,
        unShipped: 0,
      });
    reset();
    alert("저장 완료");
    history.push("/listproduct");
  };
  return (
    <>
      {" "}
      <div className="w-3/5 m-auto my-20">
        <div
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
                className="col-span-3 border h-9 pl-2"
                type="text"
                onChange={onChange}
                name={Object.keys(doc)}
              />
            </div>
          ))}{" "}
          {/* 날짜 인풋 */}
          <div className="grid grid-cols-4 p-2 items-center">
            <div className="text-gray-600 text-right  mr-3">출시일</div>
            <input
              className="col-span-3 border h-9 pl-3"
              type="date"
              onChange={onChange}
              name="relDate"
            />
          </div>
          <div className="grid grid-cols-4 p-2 items-center">
            <div className="text-gray-600 text-right  mr-3">주문마감일</div>
            <input
              className="col-span-3 border h-9 pl-3"
              type="date"
              onChange={onChange}
              name="preOrderDeadline"
            />
          </div>
          {/* 드랍박스 인풋 */}
          {selects.map((select, index) => (
            <div key={index} className="grid grid-cols-4 p-2 items-center">
              <div className="text-gray-600 text-right  mr-3">
                {selectsName[index]}
              </div>
              <select
                key={index}
                name={Object.keys(select)}
                onChange={onChange}
                className="col-span-3 border h-9 pl-3"
              >
                {Object.values(select)[0].map((option, index) => (
                  <option key={index} value={Object.values(option)}>
                    {Object.keys(option)}
                  </option>
                ))}
              </select>
            </div>
          ))}
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
              onClick={Appp}
              className="bg-gray-600 py-2 px-10 rounded 
            text-gray-200 text-lg font-light
             "
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
