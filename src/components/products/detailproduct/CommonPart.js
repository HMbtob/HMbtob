import React, { useState, useContext } from "react";
import axios from "axios";
import { InitDataContext } from "../../../App";
import { db } from "../../../firebase";
import useInputs from "../../../hooks/useInput";
import firebase from "firebase";

const CommonPart = ({ product, id }) => {
  const state = useContext(InitDataContext);
  const { user } = state;

  // 썸넬

  const [thumbnailUrl, setThumbnailUrl] = useState(product.data.thumbNail);
  const handleThumbnail = e => {
    setThumbnailUrl(e.target.value);
  };
  // 디스크립션-이미지

  const [discripUrl, setDiscripUrl] = useState(product.data.discripUrl || "");
  const handleDiscrip = e => {
    setDiscripUrl(e.target.value);
  };
  // 디스크립션 텍스트

  // 체크박스

  const [form, onChange] = useInputs({
    sku: product.data.sku,
    title: product.data.title,
    purchasePrice: product.data.purchasePrice,
    price: product.data.price,
    artist: product.data.artist,
    ent: product.data.ent,
    weight: product.data.weight,
    x: product.data.x,
    y: product.data.y,
    z: product.data.z,
    category: product.data.category,
    relDate: new Date(product.data.relDate.seconds * 1000)
      .toISOString()
      .substring(0, 10),
    preOrderDeadline: new Date(product.data.preOrderDeadline.seconds * 1000)
      .toISOString()
      .substring(0, 19),
    pob: false,
    poster: false,
    photocard: false,
    weverseGift: false,
    interAsiaPhotocard: false,
    barcode: product.data.barcode,
    reStockable: product.data.reStockable,
    exposeToB2b: product.data.exposeToB2b,
    inventoryLevel: product.data.inventoryLevel,
    brandId: product.data.brandId,
    brandName: product.data.brandName,
    customFieldName: "RELEASE DATE",
  });

  // 텍스트 숫자인풋
  const Inputs = [
    { sku: "sku" },
    { title: "제목" },
    { price: "도매가" },
    { purchasePrice: "매입가" },
    { artist: "그룹명" },
    { ent: "소속사" },
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
        { "dvd/blue-ray": "dvdBlueRay" },
        { "photo book": "photoBook" },
        { goods: "goods" },
        { "store goods": "officialStore" },
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

  const {
    sku,
    title,
    purchasePrice,
    artist,
    ent,
    category,
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
    exposeToB2b,
    price,
  } = form;
  // 섬넬
  const getImages = async () => {
    await axios
      .get(
        `https://us-central1-interasiastock.cloudfunctions.net/app/big/getThumbnail`,
        {
          params: {
            url: thumbnailUrl,
            title: title,
          },
        }
      )
      .then(res => setThumbnailUrl(res.data))
      .catch(e => console.log(e));
  };
  // 디스크립션
  const getDisc = async () => {
    await axios
      .get(
        `https://us-central1-interasiastock.cloudfunctions.net/app/big/getdesc`,
        {
          params: {
            url: discripUrl,
            title: title,
          },
        }
      )
      .then(res => setDiscripUrl(res.data))
      .catch(e => console.log(e));
  };

  const Appp = async e => {
    e.preventDefault();

    // 복사 or 수정?
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
        y: Number(y),
        z: Number(z),
        title,
        thumbNail: thumbnailUrl,
        discripUrl,
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
        // bigC: bigC,
        productMemo: firebase.firestore.FieldValue.arrayUnion({
          memo: "Fix product on list",
          date: new Date(),
          writer:
            user.nickName && user.nickName.length > 0
              ? user.nickName
              : user.email,
        }),
      });

    await alert("수정완료");
  };

  return (
    <>
      <div className="w-3/5 m-auto my-20">
        <div
          className="text-left text-2xl  
        text-gray-800 mb-1 ml-2 "
        >
          상품 수정
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
                value={form[Object.keys(doc)]}
              />
            </div>
          ))}
          {/* 날짜 인풋 */}
          <div className="grid grid-cols-4 p-2 items-center">
            <div className="text-gray-600 text-right  mr-3">출시일</div>
            <input
              className="col-span-3 border h-9 pl-3"
              type="date"
              onChange={onChange}
              value={relDate}
              name="relDate"
            />
          </div>
          <div className="grid grid-cols-4 p-2 items-center">
            <div className="text-gray-600 col-span-1 text-right  mr-3">
              주문마감일
            </div>
            <input
              className="col-span-3 border h-9 pl-3"
              type="datetime-local"
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
                value={category}
                className="col-span-3 border h-9 pl-3"
              >
                <option>필수선택</option>
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
              <option>필수선택</option>
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
              <option>필수선택</option>
              <option value="노출">노출</option>
              <option value="숨김">숨김</option>
              <option value="DEAL">DEAL</option>
            </select>
          </div>
          {/*썸넬 */}
          <div className="grid grid-cols-4 p-2 items-center">
            <div className="text-gray-600 text-right mr-3">썸네일</div>
            <input
              className="col-span-3 border h-9 pl-2"
              type="text"
              onChange={handleThumbnail}
              name="thumbnailUrl"
              value={thumbnailUrl}
              placeholder="이미지 주소 복사해서 붙혀넣기 후 엔터. 소요시간 10초"
              onKeyPress={e => {
                if (e.key === "Enter") {
                  getImages();
                  return false;
                }
              }}
            />
          </div>
          {/*disc */}
          <div className="grid grid-cols-4 p-2 items-center">
            <div className="text-gray-600 text-right mr-3">상세페이지</div>
            <input
              className="col-span-3 border h-9 pl-2"
              type="text"
              onChange={handleDiscrip}
              name="discripUrl"
              value={discripUrl}
              placeholder="이미지 주소 복사해서 붙혀넣기 후 엔터. 소요시간 10초"
              onKeyPress={e => {
                if (e.key === "Enter") {
                  getDisc();
                  return false;
                }
              }}
            />
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
              // type="submit"
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

export default CommonPart;
